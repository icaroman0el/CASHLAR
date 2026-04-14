export const localeCookieName = "cashlar-locale";
export const localeStorageKey = "cashlar-locale";
export const supportedLocales = ["pt-BR", "en"] as const;

export type AppLocale = (typeof supportedLocales)[number];

export type Dictionary = {
  auth: {
    loginTitle: string;
    loginDescription: string;
    loginSubmit: string;
    loginCardEyebrow: string;
    loginCardTitle: string;
    signupTitle: string;
    signupDescription: string;
    signupSubmit: string;
    signupCardEyebrow: string;
    signupCardTitle: string;
    noAccount: string;
    createAccount: string;
    haveAccount: string;
    doLogin: string;
    name: string;
    yourName: string;
    email: string;
    emailPlaceholder: string;
    password: string;
    passwordHint: string;
    forgotPassword: string;
    forgotPasswordEmailRequired: string;
    resetPasswordEmailSent: string;
    sendingResetLink: string;
    resetPasswordTitle: string;
    resetPasswordDescription: string;
    resetPasswordCardEyebrow: string;
    resetPasswordCardTitle: string;
    resetPasswordSubmit: string;
    resetPasswordSuccess: string;
    confirmPassword: string;
    confirmPasswordHint: string;
    passwordTooShort: string;
    passwordMismatch: string;
    recoverySessionMissing: string;
    backToLogin: string;
    heroPoints: readonly string[];
  };
  dashboard: {
    currentBalance: string;
    balancePositive: string;
    balanceWarning: string;
    balanceStatusHelp: string;
    statusGuideTitle: string;
    statusGuideDescription: string;
    statusGuidePositiveTitle: string;
    statusGuidePositiveText: string;
    statusGuideWarningTitle: string;
    statusGuideWarningText: string;
    statusGuideClose: string;
    income: string;
    expenses: string;
    entries: string;
    topIncome: string;
    topExpense: string;
    noIncomePeriod: string;
    noExpensePeriod: string;
    panelEyebrow: string;
    panelTitle: string;
    addEntry: string;
    newEntry: string;
    registerEntry: string;
    entryTitle: string;
    entryTitlePlaceholder: string;
    amount: string;
    amountPlaceholder: string;
    type: string;
    typeAll: string;
    typeIncome: string;
    typeExpense: string;
    category: string;
    expenseCategory: string;
    expenseCategoryAll: string;
    month: string;
    date: string;
    notes: string;
    notesPlaceholder: string;
    saveEntry: string;
    savingEntry: string;
    cancelEntry: string;
    noTransactions: string;
    remove: string;
    removing: string;
    deleteTitle: string;
    deleteQuestion: string;
    deleteCancel: string;
    deleteConfirm: string;
    fillRequired: string;
    saveError: string;
    saveSuccess: string;
    removeSuccess: string;
    toastSuccessEyebrow: string;
    toastErrorEyebrow: string;
  };
  navbar: {
    openMenu: string;
    closeMenu: string;
    goHome: string;
    home: string;
    profile: string;
    settings: string;
    settingsDescription: string;
    profileDescription: string;
  };
  logout: {
    signOut: string;
    signingOut: string;
  };
  profile: {
    title: string;
    headingFallback: string;
    accountData: string;
    profileName: string;
    saveName: string;
    security: string;
    changePassword: string;
    newPassword: string;
    confirmPassword: string;
    repeatPassword: string;
    updatePassword: string;
    settingsShortcutEyebrow: string;
    settingsShortcutTitle: string;
    settingsShortcutDescription: string;
    settingsShortcutAction: string;
  };
  settings: {
    title: string;
    heading: string;
    description: string;
    languageEyebrow: string;
    languageTitle: string;
    languageDescription: string;
    languagePortuguese: string;
    languageEnglish: string;
    appearanceEyebrow: string;
    appearanceTitle: string;
    appearanceDescription: string;
    installEyebrow: string;
    installTitle: string;
    installDescription: string;
    appleTitle: string;
    appleStepOne: string;
    appleStepTwo: string;
    appleStepThree: string;
  };
  install: {
    title: string;
    action: string;
    ready: string;
    browserReady: string;
    installed: string;
    appleHint: string;
    standalone: string;
    iosGuideLabel: string;
  };
  theme: {
    title: string;
    darkEnabled: string;
    darkDisabled: string;
  };
  common: {
    account: string;
    profile: string;
    settings: string;
    unknownError: string;
  };
};

