// Change this to your backend URL in production
window.API = "http://localhost:3000";

// i18n translations (multilanguage support)
window.TRANSLATIONS = {
  en: {
    welcome: "Welcome!",
    switchLanguage: "Switch Language",
    enterContact: "Enter Email",
    enterOtp: "Enter OTP",
    languageSwitched: "Language changed successfully!",
    dashboard: "My Dashboard",
    askQuestion: "Ask a Question",
    viewProfile: "View Profile",
    upgradePlan: "Upgrade Plan",
    changeLanguage: "Change Language",
    forgotPassword: "Forgot Password",
    logout: "Logout"
  },
  es: {
    welcome: "¡Bienvenido!",
    switchLanguage: "Cambiar idioma",
    enterContact: "Ingrese Email",
    enterOtp: "Ingrese OTP",
    languageSwitched: "¡Idioma cambiado exitosamente!",
    dashboard: "Mi Panel",
    askQuestion: "Hacer una Pregunta",
    viewProfile: "Ver Perfil",
    upgradePlan: "Mejorar Plan",
    changeLanguage: "Cambiar Idioma",
    forgotPassword: "Olvidé mi Contraseña",
    logout: "Cerrar Sesión"
  },
  hi: {
    welcome: "स्वागत है!",
    switchLanguage: "भाषा बदलें",
    enterContact: "ईमेल दर्ज करें",
    enterOtp: "OTP दर्ज करें",
    languageSwitched: "भाषा सफलतापूर्वक बदल गई!",
    dashboard: "मेरा डैशबोर्ड",
    askQuestion: "प्रश्न पूछें",
    viewProfile: "प्रोफ़ाइल देखें",
    upgradePlan: "प्लान अपग्रेड करें",
    changeLanguage: "भाषा बदलें",
    forgotPassword: "पासवर्ड भूल गए",
    logout: "लॉग आउट"
  },
  fr: {
    welcome: "Bienvenue!",
    switchLanguage: "Changer de langue",
    enterContact: "Entrez l'email",
    enterOtp: "Entrez l'OTP",
    languageSwitched: "Langue changée avec succès!",
    dashboard: "Mon Tableau de Bord",
    askQuestion: "Poser une Question",
    viewProfile: "Voir le Profil",
    upgradePlan: "Améliorer le Plan",
    changeLanguage: "Changer de Langue",
    forgotPassword: "Mot de Passe Oublié",
    logout: "Se Déconnecter"
  },
  pt: {
    welcome: "Bem-vindo!",
    switchLanguage: "Mudar Idioma",
    enterContact: "Digite o Email",
    enterOtp: "Digite o OTP",
    languageSwitched: "Idioma alterado com sucesso!",
    dashboard: "Meu Painel",
    askQuestion: "Fazer uma Pergunta",
    viewProfile: "Ver Perfil",
    upgradePlan: "Atualizar Plano",
    changeLanguage: "Mudar Idioma",
    forgotPassword: "Esqueci a Senha",
    logout: "Sair"
  },
  zh: {
    welcome: "欢迎！",
    switchLanguage: "切换语言",
    enterContact: "输入邮箱",
    enterOtp: "输入OTP",
    languageSwitched: "语言切换成功！",
    dashboard: "我的仪表盘",
    askQuestion: "提问",
    viewProfile: "查看个人资料",
    upgradePlan: "升级计划",
    changeLanguage: "更改语言",
    forgotPassword: "忘记密码",
    logout: "退出"
  }
};

// Get current language translation
window.t = function(key) {
  const lang = localStorage.getItem("lang") || "en";
  return (window.TRANSLATIONS[lang] || window.TRANSLATIONS["en"])[key] || key;
};

// Apply translations to all elements with data-i18n attribute
window.applyTranslations = function() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    el.textContent = window.t(key);
  });
};
