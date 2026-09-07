import { useState, useMemo } from "react";
import { Link } from "@remix-run/react";
import { calculateAuspiciousTime, type AuspiciousSlot } from "@phopephum/engine";

export type ActivityKey = "deal" | "project" | "finance" | "relationship";

interface ActivityOption {
  key: ActivityKey;
  label: string;
  icon: string;
  sublabel: string;
  matchKeywords: string[];
}

const ACTIVITIES: ActivityOption[] = [
  {
    key: "deal",
    label: "เจรจา / ปิดดีล",
    icon: "🤝",
    sublabel: "เซ็นสัญญา คุยงาน เสนอราคา",
    matchKeywords: ["เจรจา", "ทำสัญญา", "ประชุมสำคัญ", "สัมภาษณ์งาน"],
  },
  {
    key: "project",
    label: "เริ่มต้นโปรเจกต์",
    icon: "🚀",
    sublabel: "เปิดตัวงาน เริ่มกิจการ ส่งมอบงาน",
    matchKeywords: ["เริ่มต้นสิ่งดี", "เปิดตัวโปรเจกต์", "ขยายธุรกิจ", "สมัครงาน"],
  },
  {
    key: "finance",
    label: "การเงิน / โชคลาภ",
    icon: "💰",
    sublabel: "ลงทุน ค้าขาย ทวงหนี้ ขอสินเชื่อ",
    matchKeywords: ["ลงทุน", "ค้าขาย", "ขยายธุรกิจ"],
  },
  {
    key: "relationship",
    label: "ความสัมพันธ์ / ผู้ใหญ่",
    icon: "✨",
    sublabel: "เข้าพบผู้ใหญ่ ขอความเมตตา สร้างมิตรภาพ",
    matchKeywords: ["เข้าพบผู้ใหญ่", "สร้างความสัมพันธ์", "ความรัก"],
  },
];

