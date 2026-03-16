import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type Language = "en" | "ar";

const translations = {
  en: {
    brand: "OFA AI",
    tagline: "One For All AI — Your AI Video Production Studio",
    heroTitle: "Create AI UGC Videos in Seconds",
    heroSubtitle: "Upload your product, let AI generate professional UGC video content automatically.",
    getStarted: "Get Started Free",
    watchDemo: "Watch Demo",
    step1Title: "Upload Product",
    step1Desc: "Upload your product image and describe your target audience.",
    step2Title: "AI Generates Content",
    step2Desc: "Our AI creates scripts, images, and videos tailored to your market.",
    step3Title: "Get Your Video",
    step3Desc: "Download professional UGC videos ready for social media.",
    howItWorks: "How It Works",
    pricing: "Pricing",
    pricingSubtitle: "Choose the perfect plan for your video production needs.",
    starter: "Starter",
    pro: "Pro",
    premium: "Premium",
    ultimate: "Ultimate",
    month: "/mo",
    credits: "credits",
    faq: "Frequently Asked Questions",
    login: "Log In",
    signup: "Sign Up",
    email: "Email",
    password: "Password",
    name: "Full Name",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    orContinueWith: "Or continue with",
    google: "Google",
    dashboard: "Dashboard",
    createVideo: "Create Video",
    myVideos: "My Videos",
    extendVideo: "Extend Video",
    billing: "Billing",
    settings: "Settings",
    welcome: "Welcome back",
    creditBalance: "Credit Balance",
    videosCreated: "Videos Created",
    creditsUsed: "Credits Used",
    videosRemaining: "Videos Remaining",
    recentVideos: "Recent Videos",
    createNewVideo: "Create New Video",
    productName: "Product Name",
    productNamePlaceholder: "e.g. Bokhor, Trimmer, Skincare",
    productImage: "Product Image",
    dropImage: "Drag & drop your product image here",
    orBrowse: "or click to browse",
    duration: "Duration",
    aspectRatio: "Aspect Ratio",
    portrait: "Portrait",
    landscape: "Landscape",
    language: "Language",
    arabic: "Arabic",
    english: "English",
    french: "French",
    targetCountry: "Targeted Country",
    targetCountryPlaceholder: "e.g. Saudi Arabia, Morocco, Australia",
    additionalDesc: "Additional Description (Optional)",
    additionalDescPlaceholder: "Environment, places, script ideas...",
    generateVideo: "Generate Video",
    creditCost: "Credit Cost",
    generating: "Generating...",
    done: "Done",
    failed: "Failed",
    download: "Download",
    extend: "Extend +8s",
    delete: "Delete",
    currentPlan: "Current Plan",
    upgradePlan: "Upgrade Plan",
    creditHistory: "Credit History",
    manageSubscription: "Manage Subscription",
    profile: "Profile",
    languagePref: "Language Preference",
    notifications: "Notifications",
    save: "Save Changes",
    logout: "Log Out",
    analyzing: "Analyzing your product...",
    generatingImage: "Generating product image...",
    creatingScript: "Creating video script...",
    generatingVideo: "Generating video with AI...",
    finalizing: "Finalizing...",
    videoStarted: "Video generation started!",
    insufficientCredits: "Insufficient credits",
    upgradeNow: "Upgrade Now",
    perSegment: "per segment",
    totalDuration: "Total Duration",
    faqQ1: "How does OFA AI work?",
    faqA1: "Upload your product image, select your preferences, and our AI pipeline generates professional UGC-style video ads automatically.",
    faqQ2: "How long does it take to generate a video?",
    faqA2: "Typically 3-5 minutes for an 8-second video. Longer videos take proportionally more time.",
    faqQ3: "What languages are supported?",
    faqA3: "Currently Arabic, English, and French. More languages coming soon.",
    faqQ4: "Can I extend my video?",
    faqA4: "Yes! You can extend any completed video by 8-second segments for just 5 credits each.",
    allRightsReserved: "All rights reserved.",
    createLandingPage: "Create Landing Page",
    createLandingPageDesc: "Generate a professional landing page for your product with AI.",
    myLandingPages: "My Landing Pages",
    landingPages: "Landing Pages",
    noLandingPages: "No landing pages yet",
    landingPageStarted: "Landing page generation started!",
    targetLocation: "Target Location",
    targetLocationPlaceholder: "e.g. Saudi Arabia, UAE, Egypt",
    priceOffers: "Price & Offers",
    generateLandingPage: "Generate Landing Page",
    fillRequired: "Please fill all required fields",
    preview: "Preview",
    openInNewTab: "Open in New Tab",
  },
  ar: {
    brand: "OFA AI",
    tagline: "واحد للجميع — استوديو إنتاج الفيديو بالذكاء الاصطناعي",
    heroTitle: "أنشئ فيديوهات UGC بالذكاء الاصطناعي في ثوانٍ",
    heroSubtitle: "ارفع صورة منتجك، ودع الذكاء الاصطناعي ينشئ محتوى فيديو احترافي تلقائياً.",
    getStarted: "ابدأ مجاناً",
    watchDemo: "شاهد العرض",
    step1Title: "ارفع المنتج",
    step1Desc: "ارفع صورة منتجك وصِف جمهورك المستهدف.",
    step2Title: "الذكاء الاصطناعي ينشئ المحتوى",
    step2Desc: "يقوم الذكاء الاصطناعي بإنشاء نصوص وصور وفيديوهات مخصصة لسوقك.",
    step3Title: "احصل على فيديوك",
    step3Desc: "حمّل فيديوهات UGC احترافية جاهزة لوسائل التواصل.",
    howItWorks: "كيف يعمل",
    pricing: "الأسعار",
    pricingSubtitle: "اختر الخطة المثالية لاحتياجات إنتاج الفيديو.",
    starter: "مبتدئ",
    pro: "احترافي",
    premium: "مميز",
    ultimate: "شامل",
    month: "/شهرياً",
    credits: "رصيد",
    faq: "الأسئلة الشائعة",
    login: "تسجيل الدخول",
    signup: "إنشاء حساب",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    name: "الاسم الكامل",
    noAccount: "ليس لديك حساب؟",
    hasAccount: "لديك حساب بالفعل؟",
    orContinueWith: "أو تابع مع",
    google: "جوجل",
    dashboard: "لوحة التحكم",
    createVideo: "إنشاء فيديو",
    myVideos: "فيديوهاتي",
    extendVideo: "تمديد فيديو",
    billing: "الفوترة",
    settings: "الإعدادات",
    welcome: "مرحباً بعودتك",
    creditBalance: "رصيد الاعتمادات",
    videosCreated: "الفيديوهات المنشأة",
    creditsUsed: "الأرصدة المستخدمة",
    videosRemaining: "الفيديوهات المتبقية",
    recentVideos: "الفيديوهات الأخيرة",
    createNewVideo: "إنشاء فيديو جديد",
    productName: "اسم المنتج",
    productNamePlaceholder: "مثل: بخور، ماكينة حلاقة، عناية بالبشرة",
    productImage: "صورة المنتج",
    dropImage: "اسحب وأفلت صورة المنتج هنا",
    orBrowse: "أو انقر للاستعراض",
    duration: "المدة",
    aspectRatio: "نسبة العرض",
    portrait: "عمودي",
    landscape: "أفقي",
    language: "اللغة",
    arabic: "العربية",
    english: "الإنجليزية",
    french: "الفرنسية",
    targetCountry: "البلد المستهدف",
    targetCountryPlaceholder: "مثل: السعودية، المغرب، أستراليا",
    additionalDesc: "وصف إضافي (اختياري)",
    additionalDescPlaceholder: "البيئة، الأماكن، أفكار النص...",
    generateVideo: "إنشاء الفيديو",
    creditCost: "تكلفة الأرصدة",
    generating: "جارٍ الإنشاء...",
    done: "مكتمل",
    failed: "فشل",
    download: "تحميل",
    extend: "تمديد +8 ثوانٍ",
    delete: "حذف",
    currentPlan: "الخطة الحالية",
    upgradePlan: "ترقية الخطة",
    creditHistory: "سجل الأرصدة",
    manageSubscription: "إدارة الاشتراك",
    profile: "الملف الشخصي",
    languagePref: "تفضيل اللغة",
    notifications: "الإشعارات",
    save: "حفظ التغييرات",
    logout: "تسجيل الخروج",
    analyzing: "تحليل منتجك...",
    generatingImage: "إنشاء صورة المنتج...",
    creatingScript: "إنشاء نص الفيديو...",
    generatingVideo: "إنشاء الفيديو بالذكاء الاصطناعي...",
    finalizing: "إنهاء...",
    videoStarted: "بدأ إنشاء الفيديو!",
    insufficientCredits: "رصيد غير كافٍ",
    upgradeNow: "ترقية الآن",
    perSegment: "لكل مقطع",
    totalDuration: "المدة الإجمالية",
    faqQ1: "كيف يعمل OFA AI؟",
    faqA1: "ارفع صورة منتجك، اختر تفضيلاتك، وسيقوم الذكاء الاصطناعي بإنشاء إعلانات فيديو UGC احترافية تلقائياً.",
    faqQ2: "كم يستغرق إنشاء فيديو؟",
    faqA2: "عادةً 3-5 دقائق لفيديو 8 ثوانٍ. الفيديوهات الأطول تستغرق وقتاً أكثر.",
    faqQ3: "ما اللغات المدعومة؟",
    faqA3: "حالياً العربية والإنجليزية والفرنسية. المزيد من اللغات قريباً.",
    faqQ4: "هل يمكنني تمديد الفيديو؟",
    faqA4: "نعم! يمكنك تمديد أي فيديو مكتمل بمقاطع 8 ثوانٍ مقابل 5 أرصدة فقط.",
    allRightsReserved: "جميع الحقوق محفوظة.",
  },
};

type TranslationKey = keyof typeof translations.en;

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: TranslationKey) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem("ofa-lang");
    return (saved === "ar" ? "ar" : "en") as Language;
  });

  const setLang = useCallback((newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("ofa-lang", newLang);
  }, []);

  const t = useCallback(
    (key: TranslationKey) => translations[lang][key] || key,
    [lang]
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
    if (lang === "ar") {
      document.body.style.fontFamily = "'Tajawal', sans-serif";
    } else {
      document.body.style.fontFamily = "'Inter', sans-serif";
    }
  }, [lang, dir]);

  return (
    <I18nContext.Provider value={{ lang, setLang, t, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
