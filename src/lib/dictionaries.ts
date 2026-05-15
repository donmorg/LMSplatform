export type Language = "en" | "ar";

export const translations = {
  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      submit: "Submit",
      cancel: "Cancel",
      confirm: "Confirm",
      error: "An error occurred",
      success: "Success!",
      create: "Create New",
    },
    sidebar: {
      dashboard: "Dashboard",
      lessons: "Lessons",
      quizzes: "Quizzes",
      tests: "Tests",
      results: "Results",
      mentalHealthTest: "Mental Health Test",
      selectTeacher: "Select Psychologist",
      students: "Student Roster",
      analytics: "Detailed Analytics",
    },
    topbar: {
      profile: "Profile",
      logout: "Log out",
      switchLanguage: "عربي",
    },
    teacherSelection: {
      title: "Welcome! Please Select Your Psychologist",
      subtitle: "You must select a psychologist before accessing the dashboard.",
      confirmSelection: "Confirm Psychologist",
      noTeachers: "No psychologists available.",
      selecting: "Selecting...",
    },
    mentalHealth: {
      title: "Mental Health Test",
      subtitle: "A simple questionnaire to understand your feelings better.",
      performTest: "Perform Test",
      submitTest: "Submit Test",
      options: {
        applies: "Applies",
        sometimes: "Sometimes",
        doesNotApply: "Does not apply",
      },
      results: {
        title: "Test Results",
        score: "Your Score: ",
        messagePositive: "Thank you for sharing your feelings! It looks like you're doing well. Keep up the great energy, and remember it's always okay to talk to someone if you need to.",
        messageOk: "Thank you for sharing! Remember that it's completely normal to have mixed feelings sometimes. If you ever feel overwhelmed, talking to a teacher or parent can be very helpful.",
        messageNeedsSupport: "Thank you for your honesty. Everyone has tough days, and you don't have to face them alone. Please consider talking to your teacher, a counselor, or a trusted adult.",
        backToDashboard: "Back to Dashboard",
      }
    },
    dashboard: {
      welcome: "Welcome back, ",
      continueLearning: "Continue Learning",
      recentActivity: "Recent Activity",
      viewAll: "View All",
    }
  },
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
      lessons: "الدروس التعليمية",
      quizzes: "الاختبارات القصيرة",
      tests: "الامتحانات",
      results: "سجل النتائج",
      mentalHealthTest: "مقياس الصحة النفسية",
      selectTeacher: "اختيار الاخصائي النفسي",
      students: "قائمة الطلاب",
      analytics: "التحليلات التفصيلية",
    },
    topbar: {
      profile: "الملف الشخصي",
      logout: "تسجيل الخروج",
      switchLanguage: "English",
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
        applies: "ينطبق علي",
        sometimes: "أحياناً",
        doesNotApply: "لا ينطبق",
      },
      results: {
        title: "نتيجة المقياس",
        score: "النتيجة: ",
        messagePositive: "شكراً لمشاركة مشاعرك! يبدو أنك في حالة جيدة جداً. استمر بهذه الروح الإيجابية، وتذكر أنه من الجيد دائماً التحدث مع شخص تثق به.",
        messageOk: "شكراً لمشاركتك بصدق! من الطبيعي تماماً أن تمر بمشاعر مختلطة. إذا شعرت بالضغط في أي وقت، فإن التحدث مع معلمك أو والديك سيساعدك كثيراً.",
        messageNeedsSupport: "شكراً لصدقك وشجاعتك. كلنا نمر بأيام صعبة ولست مضطراً لمواجهتها بمفردك. نرجو منك التحدث مع الاخصائي النفسي أو شخص بالغ تثق به لمساعدتك.",
        backToDashboard: "العودة للرئيسية",
      }
    },
    dashboard: {
      welcome: "مرحباً بعودتك، ",
      continueLearning: "مواصلة التعلم",
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
