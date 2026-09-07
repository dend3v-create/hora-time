import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/cloudflare";
import { json } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { captureReferralClick } from "~/services/attribution.server";
import { getUser } from "~/services/auth.server";
import type { Env } from "~/env.server";
import { PublicLayout } from "~/components/public/PublicLayout";
import { AstralIcon } from "~/components/ui/AstralIcon";

export const meta: MetaFunction = () => [
  { title: "ภพภูมิ (PHOPEPHUM OS) — Data Science ของชีวิต | AI-Powered Life Guidance Platform" },
  {
    name: "description",
    content:
      "ระบบปฏิบัติการ PhoPePhum OS เปลี่ยนศาสตร์เร้นลับให้เป็น Data Science ของชีวิต ผสานคัมภีร์สุริยยาตร์ วิชาเลข ๗ ตัว ๙ ฐาน 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน กาลชะตา Real-time และ KARNCHATA ENGINE V2.0 ถอดรหัสศักยภาพและกำหนดจังหวะเวลา (Timing) ที่ใช่ที่สุดในการลงมือทำ",
  },
  { property: "og:type", content: "website" },
  { property: "og:url", content: "https://phopephum.com" },
  { property: "og:title", content: "PHOPEPHUM OS — Data Science ของชีวิต | ทุกคำถามของชีวิต... มีแนวทางเสมอ" },
  {
    property: "og:description",
    content:
      "ชีวิตที่ดีขึ้น เริ่มได้จากการรู้จักตัวเอง สัมผัสประสบการณ์ AI Guidance Platform ที่ผสานภูมิปัญญาโหราศาสตร์ไทยโบราณกับ AI Matching แม่นยำระดับนาทีด้วย KARNCHATA ENGINE V2.0 เริ่มต้นใช้งานฟรี",
  },
  { property: "og:image", content: "https://phopephum.com/favicon.svg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:title", content: "ภพภูมิ (PHOPEPHUM OS) — AI-Powered Life Guidance Platform" },
  {
    name: "twitter:description",
    content:
      "เปลี่ยนมุมมองจากการทำนาย สู่ Data Science ของชีวิต ด้วยระบบคิดเชิงระบบ (System Thinking) และหลักการ CAP Theory: Confident, Action, Proactive",
  },
  {
    name: "keywords",
    content:
      "ภพภูมิ, PhoPePhum OS, Data Science ของชีวิต, KARNCHATA ENGINE, เลข 7 ตัว 9 ฐาน, คัมภีร์สุริยยาตร์, ยามอัฏฐกาล, ยามพรายกระซิบ, ราหูค้นทรัพย์, ผังดวงจักรพรรดิ, AI ดูดวง, โหราศาสตร์ไทย, นักพยากรณ์บำบัด, CAP Theory",
  },
];

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const ref = url.searchParams.get("ref");
  const campaign = url.searchParams.get("c") || url.searchParams.get("utm_campaign") || null;
  const env = context.cloudflare.env as Env;

  const user = await getUser(request, env).catch(() => null);

  if (ref) {
    const { headers } = await captureReferralClick({
      request,
      partnerCode: ref,
      campaignCode: campaign,
      env,
    });
    return json({ isLoggedIn: !!user }, { headers });
  }

  return json({ isLoggedIn: !!user });
}

