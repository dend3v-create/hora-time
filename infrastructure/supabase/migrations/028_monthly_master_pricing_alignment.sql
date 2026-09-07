-- 028_monthly_master_pricing_alignment.sql
-- Phopephum OS — Pricing Source of Truth Alignment (NO LIFETIME PLAN)
-- Master (Imperial) is ฿789 / month (30 days duration).
-- Removes lifetime duration logic for 'imperial' and sets 30-day monthly cycle.

-- 1. อัปเดต Check Constraint บน profiles.subscription เพื่อรองรับ 'master' และ 'pro' อย่างเป็นทางการ
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_subscription_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_subscription_check 
    CHECK (subscription IN ('free', 'basic', 'premium', 'pro', 'master', 'lifetime'));

-- 2. ปรับปรุง RPC: record_payment_and_activate_subscription_atomic ให้ 'imperial' เป็น 30 วัน (Monthly)
CREATE OR REPLACE FUNCTION public.record_payment_and_activate_subscription_atomic(
    p_user_id UUID,
    p_provider TEXT,
    p_provider_transaction_id TEXT,
    p_payment_method TEXT,
    p_gross_amount_thb NUMERIC,
    p_gateway_fee_thb NUMERIC,
    p_gateway_vat_thb NUMERIC,
    p_net_received_thb NUMERIC,
    p_subscription_plan_code TEXT,
    p_vat_rate NUMERIC DEFAULT 0.07,
    p_idempotency_key TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_existing_tx_id UUID;
    v_new_tx_id UUID;
    v_vat_amount NUMERIC;
    v_sub_tier TEXT;
    v_duration_days INT;
    v_current_expires_at TIMESTAMPTZ;
    v_new_expires_at TIMESTAMPTZ;
    v_is_sands_purchase BOOLEAN;
BEGIN
    -- 1. Idempotency Guard
    IF p_idempotency_key IS NOT NULL THEN
        SELECT id INTO v_existing_tx_id
        FROM public.payment_transactions
        WHERE idempotency_key = p_idempotency_key;

        IF v_existing_tx_id IS NOT NULL THEN
            RETURN jsonb_build_object(
                'status', 'already_processed',
                'payment_transaction_id', v_existing_tx_id,
                'message', 'Transaction previously processed'
            );
        END IF;
    END IF;

    -- 2. คำนวณ VAT
    IF p_vat_rate > 0 THEN
        v_vat_amount := ROUND(p_gross_amount_thb * p_vat_rate / (1.0 + p_vat_rate), 2);
    ELSE
        v_vat_amount := 0.00;
    END IF;

    -- 3. ตรวจสอบประเภทรายการ
    IF p_subscription_plan_code LIKE 'sands_%' OR p_subscription_plan_code = 'sands_refill' THEN
        v_is_sands_purchase := true;
    ELSE
        v_is_sands_purchase := false;
        
        SELECT membership_expires_at INTO v_current_expires_at
        FROM public.profiles
        WHERE id = p_user_id;

        -- กฎเหล็ก: Master (Imperial ฿789) เป็นแผนรายเดือน (30 วัน) ไม่มี Lifetime
        IF p_subscription_plan_code IN ('imperial', 'master', 'master_monthly') THEN
            v_sub_tier := 'master';
            v_duration_days := 30;
        ELSIF p_subscription_plan_code IN ('pro_annual', 'annual') THEN
            v_sub_tier := 'pro';
            v_duration_days := 365;
        ELSIF p_subscription_plan_code IN ('pro', 'pro_monthly') THEN
            v_sub_tier := 'pro';
            v_duration_days := 30;
        ELSIF p_subscription_plan_code IN ('basic', 'basic_monthly', 'premium', 'premium_monthly') THEN
            v_sub_tier := 'premium';
            v_duration_days := 30;
        ELSE
            v_sub_tier := 'premium';
            v_duration_days := 30;
        END IF;

        IF v_current_expires_at IS NOT NULL AND v_current_expires_at > now() THEN
            v_new_expires_at := v_current_expires_at + (v_duration_days || ' days')::INTERVAL;
        ELSE
            v_new_expires_at := now() + (v_duration_days || ' days')::INTERVAL;
        END IF;
    END IF;

    -- 4. บันทึก Payment Transaction
    INSERT INTO public.payment_transactions (
        user_id,
        provider,
        provider_transaction_id,
        payment_method,
        gross_amount_thb,
        gateway_fee_thb,
        gateway_vat_thb,
        net_received_thb,
        vat_rate_applied,
        vat_amount_thb,
        subscription_plan_code,
        idempotency_key,
        status,
        metadata
    ) VALUES (
        p_user_id,
        p_provider,
        p_provider_transaction_id,
        p_payment_method,
        p_gross_amount_thb,
        p_gateway_fee_thb,
        p_gateway_vat_thb,
        p_net_received_thb,
        p_vat_rate,
        v_vat_amount,
        p_subscription_plan_code,
        p_idempotency_key,
        'successful',
        p_metadata
    ) RETURNING id INTO v_new_tx_id;

    -- 5. หากเป็น Membership Subscription ให้อัปเดต Profile สมาชิก
    IF NOT v_is_sands_purchase THEN
        UPDATE public.profiles
        SET plan = p_subscription_plan_code,
            subscription = v_sub_tier,
            membership_status = 'active',
            membership_expires_at = v_new_expires_at,
            updated_at = now()
        WHERE id = p_user_id;

        UPDATE public.subscription_requests
        SET status = 'approved',
            approved_at = now()
        WHERE user_id = p_user_id
          AND status = 'pending'
          AND plan = p_subscription_plan_code;
    ELSE
        UPDATE public.subscription_requests
        SET status = 'approved',
            approved_at = now()
        WHERE user_id = p_user_id
          AND status = 'pending'
          AND plan = p_subscription_plan_code;
    END IF;

    RETURN jsonb_build_object(
        'status', 'success',
        'payment_transaction_id', v_new_tx_id,
        'subscription_tier', CASE WHEN v_is_sands_purchase THEN NULL ELSE v_sub_tier END,
        'membership_expires_at', CASE WHEN v_is_sands_purchase THEN NULL ELSE v_new_expires_at END
    );
END;
$$;

-- 3. ปรับปรุง RPC: record_omise_payment_and_activate_atomic
CREATE OR REPLACE FUNCTION public.record_omise_payment_and_activate_atomic(
    p_user_id UUID,
    p_omise_charge_id TEXT,
    p_payment_method TEXT,
    p_gross_amount_thb NUMERIC,
    p_gateway_fee_thb NUMERIC,
    p_gateway_vat_thb NUMERIC,
    p_net_received_thb NUMERIC,
    p_subscription_plan_code TEXT,
    p_vat_rate NUMERIC DEFAULT 0.07,
    p_idempotency_key TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT '{}'::JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN public.record_payment_and_activate_subscription_atomic(
        p_user_id := p_user_id,
        p_provider := 'omise',
        p_provider_transaction_id := p_omise_charge_id,
        p_payment_method := p_payment_method,
        p_gross_amount_thb := p_gross_amount_thb,
        p_gateway_fee_thb := p_gateway_fee_thb,
        p_gateway_vat_thb := p_gateway_vat_thb,
        p_net_received_thb := p_net_received_thb,
        p_subscription_plan_code := p_subscription_plan_code,
        p_vat_rate := p_vat_rate,
        p_idempotency_key := p_idempotency_key,
        p_metadata := p_metadata
    );
END;
$$;