const dictionaries: Record<AppLocale, Dictionary> = {
  "pt-BR": {
    auth: {
      loginTitle: "Entre na sua conta",
      loginDescription: "Use seu e-mail e senha para acessar seus lancamentos salvos na nuvem.",
      loginSubmit: "Entrar",
      loginCardEyebrow: "Entrar",
      loginCardTitle: "Acesse sua conta",
      signupTitle: "Crie sua conta",
      signupDescription: "Crie sua conta e confirme seu e-mail para comecar a usar o Cashlar.",
      signupSubmit: "Criar conta",
      signupCardEyebrow: "Criar conta",
      signupCardTitle: "Comece seu controle financeiro",
      noAccount: "Ainda não tem conta?",
      createAccount: "Criar cadastro",
      haveAccount: "Já tem conta?",
      doLogin: "Fazer login",
      name: "Nome",
      yourName: "Seu nome",
      email: "E-mail",
      emailPlaceholder: "voce@email.com",
      password: "Senha",
      passwordHint: "Mínimo de 6 caracteres",
      forgotPassword: "Esqueci a senha",
      forgotPasswordEmailRequired: "Informe seu e-mail para receber o link de redefinição.",
      resetPasswordEmailSent: "Enviamos um e-mail com o link para redefinir sua senha.",
      sendingResetLink: "Enviando link...",
      resetPasswordTitle: "Redefinir senha",
      resetPasswordDescription: "Defina uma nova senha para voltar a acessar sua conta com segurança.",
      resetPasswordCardEyebrow: "Recuperar acesso",
      resetPasswordCardTitle: "Crie sua nova senha",
      resetPasswordSubmit: "Salvar nova senha",
      resetPasswordSuccess: "Senha redefinida com sucesso. Entre com sua nova senha.",
      confirmPassword: "Confirmar senha",
      confirmPasswordHint: "Repita a nova senha",
      passwordTooShort: "A nova senha precisa ter ao menos 6 caracteres.",
      passwordMismatch: "As senhas não conferem.",
      recoverySessionMissing: "Abra o link enviado para seu e-mail para redefinir sua senha.",
      backToLogin: "Voltar para o login",
      heroPoints: ["Controle por usuário", "Supabase Auth", "PWA para celular"],
    },
    dashboard: {
      currentBalance: "Saldo atual",
      balancePositive: "No azul",
      balanceWarning: "Revisar gastos",
      balanceStatusHelp: "Entender os sinalizadores do saldo",
      statusGuideTitle: "O que cada sinalizador quer dizer?",
      statusGuideDescription: "Esses avisos ajudam a ler rapidamente a saude financeira do mes atual.",
      statusGuidePositiveTitle: "No azul",
      statusGuidePositiveText: "Suas receitas estao cobrindo as despesas do periodo e o saldo segue positivo.",
      statusGuideWarningTitle: "Revisar gastos",
      statusGuideWarningText: "As despesas encostaram ou passaram das receitas. Vale revisar as saidas.",
      statusGuideClose: "Entendi",
      income: "Receitas",
      expenses: "Despesas",
      entries: "Lançamentos",
      topIncome: "Maior receita",
      topExpense: "Maior despesa",
      noIncomePeriod: "Sem entradas no período",
      noExpensePeriod: "Sem saídas no período",
      panelEyebrow: "Lançamentos",
      panelTitle: "Movimentações do período",
      addEntry: "Adicionar lançamento",
      newEntry: "Novo lançamento",
      registerEntry: "Registrar movimentação",
      entryTitle: "Título",
      entryTitlePlaceholder: "Ex.: Salário, Aluguel, Mercado",
      amount: "Valor",
      amountPlaceholder: "0,00",
      type: "Tipo",
      typeAll: "Todos",
      typeIncome: "Receita",
      typeExpense: "Despesa",
      category: "Categoria",
      expenseCategory: "Categoria da despesa",
      expenseCategoryAll: "Todas",
      month: "Mês",
      date: "Data",
      notes: "Observação",
      notesPlaceholder: "Detalhes opcionais",
      saveEntry: "Salvar lançamento",
      savingEntry: "Salvando...",
      cancelEntry: "Cancelar lançamento",
      noTransactions: "Nenhum lançamento encontrado para esse filtro.",
      remove: "Remover",
      removing: "Removendo...",
      deleteTitle: "Remover lançamento?",
      deleteQuestion: "Você quer mesmo remover {title}?",
      deleteCancel: "Cancelar",
      deleteConfirm: "Remover",
      fillRequired: "Preencha um título e um valor válido.",
      saveError: "Não foi possível salvar o lançamento.",
      saveSuccess: "Lançamento salvo com sucesso.",
      removeSuccess: "Lançamento removido.",
      toastSuccessEyebrow: "Tudo certo",
      toastErrorEyebrow: "Não concluído",
    },
    navbar: {
      openMenu: "Abrir menu",
      closeMenu: "Fechar menu",
      goHome: "Ir para a página inicial",
      home: "Início",
      profile: "Perfil do usuário",
      settings: "Configurações",
      settingsDescription: "Idioma, visual e app",
      profileDescription: "Perfil do usuário",
    },
    logout: {
      signOut: "Sair",
      signingOut: "Saindo...",
    },
    profile: {
      title: "Perfil",
      headingFallback: "Minha conta",
      accountData: "Dados da conta",
      profileName: "Nome do perfil",
      saveName: "Salvar nome",
      security: "Segurança",
      changePassword: "Alterar senha",
      newPassword: "Nova senha",
      confirmPassword: "Confirmar senha",
      repeatPassword: "Repita a nova senha",
      updatePassword: "Atualizar senha",
      settingsShortcutEyebrow: "Atalhos",
      settingsShortcutTitle: "Preferências do app",
      settingsShortcutDescription: "Idioma, modo escuro/claro e instalação do aplicativo.",
      settingsShortcutAction: "Abrir configurações",
    },
    settings: {
      title: "Configurações",
      heading: "Preferências do app",
      description: "Ajuste o idioma, o visual e a instalação do Cashlar em cada dispositivo.",
      languageEyebrow: "Idioma",
      languageTitle: "Idioma do sistema",
      languageDescription: "Escolha entre português e inglês para as telas principais.",
      languagePortuguese: "Português (Brasil)",
      languageEnglish: "English",
      appearanceEyebrow: "Visual",
      appearanceTitle: "Tema do aplicativo",
      appearanceDescription: "Alterne entre o visual claro e o escuro.",
      installEyebrow: "Aplicativo",
      installTitle: "Instalação no celular",
      installDescription: "Adicione o Cashlar na tela inicial para abrir como aplicativo.",
      appleTitle: "iPhone e iPad (Safari)",
      appleStepOne: "Abra o Cashlar no Safari.",
      appleStepTwo: "Toque em Compartilhar na barra do navegador.",
      appleStepThree: "Escolha Adicionar à Tela de Início e confirme.",
    },
    install: {
      title: "Instalar como app",
      action: "Instalar",
      ready: "Pronto para instalar neste dispositivo.",
      browserReady: "Quando o navegador permitir, você conseguirá instalar o app com um toque.",
      installed: "Se você aceitou, o app já deve aparecer na tela inicial.",
      appleHint: "No iPhone ou iPad com Safari, use Compartilhar > Adicionar à Tela de Início.",
      standalone: "O Cashlar já está instalado e pode abrir como aplicativo.",
      iosGuideLabel: "Instalação no iPhone",
    },
    theme: {
      title: "Modo escuro / claro",
      darkEnabled: "Modo escuro ativado",
      darkDisabled: "Modo claro ativado",
    },
    common: {
      account: "Minha conta",
      profile: "Perfil do usuário",
      settings: "Configurações",
      unknownError: "Algo deu errado.",
    },
  },
  en: {
    auth: {
      loginTitle: "Sign in to your account",
      loginDescription: "Use your email and password to access your transactions saved in the cloud.",
      loginSubmit: "Sign in",
      loginCardEyebrow: "Sign in",
      loginCardTitle: "Access your account",
      signupTitle: "Create your account",
      signupDescription: "Create your account and confirm your email to start using Cashlar.",
      signupSubmit: "Create account",
      signupCardEyebrow: "Create account",
      signupCardTitle: "Start your financial control",
      noAccount: "Don't have an account yet?",
      createAccount: "Create one",
      haveAccount: "Already have an account?",
      doLogin: "Sign in",
      name: "Name",
      yourName: "Your name",
      email: "Email",
      emailPlaceholder: "you@email.com",
      password: "Password",
      passwordHint: "At least 6 characters",
      forgotPassword: "Forgot password?",
      forgotPasswordEmailRequired: "Enter your email to receive the reset link.",
      resetPasswordEmailSent: "We sent you an email with the password reset link.",
      sendingResetLink: "Sending link...",
      resetPasswordTitle: "Reset password",
      resetPasswordDescription: "Create a new password to safely access your account again.",
      resetPasswordCardEyebrow: "Recover access",
      resetPasswordCardTitle: "Create your new password",
      resetPasswordSubmit: "Save new password",
      resetPasswordSuccess: "Password reset successfully. Sign in with your new password.",
      confirmPassword: "Confirm password",
      confirmPasswordHint: "Repeat your new password",
      passwordTooShort: "Your new password must be at least 6 characters long.",
      passwordMismatch: "The passwords do not match.",
      recoverySessionMissing: "Open the link sent to your email to reset your password.",
      backToLogin: "Back to login",
      heroPoints: ["Per-user control", "Supabase Auth", "Mobile-ready PWA"],
    },
    dashboard: {
      currentBalance: "Current balance",
      balancePositive: "In the green",
      balanceWarning: "Review spending",
      balanceStatusHelp: "Understand the balance indicators",
      statusGuideTitle: "What does each indicator mean?",
      statusGuideDescription: "These badges help you read the current month at a glance.",
      statusGuidePositiveTitle: "In the green",
      statusGuidePositiveText: "Your income is covering your expenses for the period and the balance remains positive.",
      statusGuideWarningTitle: "Review spending",
      statusGuideWarningText: "Expenses are close to or above your income. It is a good time to review outflows.",
      statusGuideClose: "Got it",
      income: "Income",
      expenses: "Expenses",
      entries: "Transactions",
      topIncome: "Top income",
      topExpense: "Top expense",
      noIncomePeriod: "No income in this period",
      noExpensePeriod: "No expenses in this period",
      panelEyebrow: "Transactions",
      panelTitle: "Period activity",
      addEntry: "Add transaction",
      newEntry: "New transaction",
      registerEntry: "Create transaction",
      entryTitle: "Title",
      entryTitlePlaceholder: "e.g. Salary, Rent, Groceries",
      amount: "Amount",
      amountPlaceholder: "0.00",
      type: "Type",
      typeAll: "All",
      typeIncome: "Income",
      typeExpense: "Expense",
      category: "Category",
      expenseCategory: "Expense category",
      expenseCategoryAll: "All",
      month: "Month",
      date: "Date",
      notes: "Notes",
      notesPlaceholder: "Optional details",
      saveEntry: "Save transaction",
      savingEntry: "Saving...",
      cancelEntry: "Cancel transaction",
      noTransactions: "No transactions found for this filter.",
      remove: "Remove",
      removing: "Removing...",
      deleteTitle: "Remove transaction?",
      deleteQuestion: "Do you really want to remove {title}?",
      deleteCancel: "Cancel",
      deleteConfirm: "Remove",
      fillRequired: "Fill in a valid title and amount.",
      saveError: "Could not save the transaction.",
      saveSuccess: "Transaction saved successfully.",
      removeSuccess: "Transaction removed.",
      toastSuccessEyebrow: "Done",
      toastErrorEyebrow: "Not completed",
    },
    navbar: {
      openMenu: "Open menu",
      closeMenu: "Close menu",
      goHome: "Go to homepage",
      home: "Home",
      profile: "User profile",
      settings: "Settings",
      settingsDescription: "Language, appearance and app",
      profileDescription: "User profile",
    },
    logout: {
      signOut: "Sign out",
      signingOut: "Signing out...",
    },
    profile: {
      title: "Profile",
      headingFallback: "My account",
      accountData: "Account details",
      profileName: "Profile name",
      saveName: "Save name",
      security: "Security",
      changePassword: "Change password",
      newPassword: "New password",
      confirmPassword: "Confirm password",
      repeatPassword: "Repeat new password",
      updatePassword: "Update password",
      settingsShortcutEyebrow: "Shortcuts",
      settingsShortcutTitle: "App preferences",
      settingsShortcutDescription: "Language, dark/light mode and app installation.",
      settingsShortcutAction: "Open settings",
    },
    settings: {
      title: "Settings",
      heading: "App preferences",
      description: "Adjust language, appearance and how Cashlar is installed on each device.",
      languageEyebrow: "Language",
      languageTitle: "System language",
      languageDescription: "Choose between Portuguese and English for the main screens.",
      languagePortuguese: "Portuguese (Brazil)",
      languageEnglish: "English",
      appearanceEyebrow: "Appearance",
      appearanceTitle: "Application theme",
      appearanceDescription: "Switch between light and dark appearance.",
      installEyebrow: "App",
      installTitle: "Install on mobile",
      installDescription: "Add Cashlar to your home screen to open it like an app.",
      appleTitle: "iPhone and iPad (Safari)",
      appleStepOne: "Open Cashlar in Safari.",
      appleStepTwo: "Tap Share in the browser bar.",
      appleStepThree: "Choose Add to Home Screen and confirm.",
    },
    install: {
      title: "Install as app",
      action: "Install",
      ready: "Ready to install on this device.",
      browserReady: "As soon as the browser allows it, you can install the app with one tap.",
      installed: "If you accepted, the app should already be on your home screen.",
      appleHint: "On iPhone or iPad with Safari, use Share > Add to Home Screen.",
      standalone: "Cashlar is already installed and can open like an app.",
      iosGuideLabel: "Install on iPhone",
    },
    theme: {
      title: "Dark / light mode",
      darkEnabled: "Dark mode enabled",
      darkDisabled: "Light mode enabled",
    },
    common: {
      account: "My account",
      profile: "User profile",
      settings: "Settings",
      unknownError: "Something went wrong.",
    },
  },
};

export function normalizeLocale(value?: string | null): AppLocale {
  return value === "en" ? "en" : "pt-BR";
}

export function getDictionary(locale: AppLocale): Dictionary {
  return dictionaries[normalizeLocale(locale)];
}
