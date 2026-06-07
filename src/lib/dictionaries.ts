export type Language = "ar";

export const translations = {
  ar: {
    common: {
      loading: "جاري التحميل...",
      save: "حفظ",
      submit: "إرسال",
      cancel: "إلغاء",
      confirm: "تأكيد",
      error: "حدث خطأ",
      success: "تم بنجاح!",
      create: "إضافة جديد",
    },
    sidebar: {
      dashboard: "الرئيسية",
      lessons: "جلسات ارشادية",
      quizzes: "اختبارات نفسية",
      tests: "الامتحانات",
      results: "سجل النتائج",
      mentalHealthTest: "مقياس الصحة النفسية",
      selectTeacher: "اختيار الاخصائي النفسي",
      students: "قائمة التلاميذ",
      analytics: "التحليلات التفصيلية",
    },
    topbar: {
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
      switchLanguage: "عربي",
    },
    teacherSelection: {
      title: "مرحباً! يرجى اختيار الاخصائي النفسي",
      subtitle: "يجب عليك اختيار الاخصائي النفسي الخاص بك قبل الوصول إلى لوحة التحكم.",
      confirmSelection: "تأكيد الاختيار",
      noTeachers: "لا يوجد اخصائي نفسي متاح حالياً.",
      selecting: "جاري الاختيار...",
    },
    mentalHealth: {
      title: "مقياس الصحة النفسية",
      subtitle: "استبيان بسيط لنفهم مشاعرك بشكل أفضل ونقدم لك الدعم المناسب.",
      performTest: "بدء المقياس",
      submitTest: "إرسال الإجابات",
      options: {
        applies: "ينطبق",
        sometimes: "أحياناً",
        doesNotApply: "لا ينطبق",
      },
      results: {
        title: "نتيجة المقياس",
        score: "النتيجة: ",
        messagePositive: "شكراً لمشاركة مشاعرك! يبدو أنك في حالة جيدة جداً. استمر بهذه الروح الإيجابية، وتذكر أنه من الجيد دائماً التحدث مع شخص تثق به.",
        messageOk: "شكراً لمشاركتك بصدق! من الطبيعي تماماً أن تمر بمشاعر مختلطة. إذا شعرت بالضغط في أي وقت، فإن التحدث مع اخصائيك النفسي أو والديك سيساعدك كثيراً.",
        messageNeedsSupport: "شكراً لصدقك وشجاعتك. كلنا نمر بأيام صعبة ولست مضطراً لمواجهتها بمفردك. نرجو منك التحدث مع الاخصائي النفسي أو شخص بالغ تثق به لمساعدتك.",
        backToDashboard: "العودة للرئيسية",
      }
    },
    dashboard: {
      welcome: "مرحباً بعودتك، ",
      continueLearning: "مواصلة الجلسات",
      recentActivity: "النشاطات الأخيرة",
      viewAll: "عرض الكل",
    }
  }
};

export type TranslationKey = 
  | "common.loading"
  | "common.save"
  | "common.submit"
  | "common.cancel"
  | "common.confirm"
  | "common.error"
  | "common.success"
  | "sidebar.dashboard"
  | "sidebar.lessons"
  | "sidebar.quizzes"
  | "sidebar.tests"
  | "sidebar.results"
  | "sidebar.mentalHealthTest"
  | "sidebar.selectTeacher"
  | "sidebar.students"
  | "sidebar.analytics"
  | "common.create"
  | "topbar.profile"
  | "topbar.logout"
  | "topbar.switchLanguage"
  | "teacherSelection.title"
  | "teacherSelection.subtitle"
  | "teacherSelection.confirmSelection"
  | "teacherSelection.noTeachers"
  | "teacherSelection.selecting"
  | "mentalHealth.title"
  | "mentalHealth.subtitle"
  | "mentalHealth.performTest"
  | "mentalHealth.submitTest"
  | "mentalHealth.options.applies"
  | "mentalHealth.options.sometimes"
  | "mentalHealth.options.doesNotApply"
  | "mentalHealth.results.title"
  | "mentalHealth.results.score"
  | "mentalHealth.results.messagePositive"
  | "mentalHealth.results.messageOk"
  | "mentalHealth.results.messageNeedsSupport"
  | "mentalHealth.results.backToDashboard"
  | "dashboard.welcome"
  | "dashboard.continueLearning"
  | "dashboard.recentActivity"
  | "dashboard.viewAll";
