import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n.use(LanguageDetector).use(initReactI18next).init({
  resources: {
    en: {
      translation: {
        "title": "Log in or sign up",
        "message": "To comment on this post, you need to be authenticated.",
        "login": "Log in",
        "register": "Sign up",
        "close": "Close",
        "You must register to be able to like": "You must register to be able to like",
        "Please log in or register to continue.": "Please log in or register to continue.",
        "readMore": "Read more",
        "likes": "Likes",
        "update": "Update",
        "cancel": "Cancel",
        "reply": "Reply",
        "seeMoreComments": "Voir plus de commentaires...",
        "hideComments": "Hide comments...",
        "edit": "Edit",
        "remove": "Remove",
        "placeholder": "Add your comments...",
        "post": "Post",
        "contact": "Contact & Details",
        "username": "Username",
        "phone": "Phone",
        "email": "Email",
        "show": "Show",
        "hide": "Hide",
        "realestate": "Real Estate",
        "already_have_account": "Already have an account?",
        "login_now": "Login Now",
        "email_help": "We'll never share your email with anyone else.",
        "no_account": "You don't have an account?",
        "register_now": "Register Now",

        "usermanagement": "User management",
        "complaints": "complaints",
        "activityusers": "Activity users",
        "searchusers": "Search users",
        "lastusers": "Last users",
        "userroles": "User roles",
        "pendingposts": "Pending posts",
        "light_mode": "Light mode",
        "dark_mode": "Dark mode",
        "profile": "Profile",
        "logout": "Logout",
        "details": "Post Details",
        "comments": "Comments",
        "location": "Location",
        "seller": "Seller",
        "allowComments": "Allow Comments",
        "views": "Views",
        "adDuration": "Ad Duration",
        "notSpecified": "Not Specified",
        "Delete All": "Delete All",
        "Notification": "Notification",
        "he liked your message": "he liked your message",
        "added a new post": "added a new post",
        "has started to follow you": "has started to follow you",
        "has stopped following you": "has stopped following you",
        "has deleted a post": "has deleted a post",
        "Edit Profile": "Edit Profile",
        "Followers": "Followers",
        "Following": "Following",
        "My Posts": "My Posts",
        "Saved": "Saved",
        "No Post": "No Post",
        "user name": "user name",
        "Mobile": "Mobile",
        "Address": "Address",
        "Website": "Website",
        "Story": "Story",
        "Close": "Close",
        "Save": "Save",

        "Rental search result...": "Rental search result...",
        "There are no rental posts that match the filters...": "There are no rental posts that match the filters...",

        "Search result cherche achat...": "Search result cherche achat...",
        "There are no posts from cherche achat that match the filters...": "There are no posts from cherche achat that match the filters...",

        "Search result search location...": "Search result search location...",
        "No search match filter looking for location...": "No search match filter looking for location...",

        "Search result for vacation rental...": "Search result for vacation rental...",
        "There are no vacation rental publications that match the filters...": "There are no vacation rental publications that match the filters...",

        "Exchange search result...": "Exchange search result...",
        "No Exchange search match filter...": "No Exchange search match filter...",

        "Search results sales...": "Search results sales...",
        "There are no sales posts that match the filters...": "There are no sales posts that match the filters...",
     "See more articles": "See more articles",
      "Advanced search...":"Advanced search...",
      "Select fields": "Select fields",
      "Category...":"Category...",
      }


    },

    fr: {
      translation: {
        "title": "Connectez-vous ou inscrivez-vous",
        "message": "Pour commenter cette publication, vous devez être authentifié.",
        "login": "Se connecter",
        "register": "S'inscrire",
        "close": "Fermer",
        "You must register to be able to like": "Vous devez vous inscrire pour pouvoir aimer",
        "Please log in or register to continue.": "Veuillez vous connecter ou vous inscrire pour continuer",
        "readMore": "Lire plus",
        "likes": "Mentions j'aime",
        "update": "Mettre à jour",
        "cancel": "Annuler",
        "reply": "Répondre",
        "seeMoreComments": "Voir plus de commentaires...",
        "hideComments": "Masquer les commentaires...",
        "edit": "Modifier",
        "remove": "Supprimer",
        "placeholder": "Ajoutez votre commentaire...",
        "post": "Publier",
        "contact": "Contact & Coordonnées",
        "username": "Nom d'utilisateur",
        "phone": "Téléphone",
        "email": "E-mail",
        "show": "Afficher",
        "hide": "Masquer",
        "realestate": "IMMOBILIER",
        "already_have_account": "Vous avez déjà un compte?",
        "login_now": "Connectez-vous maintenant",
        "email_help": "Nous ne partagerons jamais votre e-mail avec qui que ce soit.",
        "no_account": "Vous n'avez pas de compte?",
        "register_now": "Inscrivez-vous maintenant",
        "light_mode": "Mode éclairé",
        "dark_mode": "Mode sombre",
        "details": "Détails du Post",
        "comments": "Commentaires",
        "location": "Emplacement",
        "seller": "Vendeur",
        "allowComments": "Autoriser les commentaires",
        "views": "Vues",
        "adDuration": "Durée de l'annonce",
        "notSpecified": "Non spécifié",
        "Delete All": "Supprimer tout",
        "Notification": "Notification",
        "he liked your message": "il a aimé ton message",
        "added a new post": "Ajouté un nouveau message",
        "has started to follow you": "a commencé à te suivre",
        "has stopped following you": "a arrêté de te suivre",
        "has deleted a post": "a supprimé une publication",
        "Edit Profile": "Modifier le profil",
        "Followers": "Suiveur",
        "Following": "Suivant",
        "My Posts": "Mes Publications",
        "Saved": "Enregistrée",
        "No Post": "Pas du publication",
        "user name": "Nom d'utilisateur",
        "Mobile": "Téléphone",
        "Address": "Adresse",
        "Website": "Site web",
        "Story": "Histoire",
        "Close": "Fermer",
        "Save": "Sauvegarder",

        "Rental search result...": "Résultat de la recherche de location...",
        "There are no rental posts that match the filters...": "Il n'y a aucun message de location qui correspond aux filtres...",

        "Search result cherche achat...": "Résultat de la recherche cherche achat...",
        "There are no posts from cherche achat that match the filters...": "Il n’y a aucune publication de cherche achat qui correspond aux filtres...",

        "Search result search location...": "résultat de cherche location...",
        "No search match filter looking for location...": "Aucun filtre de correspondance de recherche cherche achat...",

        "Search result for vacation rental...": "Résultat de recherche location de vacances...",
        "There are no vacation rental publications that match the filters...": "Aucun article de location de vacances ne correspond aux filtres...",

        "Exchange search result...": "Résultat de la recherche d'échange...",
        "No Exchange search match filter...": "Aucun filtre de correspondance de recherche Exchange...",

        "Search results sales...": "Résultats de recherche ventes...",
        "There are no sales posts that match the filters...": "Il n'y a aucune publication de vente qui correspond aux filtres...",

        "See more articles":  "Voir plus d'articles",
        "Advanced search...":"Recherche avancée...",
         
        "Select fields": "Sélectionnez les champs",
        "Category...":"Catégorie..."
        



      }
    },
    ar: {
      translation: {

        //USER MESSAGE MODAL AUTETICACION

        "title": "تسجيل الدخول أو التسجيل",
        "message": "للتعليق على هذا المنشور، يجب أن تكون مصادقًا.",
        "login": "تسجيل الدخول",
        "register": "تسجيل",
        "close": "إغلاق",

        "must_register_to_like": "يجب عليك التسجيل لتتمكن من الإعجاب",
        "please_login_or_register": "الرجاء تسجيل الدخول أو التسجيل للمتابعة.",

        // COMMENTS
        "read_more": "اقرأ المزيد",
        "likes": "إعجابات",
        "update": "تحديث",
        "cancel": "إلغاء",
        "reply": "رد",
        "see_more_comments": "عرض المزيد من التعليقات...",
        "hide_comments": "إخفاء التعليقات...",
        "edit": "تعديل",
        "remove": "إزالة",
        "comment_placeholder": "أضف تعليقك...",
        "post_comment": "نشر",

        // CONTACT & USER INFO
        "contact": "الاتصال والتفاصيل",
        "username": "اسم المستخدم",
        "phone": "الهاتف",
        "email": "البريد الإلكتروني",
        "show": "عرض",
        "hide": "إخفاء",

        // REGISTER
        "realestate": "العقارات",
        "confirm_password": "تأكيد كلمة المرور",
        "already_have_account": "لديك حساب بالفعل؟",
        "login_now": "تسجيل الدخول الآن",

        // POST INFORMATION
        "post_details": "تفاصيل المنشور",
        "comments": "التعليقات",
        "location": "الموقع",
        "seller": "البائع",
        "allow_comments": "السماح بالتعليقات",
        "views": "المشاهدات",
        "ad_duration": "مدة الإعلان",
        "not_specified": "غير محدد",

        // AUTH
        "email_help": "لن نشارك بريدك الإلكتروني مع أي شخص آخر.",
        "password": "كلمة المرور",
        "no_account": "ليس لديك حساب؟",
        "register_now": "سجل الآن",

        // GENERAL
        "post": "نشر إعلان",
        "user_management": "إدارة المستخدمين",
        "complaints": "الشكاوى",
        "activity_users": "نشاط المستخدمين",
        "search_users": "البحث عن المستخدمين",
        "last_users": "آخر المستخدمين",
        "user_roles": "أدوار المستخدمين",
        "pending_posts": "المشاركات المعلقة",
        "light_mode": "وضع الإضاءة",
        "dark_mode": "الوضع الداكن",
        "profile": "الملف الشخصي",
        "logout": "تسجيل الخروج",
        "Delete All": "حذف الكل",
        "Notification": "إشعارات",
        "he liked your message": "احب منشورك",
        "added a new post": "تم إضافة مشاركة جديدة",
        "has started to follow you": "لقد بدأ في متابعتك",
        "has stopped following you": "توقف عن متابعتك",
        "has deleted a post": "حذفت منشورا",
        "Edit Profile": "تعديل الملف الشخصي",
        "Followers": "متابعون",
        "Following": "تابع",
        "My Posts": "منشوراتي",
        "Saved": "مسجل",
        "No Post": "لا يوجد منشور",
        "user name": "اسم المستخدم",
        "Mobile": "هاتف",
        "Address": "العنوان",
        "Website": "موقع الويب",
        "Story": "وصفي",
        "Close": "غلق",
        "Save": "حفظ",

        "Rental search result...": "...نتائج البحث عن الإيجار",
        "There are no rental posts that match the filters...": "...لا توجد رسائل تأجير تطابق عامل التصفية",

        "Search result cherche achat...": "...نتائج البحث عن شراء",
        "There are no posts from cherche achat that match the filters...": "...لا توجد مشاركات من البحث عن الشراء تطابق عوامل التصفية",

        "Search result search location...": "...نتائج البحث عن الإيجار",
        "No search match filter looking for location...": "...لا يوجد مرشح مطابق للتأجير",

        "Search result for vacation rental...": "...نتائج البحث عن ايجار",
        "There are no vacation rental publications that match the filters...": "...لا يوجد بحث عن إيجارات العطلات يتطابق مع عوامل التصفية",

        "Exchange search result...": "...نتائج البحث تبادل",
        "No Exchange search match filter...": "...لا توجد نتائج بحث للتبادل",

        "Search results sales...": "...نتائج البحث عن المبيعات",
        "There are no sales posts that match the filters...": "...لا توجد منشورات مبيعات تطابق عوامل التصفية",
        "See more articles":  "رؤية المزيد من المقالات",
        "Advanced search...":"...بحث متقدم",
        "Select fields": "اختيار المعلومات",
        "Category...":"Catégorie..."


      }
    },




  },


  fallbackLng: "fr",
  interpolation: {
    escapeValue: false
  }
});

export default i18n;