export function HeroAuspiciousWidget() {
  const [selectedActivity, setSelectedActivity] = useState<ActivityKey>("deal");
  const [dayOffset, setDayOffset] = useState<0 | 1>(0); // 0 = วันนี้, 1 = พรุ่งนี้

  // คำนวณช่วงเวลามงคลตามวันที่เลือก
  const targetDate = useMemo(() => {
    const d = new Date();
    if (dayOffset === 1) {
      d.setDate(d.getDate() + 1);
    }
    return d;
  }, [dayOffset]);

  const auspiciousResult = useMemo(() => {
    return calculateAuspiciousTime(targetDate);
  }, [targetDate]);

  const currentActivity = ACTIVITIES.find((a) => a.key === selectedActivity) || ACTIVITIES[0];

  // คัดเลือก 3 ช่วงเวลาทอง (Golden Windows) ที่ตรงกับกิจกรรมมากที่สุด หรือมีระดับดีมาก
  const goldenWindows = useMemo(() => {
    const slots = auspiciousResult.auspiciousSlots || [];

    // ให้คะแนนความเหมาะสมตามกิจกรรม
    const scoredSlots = slots.map((slot) => {
      let score = 0;
      if (slot.level === "ดีมาก") score += 50;
      else if (slot.level === "ดี") score += 30;
      else if (slot.level === "ปานกลาง") score += 10;
      else score -= 50;

      const hasDirectKeyword = slot.suitableFor.some((item) =>
        currentActivity.matchKeywords.some((kw) => item.includes(kw) || kw.includes(item))
      );
      if (hasDirectKeyword) score += 40;

      return { slot, score };
    });

    // เรียงจากคะแนนสูงสุด แล้วตัดมา 3 ช่วงเวลา
    scoredSlots.sort((a, b) => b.score - a.score);
    const top3 = scoredSlots.slice(0, 3).map((item) => item.slot);

    // เรียงตามเวลาเพื่อให้อ่านง่าย
    top3.sort((a, b) => a.timeRange.localeCompare(b.timeRange));
    return top3;
  }, [auspiciousResult, currentActivity]);

  return (
    <div className="relative rounded-3xl border border-[#C6A96B]/30 bg-gradient-to-b from-[#0B1528]/95 via-[#07172A]/95 to-[#040D1A]/95 p-5 sm:p-7 backdrop-blur-2xl shadow-2xl shadow-[#C6A96B]/10 overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#C6A96B]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-60 h-60 rounded-full bg-[#4B6FAE]/15 blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C6A96B]/20 text-[#C6A96B] text-xs font-bold">
              ✦
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C6A96B]">
              Interactive Live Demo · หาฤกษ์ให้ฉัน
            </span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-bold text-[#F8F6F1] mt-1">
            ค้นหา 3 ช่วงเวลาทองที่ดีที่สุดของคุณ
          </h3>
        </div>

        {/* Day Toggle */}
        <div className="inline-flex self-start sm:self-auto p-1 rounded-xl border border-white/15 bg-white/[0.04]">
          <button
            type="button"
            onClick={() => setDayOffset(0)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dayOffset === 0
                ? "bg-gradient-to-r from-[#C6A96B] to-[#D9BC82] text-[#020617] shadow-sm"
                : "text-[#94A3B8] hover:text-[#F8F6F1]"
            }`}
          >
            วันนี้ ({auspiciousResult.dayName})
          </button>
          <button
            type="button"
            onClick={() => setDayOffset(1)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dayOffset === 1
                ? "bg-gradient-to-r from-[#C6A96B] to-[#D9BC82] text-[#020617] shadow-sm"
                : "text-[#94A3B8] hover:text-[#F8F6F1]"
            }`}
          >
            พรุ่งนี้
          </button>
        </div>
      </div>

      {/* Step 1: Activity Selector */}
      <div className="mt-5">
        <label className="block text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2.5">
          1. เลือกกิจกรรมที่คุณต้องการทำ:
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {ACTIVITIES.map((act) => {
            const isSelected = selectedActivity === act.key;
            return (
              <button
                key={act.key}
                type="button"
                onClick={() => setSelectedActivity(act.key)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? "border-[#C6A96B] bg-[#C6A96B]/15 shadow-md shadow-[#C6A96B]/15 scale-[1.02]"
                    : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <div className="text-xl mb-1.5">{act.icon}</div>
                <div>
                  <div className={`text-xs font-bold ${isSelected ? "text-[#F8F6F1]" : "text-slate-300"}`}>
                    {act.label}
                  </div>
                  <div className="text-[10px] text-[#94A3B8] line-clamp-1 mt-0.5">{act.sublabel}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step 2: Golden Windows Output */}
      <div className="mt-6 pt-5 border-t border-white/10">
        <div className="flex items-center justify-between mb-3">
          <label className="text-[11px] font-bold text-[#C6A96B] uppercase tracking-wider flex items-center gap-1.5">
            <span>✨</span>
            <span>3 ช่วงเวลาทองที่แนะนำสำหรับ &quot;{currentActivity.label}&quot;</span>
          </label>
          <span className="text-[10px] text-[#94A3B8]">
            {auspiciousResult.lunarInfo || "ตามหลักยามอัฏฐกาลและทักษาจักรพรรดิ"}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {goldenWindows.map((slot, index) => {
            const isTopRank = index === 0;
            return (
              <div
                key={index}
                className={`relative rounded-2xl p-4 border transition-all ${
                  isTopRank
                    ? "border-[#C6A96B]/60 bg-gradient-to-b from-[#C6A96B]/15 to-transparent shadow-lg shadow-[#C6A96B]/10"
                    : "border-white/10 bg-white/[0.02]"
                }`}
              >
                {isTopRank && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-[#C6A96B] text-[#020617] uppercase tracking-wider">
                    ช่วงเวลาดีที่สุด
                  </span>
                )}
                <div className="flex items-baseline justify-between mb-1.5">
                  <div className="font-mono text-base sm:text-lg font-bold text-[#F8F6F1]">
                    {slot.timeRange}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      slot.level === "ดีมาก"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                    }`}
                  >
                    {slot.level}
                  </span>
                </div>

                <div className="text-[11px] text-[#C6A96B] font-semibold mb-1">
                  ยาม{slot.planeta} · พลังงานมงคล
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed font-sarabun">
                  {slot.advice || `เหมาะแก่${slot.suitableFor.join(", ")}`}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 3: Next Action CTA Bar */}
      <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white/[0.02] -mx-5 -mb-5 sm:-mx-7 sm:-mb-7 p-5 sm:p-6 rounded-b-3xl">
        <div className="text-center sm:text-left">
          <p className="text-xs font-semibold text-[#F8F6F1]">
            นี่คือฤกษ์กาลชะตาสากลประจำวัน · ต้องการวิเคราะห์คำนวณผูกดวงกับวันเกิดของคุณเอง?
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">
            สมัครง่ายใน 1 นาที ไม่ต้องกรอกบัตรเครดิต รับแผนที่ชีวิตและ 35 ภพเรือนฟรีทันที
          </p>
        </div>

        <Link
          to="/register"
          className="shrink-0 w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#C6A96B] via-[#D9BC82] to-[#C6A96B] text-[#020617] shadow-lg shadow-[#C6A96B]/25 hover:shadow-xl hover:scale-[1.02] transition-all"
        >
          <span>เริ่มต้นใช้งานฟรี</span>
          <span className="text-sm">→</span>
        </Link>
      </div>
    </div>
  );
}