export default function Index() {
  const { isLoggedIn } = useLoaderData<typeof loader>();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // ── Pain Points vs Solution ──
  const painPoints = [
    {
      problem: "ทำไมลงแรงไปตั้งมากมาย แต่ผลลัพธ์กลับไม่เป็นอย่างที่คิด?",
      rootCause: "ขาดการจับจังหวะเวลา (Timing Mismatch)",
      solution: "ระบบกาลชะตา Real-time ชี้ชัดช่วงเวลาที่ดวงจรหนุนดาวอุตสาหะ ลงแรงแล้วเกิดผลสัมฤทธิ์สูงสุดทันที",
      icon: "⚡",
    },
    {
      problem: "ต้องตัดสินใจเรื่องสำคัญ แต่ไม่มั่นใจว่า 'เวลานี้' เหมาะสมหรือไม่?",
      rootCause: "ขาดข้อมูลรอบด้านและสถิติอ้างอิง",
      solution: "ผังดวงจักรพรรดิซ้อนทับวัยจร ปีจร และทักษาจร ให้คุณเห็นมิติเวลารอบด้าน ตัดสินใจด้วยตรรกะ ไม่ใช่ความเสี่ยง",
      icon: "🎯",
    },
    {
      problem: "รู้สึกว่าตัวเองมีของ แต่หาจุดเด่นหรือเส้นทางที่ใช่ไม่เจอ?",
      rootCause: "ไม่เคยถอดรหัสโครงสร้างจิตและศักยภาพเดิม",
      solution: "วิชาเลข ๗ ตัว ๙ ฐาน 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน อ่านลึกถึงรหัสกรรม พรสวรรค์ที่ซ่อนเร้น และราหูค้นทรัพย์เพื่อชี้เป้าขุมพลังในตัวคุณ",
      icon: "💎",
    },
  ];

  // ── 4 มิติแห่งชีวิต (4 Core Life Dimensions) ──
  const lifeDimensions = [
    {
      id: "career",
      title: "การงาน",
      english: "CAREER",
      subtitle: "เส้นทาง · ศักยภาพ · จังหวะทอง",
      highlight: "ลงแรงถูกเวลา",
      desc: "ค้นหาศักยภาพที่แท้จริงในรหัสกำเนิด รู้จังหวะเวลาทอง (Golden Window) สำหรับการเจรจา พรีเซนต์ เลื่อนตำแหน่ง หรือเปลี่ยนสายงานอย่างแม่นยำ",
      icon: (
        <svg className="w-6 h-6 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="7" r="4" />
          <path d="M5.5 21v-2a6.5 6.5 0 0 1 13 0v2" />
        </svg>
      ),
    },
    {
      id: "finance",
      title: "การเงิน",
      english: "FINANCE",
      subtitle: "ราหูค้นทรัพย์ · โชคลาภ · สภาพคล่อง",
      highlight: "ชี้เป้าขุมทรัพย์",
      desc: "ถอดรหัสธาตุเจ้าเรือนการเงิน จับกระแสรอบวัฏจักรโชคลาภ และใช้เครื่องมือราหูค้นทรัพย์เพื่อหาทิศทางความมั่งคั่งและช่วงเวลาที่ควรขยับขยาย",
      icon: (
        <svg className="w-6 h-6 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="8" cy="8" r="6" />
          <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
          <path d="M7 6h2v4H7z" />
        </svg>
      ),
    },
    {
      id: "love",
      title: "ความรัก",
      english: "LOVE",
      subtitle: "เคมีสัมพันธ์ · ความเข้าใจ · ลดแรงปะทะ",
      highlight: "เข้าใจไร้ข้อกังขา",
      desc: "ถอดรหัสดาวคู่ครอง พื้นฐานอารมณ์ และเคมีความสัมพันธ์ สร้างความเข้าใจลึกซึ้ง รู้จังหวะถอยและจังหวะประสานใจเพื่อความผูกพันที่มั่นคง",
      icon: (
        <svg className="w-6 h-6 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      ),
    },
    {
      id: "guidance",
      title: "การตัดสินใจ",
      english: "GUIDANCE",
      subtitle: "เข็มทิศชีวิต · กลยุทธ์ · ทางเลือก",
      highlight: "คุมเกมด้วยสติ",
      desc: "เมื่อชีวิตมาถึงทางแยกสำคัญ มีข้อมูลสถิติและตรรกะแห่งกาลเวลานำทาง ไม่ตกเป็นทาสของความกลัวหรือความโลภ มองเห็นทางเลือกที่ชัดเจนและสงบนิ่ง",
      icon: (
        <svg className="w-6 h-6 text-[#D4AF37]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" fill="currentColor" fillOpacity="0.2" />
        </svg>
      ),
    },
  ];

  // ── FAQs ──
  const faqs = [
    {
      q: "PhoPePhum OS คืออะไร และแตกต่างจากการดูดวงทั่วไปอย่างไร?",
      a: "PhoPePhum OS คือ AI-Powered Life Guidance Platform ที่เปลี่ยนศาสตร์เร้นลับให้เป็น 'Data Science ของชีวิต' ความแม่นยำเกิดจากการนำตรรกะคณิตศาสตร์ของโหราศาสตร์โบราณ (คัมภีร์สุริยยาตร์ และวิชาเลข ๗ ตัว ๙ ฐาน 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน) มาทำงานร่วมกับกาลชะตา Real-time และใช้ KARNCHATA ENGINE V2.0 ในการ Matching ดวงเดิมเข้ากับดวงจรเฉพาะตัวบุคคล จึงไม่ใช่การทายเหมาโหล แต่เป็นแผนที่ชีวิตที่มีตรรกะอ้างอิงได้ชัดเจน",
    },
    {
      q: "ระบบประมวลผลกาลชะตา Real-time มีประโยชน์อย่างไร?",
      a: "ในโหราศาสตร์โบราณ พลังงานของดวงดาวและยามมีการเปลี่ยนผ่านระดับย่อย (อันตรยาม/ลิปดา) การคำนวณแบบ Real-time ทำให้ระบบรู้ว่า 'ณ เวลานี้' ดาวดวงไหนกำลังส่งอิทธิพลต่อดวงกำเนิดของคุณ ช่วยชี้เป้าหน้าต่างเวลาทอง (Golden Window) เช่น ช่วงเวลาที่ควรเจรจา หรือช่วงที่ควรพักเพื่อหลีกเลี่ยงความขัดแย้ง",
    },
    {
      q: "ระบบ Multi-select Overlay Filter บนผังดวงจักรพรรดิ ช่วยอะไรได้บ้าง?",
      a: "ปกติการดูดวงแบบลึกซึ้งต้องเปิดตำราหลายเล่ม แต่ระบบของ PhoPePhum อนุญาตให้ซ้อนทับเลเยอร์ของ วัยจร ปีจร เดือนจร ลัคนาเกิด ลัคนาจร และทักษาจร ลงบนหน้าจอเดียว ทำให้เห็นจุดตัดของพลังงานชีวิตในทุกมิติเวลาแบบทะลุปรุโปร่งในคลิกเดียว",
    },
    {
      q: "หลักการ CAP Theory ที่แพลตฟอร์มใช้คืออะไร?",
      a: "CAP Theory คือหัวใจของการนำผลวิเคราะห์ไปใช้งานจริง: 1) Confident — มั่นใจในทุกก้าวด้วยฐานข้อมูลสถิติที่เสถียร 2) Action — รู้จังหวะเวลาที่ควรลงมือทำเพื่อสร้างผลลัพธ์ก้าวกระโดด และ 3) Proactive — คุมเกมชีวิตล่วงหน้าด้วยการวางแผนป้องกันความเสี่ยงและเปลี่ยนความไม่แน่นอนให้เป็นความได้เปรียบ",
    },
    {
      q: "หากไม่ทราบเวลาตกฟากที่แน่นอน ยังสามารถใช้งานได้หรือไม่?",
      a: "ใช้งานได้สมบูรณ์ครับ ระบบรองรับทั้งผู้ที่ทราบเวลาเกิดระดับนาที (คำนวณยามตกฟากและลัคนาจรเต็มรูปแบบ) และผู้ที่ทราบเพียงวันเดือนปีเกิด ซึ่งระบบจะถอดรหัสแกนหลักของวิชาเลข ๗ ตัว ๙ ฐาน 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน และวัยจรหลักให้อย่างเที่ยงตรง",
    },
    {
      q: "ข้อมูลส่วนบุคคลและวันเกิดปลอดภัยหรือไม่?",
      a: "ปลอดภัยสูงสุดตามมาตรฐาน PDPA ข้อมูลทั้งหมดถูกจัดเก็บด้วยมาตรฐานความปลอดภัยระดับสูง เข้ารหัสความปลอดภัยระดับธนาคาร ไม่มีการส่งต่อ ไม่ขายข้อมูล และไม่ถูกนำไปใช้เทรน AI สาธารณะอย่างเด็ดขาด",
    },
  ];

  return (
    <PublicLayout isLoggedIn={isLoggedIn}>
      {/* ── JSON-LD Structured Data for SEO ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": "https://phopephum.com/#website",
                "url": "https://phopephum.com",
                "name": "PHOPEPHUM OS — Data Science ของชีวิต",
                "description": "AI-Powered Life Guidance Platform ที่ปรึกษาชีวิตและกาลเวลาส่วนบุคคล",
                "inLanguage": "th",
              },
              {
                "@type": "SoftwareApplication",
                "name": "PHOPEPHUM OS",
                "operatingSystem": "Web, iOS, Android",
                "applicationCategory": "LifestyleApplication",
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "THB",
                },
              },
              {
                "@type": "FAQPage",
                "mainEntity": faqs.map((f) => ({
                  "@type": "Question",
                  "name": f.q,
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": f.a,
                  },
                })),
              },
            ],
          }),
        }}
      />

      {/* ──────────────────────────────────────────────────────────────────────────
          1. HERO SECTION: Data Science of Life & Cosmic Horizon
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 pb-16 sm:pt-16 sm:pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        
        {/* Subtle Ambient Cosmic & Sunrise Horizon Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] sm:w-[1000px] h-[550px] bg-gradient-to-b from-[#D4AF37]/20 via-[#0A2240]/40 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="flex flex-col items-center justify-center text-center mb-10 animate-fade-up">
          
          {/* Primary Brand Identity Lockup */}
          <div className="flex items-center gap-3.5 sm:gap-4 mb-4">
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] via-[#F6D88C] to-[#C6A96B] p-0.5 shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center">
              <div className="w-full h-full rounded-[14px] bg-[#07172A] flex items-center justify-center">
                <span className="font-playfair text-[#D4AF37] text-2xl sm:text-3xl font-bold tracking-tight">P</span>
              </div>
            </div>
            <div className="text-left">
              <h2 className="font-playfair text-2xl sm:text-4xl font-bold tracking-wider text-slate-900 dark:text-[#F8F6F1] leading-none">
                PHOPEPHUM OS
              </h2>
              <p className="text-xs sm:text-sm font-sarabun text-[#8C6D2D] dark:text-[#C6A96B] font-medium tracking-wide mt-1">
                ภพภูมิ · ปัญญาและกาลเวลาชีวิต
              </p>
            </div>
          </div>

          <p className="text-[11px] sm:text-xs tracking-[0.25em] font-playfair uppercase text-slate-500 dark:text-slate-400 font-semibold mb-6">
            AI-POWERED LIFE GUIDANCE PLATFORM
          </p>

          {/* Main Statement Heading */}
          <h1 className="font-playfair text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900 dark:text-[#F8F6F1] max-w-4xl leading-[1.15] mb-6">
            ทุกคำถามของชีวิต...<br />
            <span className="bg-gradient-to-r from-[#D4AF37] via-[#F6D88C] to-[#E8C46A] bg-clip-text text-transparent drop-shadow-sm">
              มีแนวทางเสมอ
            </span>
          </h1>

          {/* Value Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed font-sarabun mb-8">
            ชีวิตที่ดีขึ้น เริ่มได้จากการรู้จักตัวเอง สัมผัสประสบการณ์ใหม่ของ <strong className="text-slate-900 dark:text-[#F6D88C] font-semibold">"Data Science แห่งชีวิต"</strong> ด้วยแพลตฟอร์ม AI ที่ผสานภูมิปัญญาโหราศาสตร์ไทยโบราณ เพื่อปลดล็อกศักยภาพและค้นหา <strong className="text-slate-900 dark:text-[#F6D88C] font-semibold">"จังหวะเวลาที่ใช่ที่สุด"</strong> สำหรับคุณ
          </p>

          {/* Primary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto mb-8">
            <Link
              to={isLoggedIn ? "/dashboard" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-[#D4AF37] via-[#F6D88C] to-[#D4AF37] text-[#07172A] shadow-xl shadow-[#D4AF37]/30 hover:shadow-2xl hover:scale-102 active:scale-98 transition-all duration-200"
            >
              <span>{isLoggedIn ? "เข้าสู่แดชบอร์ด PhoPePhum OS" : "เริ่มต้นค้นหาตัวเอง... ใช้งานฟรี"}</span>
              <span className="text-lg">→</span>
            </Link>

            <Link
              to="/features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl font-semibold text-base border border-slate-300 dark:border-white/15 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-all"
            >
              <span>สำรวจฟีเจอร์ทั้งหมด</span>
            </Link>
          </div>

          {/* Micro Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-600 dark:text-slate-400 font-sarabun">
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> สมัครฟรีใน 1 นาที ไม่ต้องใช้บัตรเครดิต
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-emerald-500 font-bold">✓</span> ปลอดภัยตามมาตรฐาน PDPA
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[#D4AF37] font-bold">✦</span> ไม่ใช่งมงาย แต่คือตรรกะ สถิติ และกาลเวลา
            </span>
          </div>

        </div>

        {/* ── Visual Centerpiece Showcase (Sunrise Mountain & Celestial AI Engine) ── */}
        <div className="relative mt-8 rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#07172A] via-[#0B1728] to-[#0F172A] p-6 sm:p-10 shadow-2xl overflow-hidden">
          
          {/* Sunrise Glow & Horizon Backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#D4AF37]/25 via-[#07172A]/70 to-[#07172A] pointer-events-none" />
          
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Core Engine Summary */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[#F6D88C]">
                <AstralIcon name="horanu" size="sm" />
                <span>PhoPePhum OS: AI-Powered Life Guidance Platform</span>
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-[#F8F6F1] leading-snug">
                เปลี่ยนศาสตร์เร้นลับโบราณ<br />
                <span className="bg-gradient-to-r from-[#D4AF37] to-[#F6D88C] bg-clip-text text-transparent">
                  สู่ "Data Science ของชีวิต" ที่พิสูจน์ได้
                </span>
              </h3>

              <p className="text-sm sm:text-base text-slate-300 font-sarabun leading-relaxed">
                ความแม่นยำของระบบเกิดจากการนำตรรกะคณิตศาสตร์ของโหราศาสตร์โบราณ (คัมภีร์สุริยยาตร์ และวิชาเลข ๗ ตัว ๙ ฐาน 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน) มาทำงานร่วมกับกลไกประมวลผลเวลาแบบ Real-time และใช้เทคโนโลยี AI ในการ Matching ข้อมูลที่ซ้อนทับกันหลายมิติ เพื่อถอดรหัสศักยภาพและกำหนดจังหวะเวลา (Timing) ที่เหมาะสมที่สุดสำหรับการลงมือทำของแต่ละบุคคล
              </p>

              {/* 2 Wisdom Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-left">
                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                    <h4 className="font-playfair font-bold text-xs text-[#F6D88C]">คัมภีร์สุริยยาตร์</h4>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 mb-1">รากฐานแห่งวัฏจักรและเวลา</p>
                  <p className="text-[11px] text-slate-400 font-sarabun leading-relaxed">
                    คำนวณและวางผังดวงดาวพระเคราะห์แท้จริง ณ เวลาตกฟาก เสมือน Snapshot โครงสร้างพลังงานในเวลานั้น ตัดรอบ 06:00 น. แม่นยำระดับนาที
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-[#D4AF37]/40 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-2 h-2 rounded-full bg-[#D4AF37]"></span>
                    <h4 className="font-playfair font-bold text-xs text-[#F6D88C]">วิชาเลข ๗ ตัว ๙ ฐาน</h4>
                  </div>
                  <p className="text-xs font-semibold text-slate-200 mb-1">ถอดรหัสศักยภาพและจิตใต้สำนึก</p>
                  <p className="text-[11px] text-slate-400 font-sarabun leading-relaxed">
                    วิชาเลข ๗ ตัว ๙ ฐาน 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน จัดเรียงรหัสชีวิต อ่านโครงสร้างกรรม พรสวรรค์ และจุดที่ต้องปลดล็อกเพื่อเปลี่ยนชะตาด้วยเหตุและผล
                  </p>
                </div>
              </div>

              {/* Link to Knowledge Base */}
              <div className="flex items-center justify-end -mt-1">
                <Link
                  to="/how-it-works"
                  className="text-[11px] font-semibold text-[#F6D88C] hover:text-[#D4AF37] inline-flex items-center gap-1 transition-colors"
                >
                  <span>ศึกษาหลักวิชาและโครงสร้างคณิตศาสตร์เพิ่มเติมในคลังความรู้</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Live Status */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-md flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full border border-[#D4AF37] flex items-center justify-center bg-[#07172A] text-[#D4AF37] font-playfair font-bold text-xs shadow-md shadow-[#D4AF37]/20">
                    LIVE
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-[#F6D88C]">กาลชะตา Real-time Transit</p>
                    <p className="text-[10px] text-slate-400">อัปเดตกระแสพลังงานดวงดาวแบบ Real-time</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  ● Engine Active
                </span>
              </div>

            </div>

            {/* Right: Phone Mockup / OS Interface Preview */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="w-full max-w-[340px] rounded-[38px] border-4 border-slate-700/80 bg-[#07172A] p-4 shadow-2xl shadow-black/80 relative">
                
                {/* Notch */}
                <div className="w-24 h-3.5 bg-slate-800 rounded-full mx-auto mb-4" />

                {/* App Header */}
                <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-[#D4AF37] flex items-center justify-center text-[#07172A] font-bold font-playfair text-[10px]">
                      P
                    </div>
                    <span className="font-playfair font-bold text-[#F8F6F1]">PHOPEPHUM OS</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Live Real-time
                  </span>
                </div>

                {/* OS Live Card */}
                <div className="p-3 rounded-2xl bg-gradient-to-b from-white/10 to-white/[0.02] border border-[#D4AF37]/30 mb-3 text-center">
                  <p className="text-[10px] text-[#F6D88C] uppercase tracking-wider font-playfair">KARNCHATA ENGINE V2.0</p>
                  <p className="text-xs font-bold text-[#F8F6F1] mt-0.5">ดวงเดิม ⟷ กาลชะตาจร</p>
                  <p className="text-[10px] text-slate-300 mt-1">
                    อุตสาหะเดิม + อุตสาหะจร = <span className="text-[#F6D88C] font-semibold">จังหวะทองลงมือทำ</span>
                  </p>
                </div>

                {/* 3 Core Quick Access Modules */}
                <div className="space-y-2 mb-4">
                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37] text-xs">👑</span>
                      <div>
                        <p className="text-xs font-semibold text-[#F8F6F1]">ผังดวงจักรพรรดิ 35 ภพเรือน</p>
                        <p className="text-[10px] text-slate-400">Multi-select Overlay Filter</p>
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs">›</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37] text-xs">⏳</span>
                      <div>
                        <p className="text-xs font-semibold text-[#F8F6F1]">ยามอัฏฐกาลเต็มผัง (16 ยาม)</p>
                        <p className="text-[10px] text-slate-400">ยามพรายกระซิบ & ราหูค้นทรัพย์</p>
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs">›</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/5 flex items-center justify-between text-left">
                    <div className="flex items-center gap-2">
                      <span className="text-[#D4AF37] text-xs">📜</span>
                      <div>
                        <p className="text-xs font-semibold text-[#F8F6F1]">AI Life Report ฉบับเต็ม</p>
                        <p className="text-[10px] text-slate-400">Actionable Plan สังเคราะห์เฉพาะตัว</p>
                      </div>
                    </div>
                    <span className="text-slate-500 text-xs">›</span>
                  </div>
                </div>

                {/* Mobile CTA */}
                <Link
                  to={isLoggedIn ? "/dashboard" : "/register"}
                  className="w-full py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] to-[#F6D88C] text-[#07172A] block text-center shadow-md hover:brightness-105 transition-all"
                >
                  เปิดใช้งาน PhoPePhum ฟรี →
                </Link>

              </div>
            </div>

          </div>

          {/* 4 Pillars Footer Strip */}
          <div className="mt-8 pt-6 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-2">
              <p className="text-xs font-bold text-[#F6D88C]">ภูมิปัญญาโบราณ</p>
              <p className="text-[10px] text-slate-400 font-playfair tracking-wider">ANCIENT WISDOM</p>
            </div>
            <div className="p-2">
              <p className="text-xs font-bold text-[#F6D88C]">สมองกล AI ประมวลผล</p>
              <p className="text-[10px] text-slate-400 font-playfair tracking-wider">AI MATCHING ENGINE</p>
            </div>
            <div className="p-2">
              <p className="text-xs font-bold text-[#F6D88C]">Data Science ของชีวิต</p>
              <p className="text-[10px] text-slate-400 font-playfair tracking-wider">LOGICAL TIMING</p>
            </div>
            <div className="p-2">
              <p className="text-xs font-bold text-[#F6D88C]">ทุกเส้นทาง... มีความหมาย</p>
              <p className="text-[10px] text-slate-400 font-playfair tracking-wider">ALL PATHS MATTER</p>
            </div>
          </div>

        </div>

      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. PROBLEM & SOLUTION: Pain Points vs. Data Science Approach
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 mb-3">
            PAIN POINTS & THE SOLUTION
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-[#F8F6F1] mb-4">
            คำตอบที่ดี ไม่ใช่การคาดเดา<br />
            <span className="text-[#8C6D2D] dark:text-[#F6D88C]">แต่คือการเข้าใจด้วยตรรกะและสถิติ</span>
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-sarabun text-base sm:text-lg leading-relaxed">
            ก้าวข้ามความคลุมเครือของการทำนายทั่วไป สู่ความกระจ่างแจ้งในการวางแผนชีวิตที่แม่นยำ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {painPoints.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl hover:border-[#D4AF37]/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-xl mb-4">
                  {item.icon}
                </div>
                <h3 className="font-sarabun font-bold text-base sm:text-lg text-slate-900 dark:text-[#F8F6F1] mb-2 leading-snug">
                  {item.problem}
                </h3>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mb-3 font-sarabun">
                  ต้นตอ: {item.rootCause}
                </p>
                <div className="pt-3 border-t border-slate-100 dark:border-white/5">
                  <p className="text-xs text-slate-600 dark:text-slate-300 font-sarabun leading-relaxed">
                    <strong className="text-emerald-600 dark:text-emerald-400">ทางออกด้วย PhoPePhum:</strong> {item.solution}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Highlight Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#D4AF37]/15 via-[#07172A]/80 to-[#D4AF37]/15 border border-[#D4AF37]/35 text-center max-w-4xl mx-auto">
          <p className="font-playfair text-lg sm:text-xl font-bold text-slate-900 dark:text-[#F8F6F1]">
            "PhoPePhum ไม่ใช่แค่การดูดวง แต่คือ AI-Powered Life Guidance Platform"
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 font-sarabun mt-2 max-w-2xl mx-auto leading-relaxed">
            ที่ใช้วิชาเลข ๗ ตัว ๙ ฐาน 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน และคัมภีร์สุริยยาตร์ มาทำงานร่วมกับ AI เพื่อถอดรหัสโครงสร้างชีวิตคุณอย่างเป็นเหตุเป็นผล ให้คุณก้าวเดินต่อไปได้อย่างสง่างามและไร้แรงเสียดทาน
          </p>
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          5. CORE 4 LIFE DIMENSIONS (4 มิติสำคัญของชีวิต)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 bg-slate-50/70 dark:bg-white/[0.01] border-y border-slate-200/80 dark:border-white/10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 mb-3">
            CORE LIFE DIMENSIONS
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-[#F8F6F1] mb-4">
            ครอบคลุม 4 มิติสำคัญของชีวิต
          </h2>
          <p className="text-slate-600 dark:text-slate-300 font-sarabun text-base sm:text-lg">
            ไม่ตัดสินโชคชะตา แต่ให้ความกระจ่างแจ้งในทุกการตัดสินใจ เพื่อให้คุณบริหารชีวิตได้อย่างมั่นใจ
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {lifeDimensions.map((item) => (
            <div
              key={item.id}
              className="group p-6 rounded-3xl border border-slate-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-xl hover:border-[#D4AF37]/50 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="w-14 h-14 rounded-2xl bg-[#07172A] border border-[#D4AF37]/40 flex items-center justify-center mb-6 shadow-md shadow-[#D4AF37]/15 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>

                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-playfair font-bold text-xl text-slate-900 dark:text-[#F8F6F1]">
                    {item.title}
                  </h3>
                  <span className="text-[10px] font-playfair font-semibold tracking-wider text-slate-400">
                    {item.english}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#8C6D2D] dark:text-[#F6D88C] mb-3 font-sarabun">
                  {item.subtitle}
                </p>

                <p className="text-sm text-slate-600 dark:text-slate-400 font-sarabun leading-relaxed mb-6">
                  {item.desc}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 dark:text-slate-300 font-sarabun">{item.highlight}</span>
                <span className="text-[#D4AF37] font-bold group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          6. PRICING & CANONICAL VALUE
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-6xl mx-auto">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 mb-3">
              TRANSPARENT & FAIR PRICING
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 dark:text-[#F8F6F1] mb-4">
              แผนการใช้งานที่โปร่งใส ชัดเจน
            </h2>
            <p className="text-slate-600 dark:text-slate-400 font-sarabun text-base">
              เริ่มต้นใช้งานฟรี หรือยกระดับสู่เครื่องมือวิเคราะห์เชิงกลยุทธ์ระดับมืออาชีพ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Free */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#07172A]/80 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">เริ่มทดลอง</span>
                <h3 className="font-playfair font-bold text-2xl text-slate-900 dark:text-[#F8F6F1] mt-1 mb-1">Free</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sarabun mb-3 min-h-[32px]">
                  สัมผัสพลังงานชีวิตและกาลชะตาเบื้องต้น
                </p>
                <div className="mb-6">
                  <span className="font-playfair text-4xl font-bold text-slate-900 dark:text-[#F8F6F1]">฿0</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">/ เดือน</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-sarabun mb-6">
                  <li className="flex items-center gap-2"><span>✓</span> Dashboard สถิติพลังงานวันนี้</li>
                  <li className="flex items-center gap-2"><span>✓</span> ผังดวงวิชาเลข ๗ ตัว ๙ ฐานเบื้องต้น</li>
                  <li className="flex items-center gap-2"><span>✓</span> กาลชะตาวันนี้ & ยามปัจจุบัน</li>
                  <li className="flex items-center gap-2"><span>✓</span> รับทรายกาลเวลาฟรีทุกวัน</li>
                </ul>
              </div>
              <Link
                to="/register"
                className="w-full text-center py-3 rounded-xl font-bold text-xs border border-slate-300 dark:border-white/10 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              >
                สมัครใช้งานฟรี
              </Link>
            </div>

            {/* 2. Premium */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#07172A]/80 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">ยกระดับชีวิต</span>
                <h3 className="font-playfair font-bold text-2xl text-slate-900 dark:text-[#F8F6F1] mt-1 mb-1">Premium</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sarabun mb-3 min-h-[32px]">
                  ยกระดับการวางแผนชีวิตและการเงินส่วนบุคคล
                </p>
                <div className="mb-6">
                  <span className="font-playfair text-4xl font-bold text-slate-900 dark:text-[#F8F6F1]">฿89</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">/ เดือน</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-sarabun mb-6">
                  <li className="flex items-center gap-2"><span>✓</span> ยามอัฏฐกาลเต็มผัง & ราหู วันนี้</li>
                  <li className="flex items-center gap-2"><span>✓</span> ผังวิชาเลข ๗ ตัว ๙ ฐาน 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน (ตนเอง)</li>
                  <li className="flex items-center gap-2"><span>✓</span> ปฏิทินจันทรคติไทย 100 ปีแท้</li>
                  <li className="flex items-center gap-2"><span>✓</span> บันทึกดวงตนเอง + 3 คน</li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="w-full text-center py-3 rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-white/10 dark:text-white hover:bg-slate-800 transition-colors"
              >
                เลือกแผน Premium
              </Link>
            </div>

            {/* 3. Professional */}
            <div className="p-6 rounded-3xl border-2 border-[#D4AF37] bg-white dark:bg-[#0A182E]/90 backdrop-blur-xl flex flex-col justify-between relative shadow-xl shadow-[#D4AF37]/15">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-[#D4AF37] to-[#F6D88C] text-[#07172A]">
                แนะนำยอดนิยม
              </div>
              <div>
                <span className="text-xs font-bold text-[#8C6D2D] dark:text-[#F6D88C] uppercase tracking-wider">มืออาชีพ</span>
                <h3 className="font-playfair font-bold text-2xl text-slate-900 dark:text-[#F8F6F1] mt-1 mb-1">Professional</h3>
                <p className="text-[11px] text-slate-600 dark:text-[#F6D88C]/80 font-sarabun mb-3 min-h-[32px] leading-relaxed">
                  วางแผนงานเฉพาะวิชาชีพ สามารถใช้งานระบบแบบ Custom มากขึ้น
                </p>
                <div className="mb-6">
                  <span className="font-playfair text-4xl font-bold text-slate-900 dark:text-[#F8F6F1]">฿289</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">/ เดือน</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-sarabun mb-6">
                  <li className="flex items-center gap-2"><span className="text-[#D4AF37]">✓</span> KARNCHATA ENGINE V2.0 เต็มระบบ</li>
                  <li className="flex items-center gap-2"><span className="text-[#D4AF37]">✓</span> Multi-select Overlay Filter ผังจักรพรรดิ</li>
                  <li className="flex items-center gap-2"><span className="text-[#D4AF37]">✓</span> วางแผนงานเฉพาะวิชาชีพ & Customization</li>
                  <li className="flex items-center gap-2"><span className="text-[#D4AF37]">✓</span> ยามพรายกระซิบ 12 ภพ & ราหูค้นทรัพย์</li>
                  <li className="flex items-center gap-2"><span className="text-[#D4AF37]">✓</span> บันทึกดวง 15 คน + Sands 150 เม็ด/เดือน</li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="w-full text-center py-3 rounded-xl font-bold text-xs bg-gradient-to-r from-[#D4AF37] to-[#F6D88C] text-[#07172A] shadow-md shadow-[#D4AF37]/25 hover:scale-102 transition-all font-bold"
              >
                เลือกแผน Professional
              </Link>
            </div>

            {/* 4. Master */}
            <div className="p-6 rounded-3xl border border-purple-500/30 dark:border-purple-500/20 bg-white dark:bg-[#07172A]/80 backdrop-blur-xl flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">โหราจารย์</span>
                <h3 className="font-playfair font-bold text-2xl text-slate-900 dark:text-[#F8F6F1] mt-1 mb-1">Master</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-sarabun mb-3 min-h-[32px] leading-relaxed">
                  ปลดล็อคเครื่องมือสำหรับนักพยากรณ์ เข้าถึงหลักวิชาและหลักการโหราศาสตร์เพื่อใช้ในการพยากรณ์ได้อย่างลึกซึ้งมากขึ้น
                </p>
                <div className="mb-6">
                  <span className="font-playfair text-4xl font-bold text-slate-900 dark:text-[#F8F6F1]">฿789</span>
                  <span className="text-xs text-slate-600 dark:text-slate-400 ml-1">/ เดือน</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-400 font-sarabun mb-6">
                  <li className="flex items-center gap-2"><span>✓</span> ปลดล็อคเครื่องมือสำหรับนักพยากรณ์ครบวงจร</li>
                  <li className="flex items-center gap-2"><span>✓</span> เข้าถึงหลักวิชาและหลักการโหราศาสตร์เชิงลึก</li>
                  <li className="flex items-center gap-2"><span>✓</span> ผังดวงจักรพรรดิ 35 ภพเรือน ฐานกำลังพระเคราะห์ 19 ฐาน + สุริยยาตร์แท้</li>
                  <li className="flex items-center gap-2"><span>✓</span> ส่งออกรายงาน AI Life Report พรีเมียม</li>
                  <li className="flex items-center gap-2"><span>✓</span> บันทึกดวงไม่จำกัด + Sands 500 เม็ด/เดือน</li>
                </ul>
              </div>
              <Link
                to="/pricing"
                className="w-full text-center py-3 rounded-xl font-bold text-xs bg-slate-900 text-white dark:bg-white/10 dark:text-white hover:bg-slate-800 transition-colors"
              >
                เลือกแผน Master
              </Link>
            </div>

          </div>

          <div className="mt-8 text-center">
            <Link to="/pricing" className="text-xs sm:text-sm font-semibold text-[#8C6D2D] dark:text-[#C6A96B] hover:underline">
              ดูตารางเปรียบเทียบฟีเจอร์อย่างละเอียดและตัวเลือก Pro รายปี (฿2,790/ปี ประหยัด 20%) →
            </Link>
          </div>

        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          7. FAQ ACCORDION SECTION
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 bg-slate-100/60 dark:bg-[#07172A]/90 border-y border-slate-200/80 dark:border-white/10 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#D4AF37] bg-[#D4AF37]/10 border border-[#D4AF37]/25 mb-3">
            FREQUENTLY ASKED QUESTIONS
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-slate-900 dark:text-[#F8F6F1] mb-3">
            คำถามที่พบบ่อยเกี่ยวกับ PhoPePhum OS
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-sarabun text-sm sm:text-base">
            คำตอบชัดเจนในทุกมิติด้านตรรกะ สถิติ ความเป็นส่วนตัว และความคุ้มค่า
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/[0.02] overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-playfair font-bold text-base text-slate-900 dark:text-[#F8F6F1] hover:text-[#D4AF37] transition-colors"
                >
                  <span className="font-sarabun font-semibold">{faq.q}</span>
                  <span className={`text-xl transition-transform duration-200 text-[#D4AF37] ${isOpen ? "rotate-45" : ""}`}>
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 text-sm text-slate-600 dark:text-slate-300 font-sarabun leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ──────────────────────────────────────────────────────────────────────────
          8. SOCIAL PROOF & FINAL CALL-TO-ACTION (ปิดการขายอย่างสง่างาม)
      ────────────────────────────────────────────────────────────────────────── */}
      <section className="relative z-10 py-16 sm:py-24 px-4 sm:px-6 max-w-5xl mx-auto text-center">
        <div className="p-10 sm:p-16 rounded-3xl bg-gradient-to-b from-[#07172A] via-[#0A1A2E] to-[#0F172A] text-white border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden">
          
          {/* Ambient Glow */}
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#D4AF37]/25 rounded-full blur-3xl pointer-events-none" />

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-[#F6D88C] bg-[#D4AF37]/15 border border-[#D4AF37]/30 mb-6 relative z-10">
            ALL PATHS MATTER
          </div>

          <blockquote className="font-playfair text-2xl sm:text-4xl font-bold mb-4 relative z-10 text-[#F8F6F1] leading-snug max-w-3xl mx-auto">
            "ทุกเส้นทาง... มีความหมาย (All Paths Matter)<br />
            <span className="text-[#F6D88C]">ให้ PhoPePhum OS เป็นที่ปรึกษาชีวิตส่วนตัวของคุณ"</span>
          </blockquote>

          <p className="text-slate-300 text-sm sm:text-base font-sarabun max-w-2xl mx-auto mb-8 relative z-10 leading-relaxed">
            เปลี่ยนความไม่แน่นอนเป็นความมั่นใจ ลงมือทำถูกจังหวะเวลาเพื่อความสำเร็จที่ไร้แรงเสียดทาน
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 mb-6">
            <Link
              to={isLoggedIn ? "/dashboard/horoscope" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-[#D4AF37] via-[#F6D88C] to-[#D4AF37] text-[#07172A] shadow-xl shadow-[#D4AF37]/30 hover:scale-105 active:scale-95 transition-all"
            >
              <span>สร้างผังดวงจักรพรรดิของคุณตอนนี้</span>
              <span>→</span>
            </Link>

            <Link
              to={isLoggedIn ? "/dashboard/reports/new" : "/register"}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-base border border-[#D4AF37]/40 text-[#F6D88C] hover:bg-[#D4AF37]/10 transition-all"
            >
              <span>ดูรายงานวิเคราะห์เชิงลึกด้วย AI</span>
            </Link>
          </div>

          <p className="text-xs text-slate-400 relative z-10 font-sarabun">
            ไม่ต้องกรอกบัตรเครดิต • ข้อมูลปลอดภัยด้วยมาตรฐาน PDPA • เริ่มต้นใช้งานฟรี
          </p>

        </div>
      </section>

    </PublicLayout>
  );
}
