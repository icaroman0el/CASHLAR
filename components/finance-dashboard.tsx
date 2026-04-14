"use client";

import { type CSSProperties, type FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { AppNavbar } from "@/components/app-navbar";
import { useLocale } from "@/components/locale-provider";
import { categories, getCanonicalCategory, getCategoryLabel } from "@/lib/constants";
import { getCurrencyFormatter, getDateFormatter } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";
import type {
  MonthCollaborator,
  ReceivedMonthShare,
  TransactionRecord,
  TransactionType,
} from "@/lib/types";

type FinanceDashboardProps = {
  initialTransactions: TransactionRecord[];
  initialReceivedShares: ReceivedMonthShare[];
  userEmail: string | null;
  userName: string | null;
  userId: string;
};

type FormState = {
  title: string;
  amount: string;
  type: TransactionType;
  category: string;
  date: string;
  description: string;
};

type FeedbackTone = "success" | "error";
type ShareRpcError = {
  code?: string;
  details?: string | null;
  hint?: string | null;
  message: string;
};
const incomeCategories = new Set(["Salario", "Freelance"]);
const chartPalette = ["#5f2df6", "#169be9", "#efb544", "#44b97a", "#ff6b57"];

export function FinanceDashboard({
  initialTransactions,
  initialReceivedShares,
  userEmail,
  userName,
  userId,
}: FinanceDashboardProps) {
  const [supabase] = useState(() => createClient());
  const { dictionary, locale } = useLocale();
  const [transactions, setTransactions] = useState(initialTransactions);
  const [receivedShares, setReceivedShares] = useState(initialReceivedShares);
  const [isBalanceHelpOpen, setIsBalanceHelpOpen] = useState(false);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState("personal");
  const [filterType, setFilterType] = useState<"all" | TransactionType>("all");
  const [filterMonth, setFilterMonth] = useState(getMonthValue(new Date()));
  const [filterExpenseCategory, setFilterExpenseCategory] = useState("all");
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [formState, setFormState] = useState<FormState>({
    title: "",
    amount: "",
    type: "income",
    category: categories[0],
    date: getDateValue(new Date()),
    description: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [messageTone, setMessageTone] = useState<FeedbackTone>("success");
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [shareEmail, setShareEmail] = useState("");
  const [workspaceSearch, setWorkspaceSearch] = useState("");
  const [shareStatus, setShareStatus] = useState<string | null>(null);
  const [shareStatusTone, setShareStatusTone] = useState<FeedbackTone>("success");
  const [isSharing, setIsSharing] = useState(false);
  const [isLoadingCollaborators, setIsLoadingCollaborators] = useState(false);
  const [revokingShareId, setRevokingShareId] = useState<string | null>(null);
  const [monthCollaborators, setMonthCollaborators] = useState<MonthCollaborator[]>([]);
  const collaborationText = useMemo(
    () =>
      locale === "en"
        ? {
          workspaceLabel: "Workspace",
          workspaceSearchPlaceholder: "Search by name, email or date",
          workspaceSearchEmpty: "No shared month found for this search.",
          personalWorkspace: "My transactions",
          shareMonth: "Share month",
          shareMonthTitle: "Share this month's activity",
          shareMonthDescription:
            "Invite another user by email. They will be able to add and remove items in this month.",
          shareEmailLabel: "User email",
          shareEmailPlaceholder: "colleague@email.com",
          shareSubmit: "Send access",
          shareSubmitting: "Sharing...",
          collaboratorsTitle: "People with access",
          noCollaborators: "No collaborators yet for this month.",
          revokeShare: "Remove access",
          revokingShare: "Removing...",
          shareSuccess: "Month shared successfully.",
          shareNotFound: "We could not find a user with this email. They need to create an account first.",
          shareSelf: "You cannot share the month with your own account.",
          shareEmailRequired: "Enter an email to share this month.",
          shareAuthRequired: "Your session expired. Sign in again to share this month.",
          shareSetupRequired: "Month sharing is not configured in the database yet.",
          shareGenericError: "Could not share this month right now.",
          monthLockedError: "This shared workspace only accepts dates from the selected month.",
          sharedBy: "Shared by",
          sharedOnDate: "on",
        }
        : {
          workspaceLabel: "Espaço",
          workspaceSearchPlaceholder: "Pesquisar por nome, e-mail ou data",
          workspaceSearchEmpty: "Nenhum mês compartilhado encontrado para essa busca.",
          personalWorkspace: "Minhas movimentações",
          shareMonth: "Compartilhar mês",
          shareMonthTitle: "Compartilhar movimentação do mês",
          shareMonthDescription:
            "Convide outro usuário por e-mail. Ele poderá adicionar e remover itens nesse mês.",
          shareEmailLabel: "E-mail do usuário",
          shareEmailPlaceholder: "colega@email.com",
          shareSubmit: "Enviar acesso",
          shareSubmitting: "Compartilhando...",
          collaboratorsTitle: "Pessoas com acesso",
          noCollaborators: "Ninguém recebeu acesso a este mês ainda.",
          revokeShare: "Remover acesso",
          revokingShare: "Removendo...",
          shareSuccess: "Mês compartilhado com sucesso.",
          shareNotFound: "Não encontramos um usuário com esse e-mail. Essa pessoa precisa criar uma conta antes.",
          shareSelf: "Você não pode compartilhar o mês com a própria conta.",
          shareEmailRequired: "Digite um e-mail para compartilhar este mês.",
          shareAuthRequired: "Sua sessão expirou. Entre novamente para compartilhar este mês.",
          shareSetupRequired: "O compartilhamento de mês ainda não foi configurado no banco.",
          shareGenericError: "Não foi possível compartilhar este mês agora.",
          monthLockedError: "Esse espaço compartilhado só aceita datas do mês selecionado.",
          sharedBy: "Compartilhado por",
          sharedOnDate: "no dia",
        },
    [locale],
  );
  const activeWorkspace = useMemo(
    () => receivedShares.find((share) => share.share_id === activeWorkspaceId) ?? null,
    [activeWorkspaceId, receivedShares],
  );
  const currencyFormatter = useMemo(() => getCurrencyFormatter(locale), [locale]);
  const dateFormatter = useMemo(() => getDateFormatter(locale), [locale]);
  const filteredReceivedShares = useMemo(() => {
    const normalizedQuery = normalizeSearchTerm(workspaceSearch);

    if (!normalizedQuery) {
      return receivedShares;
    }

    return receivedShares.filter((share) => {
      const displayDate = dateFormatter.format(getDisplayDateForMonthValue(share.month_key.slice(0, 7)));
      const haystack = normalizeSearchTerm(
        [
          share.owner_name || "",
          share.owner_email,
          share.month_key,
          displayDate,
        ].join(" "),
      );

      return haystack.includes(normalizedQuery);
    });
  }, [dateFormatter, receivedShares, workspaceSearch]);
  const visibleReceivedShares = useMemo(() => {
    if (!activeWorkspace) {
      return filteredReceivedShares;
    }

    if (filteredReceivedShares.some((share) => share.share_id === activeWorkspace.share_id)) {
      return filteredReceivedShares;
    }

    return [activeWorkspace, ...filteredReceivedShares];
  }, [activeWorkspace, filteredReceivedShares]);
  const workspaceSelectValue = activeWorkspace ? activeWorkspaceId : "personal";
  const isPersonalWorkspace = activeWorkspace === null;
  const effectiveMonth = activeWorkspace?.month_key.slice(0, 7) ?? filterMonth;
  const activeOwnerId = activeWorkspace?.owner_id ?? userId;
  const workspaceTransactions = useMemo(
    () =>
      transactions.filter((transaction) =>
        transaction.user_id === activeOwnerId
        && (effectiveMonth === "" || transaction.transaction_date.startsWith(effectiveMonth))
      ),
    [activeOwnerId, effectiveMonth, transactions],
  );
  const expenseCategories = useMemo(
    () =>
      Array.from(
        new Set([
          ...categories.filter((category) => !incomeCategories.has(category)),
          ...workspaceTransactions
            .filter((transaction) => transaction.type === "expense")
            .map((transaction) => getCanonicalCategory(transaction.category)),
        ]),
      ),
    [workspaceTransactions],
  );

  const filteredTransactions = useMemo(
    () =>
      workspaceTransactions.filter((transaction) => {
        const matchesType = filterType === "all" || transaction.type === filterType;
        const matchesExpenseCategory =
          filterExpenseCategory === "all" ||
          (
            transaction.type === "expense"
            && getCanonicalCategory(transaction.category) === filterExpenseCategory
          );
        return matchesType && matchesExpenseCategory;
      }),
    [filterExpenseCategory, filterType, workspaceTransactions],
  );

  const totals = filteredTransactions.reduce(
    (accumulator, transaction) => {
      if (transaction.type === "income") {
        accumulator.income += transaction.amount;
      } else {
        accumulator.expense += transaction.amount;
      }

      return accumulator;
    },
    { income: 0, expense: 0 },
  );

  const balance = totals.income - totals.expense;
  const transactionCount = filteredTransactions.length;
  const topIncome = filteredTransactions
    .filter((transaction) => transaction.type === "income")
    .sort((first, second) => second.amount - first.amount)[0];
  const topExpense = filteredTransactions
    .filter((transaction) => transaction.type === "expense")
    .sort((first, second) => second.amount - first.amount)[0];
  const expenseBreakdown = useMemo(() => {
    const grouped = new Map<string, number>();

    filteredTransactions
      .filter((transaction) => transaction.type === "expense")
      .forEach((transaction) => {
        const category = getCanonicalCategory(transaction.category);
        grouped.set(category, (grouped.get(category) ?? 0) + transaction.amount);
      });

    const entries = Array.from(grouped.entries())
      .sort((first, second) => second[1] - first[1])
      .slice(0, 5);
    const total = entries.reduce((sum, [, amount]) => sum + amount, 0);

    return entries.map(([category, amount], index) => ({
      category,
      amount,
      share: total > 0 ? amount / total : 0,
      color: chartPalette[index % chartPalette.length],
    }));
  }, [filteredTransactions]);
  const expenseBreakdownTotal = expenseBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const expenseBreakdownLabel =
    effectiveMonth !== ""
      ? dateFormatter.format(getDisplayDateForMonthValue(effectiveMonth))
      : dictionary.dashboard.month;
  const expenseGradient = useMemo(() => {
    if (expenseBreakdown.length === 0) {
      return "conic-gradient(rgba(255,255,255,0.08) 0deg 360deg)";
    }

    let current = 0;

    return `conic-gradient(${expenseBreakdown
      .map((item) => {
        const start = current;
        const end = current + item.share * 360;
        current = end;
        return `${item.color} ${start}deg ${end}deg`;
      })
      .join(", ")})`;
  }, [expenseBreakdown]);
  const maxMetricValue = Math.max(totals.income, totals.expense, Math.abs(balance), 1);
  const balanceSnapshot = [
    {
      label: dictionary.dashboard.income,
      value: totals.income,
      tone: "income",
    },
    {
      label: dictionary.dashboard.expenses,
      value: totals.expense,
      tone: "expense",
    },
    {
      label: dictionary.dashboard.currentBalance,
      value: Math.abs(balance),
      tone: balance >= 0 ? "balance-positive" : "balance-warning",
    },
  ] as const;
  const currentPeriodValue = effectiveMonth === "" ? getMonthValue(new Date()) : effectiveMonth;
  const currentPeriodLabel = dateFormatter.format(getDisplayDateForMonthValue(currentPeriodValue));
  const balanceStatusTone = balance >= 0 ? "positive" : "warning";
  const workspaceLabel = activeWorkspace
    ? `${activeWorkspace.owner_name || activeWorkspace.owner_email} · ${currentPeriodLabel}`
    : collaborationText.personalWorkspace;
  const sharedWorkspaceCopy = activeWorkspace
    ? `${collaborationText.sharedBy} ${activeWorkspace.owner_name || activeWorkspace.owner_email} ${collaborationText.sharedOnDate} ${currentPeriodLabel}`
    : collaborationText.personalWorkspace;
  const loadReceivedShares = useCallback(async () => {
    const { data, error } = await supabase.rpc("get_received_month_shares");

    if (!error && data) {
      setReceivedShares(data as ReceivedMonthShare[]);
    }
  }, [supabase]);
  const loadMonthCollaborators = useCallback(async (monthValue: string) => {
    setIsLoadingCollaborators(true);

    const { data, error } = await supabase.rpc("get_month_collaborators", {
      shared_month: `${monthValue}-01`,
    });

    if (!error && data) {
      setMonthCollaborators(data as MonthCollaborator[]);
    } else if (error) {
      setMonthCollaborators([]);
    }

    setIsLoadingCollaborators(false);
  }, [supabase]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMessage(null);
    }, messageTone === "error" ? 3600 : 2400);

    return () => window.clearTimeout(timeout);
  }, [message, messageTone]);

  useEffect(() => {
    if (!isBalanceHelpOpen) {
      return;
    }

    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsBalanceHelpOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeydown);

    return () => window.removeEventListener("keydown", handleKeydown);
  }, [isBalanceHelpOpen]);

  function getShareErrorMessage(error: ShareRpcError) {
    const combinedMessage = [
      error.code,
      error.message,
      error.details ?? "",
      error.hint ?? "",
    ]
      .join(" ")
      .toLowerCase();

    if (combinedMessage.includes("auth_required")) {
      return collaborationText.shareAuthRequired;
    }

    if (combinedMessage.includes("target_not_found")) {
      return collaborationText.shareNotFound;
    }

    if (combinedMessage.includes("target_is_owner")) {
      return collaborationText.shareSelf;
    }

    if (combinedMessage.includes("email_required")) {
      return collaborationText.shareEmailRequired;
    }

    if (
      combinedMessage.includes("share_month_with_email")
      || combinedMessage.includes("permission denied")
      || combinedMessage.includes("auth.users")
      || combinedMessage.includes("schema cache")
      || combinedMessage.includes("function")
    ) {
      return collaborationText.shareSetupRequired;
    }

    const debugMessage = error.message?.trim() || error.details?.trim() || error.hint?.trim();

    return debugMessage
      ? `${collaborationText.shareGenericError} (${debugMessage})`
      : collaborationText.shareGenericError;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    setMessageTone("success");
    setIsSaving(true);

    const amount = Number(formState.amount);

    if (!formState.title.trim() || Number.isNaN(amount) || amount <= 0) {
      setMessageTone("error");
      setMessage(dictionary.dashboard.fillRequired);
      setIsSaving(false);
      return;
    }

    if (activeWorkspace && !formState.date.startsWith(activeWorkspace.month_key.slice(0, 7))) {
      setMessageTone("error");
      setMessage(collaborationText.monthLockedError);
      setIsSaving(false);
      return;
    }

    const { data, error } = await supabase
      .from("transactions")
      .insert({
        user_id: activeOwnerId,
        title: formState.title.trim(),
        description: formState.description.trim() || null,
        category: formState.category,
        type: formState.type,
        amount,
        transaction_date: formState.date,
      })
      .select("id, user_id, title, description, category, type, amount, transaction_date, created_at")
      .single<TransactionRecord>();

    if (error || !data) {
      setMessageTone("error");
      setMessage(error?.message ?? dictionary.dashboard.saveError);
      setIsSaving(false);
      return;
    }

    setTransactions((current) =>
      [data, ...current].sort((first, second) =>
        second.transaction_date.localeCompare(first.transaction_date),
      ),
    );
    setFormState({
      title: "",
      amount: "",
      type: "income",
      category: categories[0],
      date: getSuggestedDateForMonth(effectiveMonth),
      description: "",
    });
    setIsComposerOpen(false);
    setMessageTone("success");
    setMessage(dictionary.dashboard.saveSuccess);
    setIsSaving(false);
  }

  async function handleShareMonth(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setShareStatus(null);
    setShareStatusTone("success");
    const normalizedEmail = shareEmail.trim().toLowerCase();

    if (!normalizedEmail) {
      setShareStatusTone("error");
      setShareStatus(collaborationText.shareEmailRequired);
      return;
    }

    setIsSharing(true);

    const { error } = await supabase.rpc("share_month_with_email", {
      target_email: normalizedEmail,
      shared_month: `${effectiveMonth}-01`,
    });

    if (error) {
      console.error("share_month_with_email failed", error);
      setShareStatusTone("error");
      setShareStatus(getShareErrorMessage(error));
      setIsSharing(false);
      return;
    }

    setShareEmail("");
    setShareStatusTone("success");
    setShareStatus(collaborationText.shareSuccess);
    await Promise.all([
      loadMonthCollaborators(effectiveMonth),
      loadReceivedShares(),
    ]);
    setIsSharing(false);
  }

  async function handleRevokeMonthShare(shareId: string) {
    setRevokingShareId(shareId);

    const { error } = await supabase.rpc("revoke_month_share", {
      share_id: shareId,
    });

    if (!error) {
      await Promise.all([
        loadMonthCollaborators(effectiveMonth),
        loadReceivedShares(),
      ]);
    }

    setRevokingShareId(null);
  }

  async function handleRemove(id: string) {
    setMessage(null);
    setMessageTone("success");
    setConfirmDeleteId(null);
    setDeletingId(id);

    const { error } = await supabase.from("transactions").delete().eq("id", id);

    if (error) {
      setMessageTone("error");
      setMessage(error.message);
      setDeletingId(null);
      return;
    }

    setTransactions((current) => current.filter((transaction) => transaction.id !== id));
    setMessage(dictionary.dashboard.removeSuccess);
    setDeletingId(null);
  }

  return (
    <div className="app-shell">
      <div className="page-shell">
        <AppNavbar
          userName={userName}
          userEmail={userEmail}
        />

        {message ? (
          <div className="feedback-toast-layer" aria-live="polite">
            <button
              type="button"
              className="feedback-toast-backdrop"
              aria-label={dictionary.dashboard.statusGuideClose}
              onClick={() => setMessage(null)}
            />
            <div
              className={`feedback-toast ${
                messageTone === "error" ? "feedback-toast--error" : "feedback-toast--success"
              }`}
              role={messageTone === "error" ? "alert" : "status"}
            >
              <p className="feedback-toast__eyebrow">
                {messageTone === "error"
                  ? dictionary.dashboard.toastErrorEyebrow
                  : dictionary.dashboard.toastSuccessEyebrow}
              </p>
              <p className="feedback-toast__message">{message}</p>
            </div>
          </div>
        ) : null}

        {isBalanceHelpOpen ? (
          <div className="status-help-layer">
            <button
              type="button"
              className="status-help-backdrop"
              aria-label={dictionary.dashboard.statusGuideClose}
              onClick={() => setIsBalanceHelpOpen(false)}
            />
            <div
              className="status-help-popover"
              role="dialog"
              aria-modal="false"
              aria-labelledby="balance-status-guide-title"
            >
              <p className="status-help-popover__eyebrow">{dictionary.dashboard.currentBalance}</p>
              <h3 id="balance-status-guide-title">{dictionary.dashboard.statusGuideTitle}</h3>
              <p className="status-help-popover__description">
                {dictionary.dashboard.statusGuideDescription}
              </p>

              <div className="status-help-list">
                <article className="status-help-item">
                  <span
                    className="status-help-item__swatch status-help-item__swatch--positive"
                    aria-hidden="true"
                  />
                  <div className="status-help-item__copy">
                    <strong>{dictionary.dashboard.statusGuidePositiveTitle}</strong>
                    <p>{dictionary.dashboard.statusGuidePositiveText}</p>
                  </div>
                </article>

                <article className="status-help-item">
                  <span
                    className="status-help-item__swatch status-help-item__swatch--warning"
                    aria-hidden="true"
                  />
                  <div className="status-help-item__copy">
                    <strong>{dictionary.dashboard.statusGuideWarningTitle}</strong>
                    <p>{dictionary.dashboard.statusGuideWarningText}</p>
                  </div>
                </article>
              </div>

              <button
                type="button"
                className="ghost-button status-help-popover__close"
                onClick={() => setIsBalanceHelpOpen(false)}
              >
                {dictionary.dashboard.statusGuideClose}
              </button>
            </div>
          </div>
        ) : null}

        {isShareOpen ? (
          <button
            type="button"
            className="share-backdrop"
            aria-label={collaborationText.shareMonth}
            onClick={() => setIsShareOpen(false)}
          />
        ) : null}

        <main className="dashboard dashboard--home">
          <section className="dashboard-toolbar">
            <div className="dashboard-toolbar__intro">
              <p className="card__label">Cashlar</p>
              <h2>{dictionary.dashboard.panelTitle}</h2>
              <p className="dashboard-toolbar__date">{currentPeriodLabel}</p>
              <p
                className={`dashboard-toolbar__workspace-copy ${
                  activeWorkspace ? "dashboard-toolbar__workspace-copy--shared" : ""
                }`}
              >
                {sharedWorkspaceCopy}
              </p>
            </div>

            <div className="dashboard-toolbar__controls">
              {receivedShares.length > 0 ? (
                <label className="dashboard-toolbar__workspace">
                  <span>{collaborationText.workspaceLabel}</span>
                  <input
                    type="search"
                    className="dashboard-toolbar__workspace-search"
                    value={workspaceSearch}
                    onChange={(event) => setWorkspaceSearch(event.target.value)}
                    placeholder={collaborationText.workspaceSearchPlaceholder}
                    aria-label={collaborationText.workspaceSearchPlaceholder}
                  />
                  <select
                    value={workspaceSelectValue}
                    onChange={(event) => {
                      const nextWorkspaceId = event.target.value;
                      const nextWorkspace = receivedShares.find((share) => share.share_id === nextWorkspaceId) ?? null;
                      setActiveWorkspaceId(nextWorkspaceId);
                      setFilterType("all");
                      setFilterExpenseCategory("all");
                      setIsShareOpen(false);

                      if (nextWorkspaceId === "personal") {
                        setFormState((current) => ({
                          ...current,
                          date: getSuggestedDateForMonth(filterMonth),
                        }));
                        return;
                      }

                      if (nextWorkspace) {
                        const lockedMonth = nextWorkspace.month_key.slice(0, 7);
                        setFilterMonth(lockedMonth);
                        setFormState((current) => ({
                          ...current,
                          date: clampDateToMonth(current.date, lockedMonth),
                        }));
                      }
                    }}
                  >
                    <option value="personal">{collaborationText.personalWorkspace}</option>
                    {visibleReceivedShares.map((share) => (
                      <option key={share.share_id} value={share.share_id}>
                        {(share.owner_name || share.owner_email)} |{" "}
                        {dateFormatter.format(getDisplayDateForMonthValue(share.month_key.slice(0, 7)))}
                      </option>
                    ))}
                  </select>
                  {filteredReceivedShares.length === 0 ? (
                    <small className="dashboard-toolbar__workspace-hint">
                      {collaborationText.workspaceSearchEmpty}
                    </small>
                  ) : null}
                </label>
              ) : null}

              <div className="dashboard-toolbar__period-actions">
                <label className="dashboard-toolbar__period">
                  <span>{dictionary.dashboard.month}</span>
                  <input
                    type="month"
                    value={effectiveMonth}
                    disabled={!isPersonalWorkspace}
                    onChange={(event) => {
                      const nextMonth = event.target.value;
                      setFilterMonth(nextMonth);

                      if (isShareOpen) {
                        void loadMonthCollaborators(nextMonth);
                      }
                    }}
                  />
                </label>

                {isPersonalWorkspace ? (
                  <div className="share-anchor dashboard-toolbar__share-trigger">
                    <button
                      type="button"
                      className={`ghost-button share-month-button ${isShareOpen ? "share-month-button--open" : ""}`}
                      aria-label={collaborationText.shareMonth}
                      title={collaborationText.shareMonth}
                      aria-expanded={isShareOpen}
                      aria-controls="share-month-popover"
                      onClick={() => {
                        setIsShareOpen((current) => {
                          const nextValue = !current;

                          if (nextValue) {
                            void loadMonthCollaborators(effectiveMonth);
                          }

                          return nextValue;
                        });
                        setShareStatus(null);
                      }}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                        <path
                          d="M6.75 17.25c0-5.1 4.15-9.25 9.25-9.25H18"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.9"
                        />
                        <path
                          d="M13.5 4.75 18.25 8.25 13.5 11.75"
                          fill="none"
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="1.9"
                        />
                      </svg>
                      <span className="sr-only">{collaborationText.shareMonth}</span>
                    </button>

                    {isShareOpen ? (
                      <div id="share-month-popover" className="share-popover">
                      <div className="share-popover__head">
                        <div>
                          <p className="card__label">{collaborationText.shareMonth}</p>
                          <h3>{collaborationText.shareMonthTitle}</h3>
                        </div>
                        <span className="share-popover__month">{currentPeriodLabel}</span>
                      </div>

                      <p className="share-popover__description">
                        {collaborationText.shareMonthDescription}
                      </p>

                      <form className="share-popover__form" onSubmit={handleShareMonth}>
                        <label>
                          {collaborationText.shareEmailLabel}
                          <input
                            type="email"
                            value={shareEmail}
                            onChange={(event) => setShareEmail(event.target.value)}
                            placeholder={collaborationText.shareEmailPlaceholder}
                            required
                          />
                        </label>
                        <button type="submit" className="button" disabled={isSharing}>
                          {isSharing ? collaborationText.shareSubmitting : collaborationText.shareSubmit}
                        </button>
                      </form>

                      {shareStatus ? (
                        <p className={`feedback-banner ${shareStatusTone === "error" ? "feedback-banner--error" : ""}`}>
                          {shareStatus}
                        </p>
                      ) : null}

                      <div className="share-collaborators">
                        <div className="share-collaborators__head">
                          <strong>{collaborationText.collaboratorsTitle}</strong>
                        </div>

                        {isLoadingCollaborators ? (
                          <p className="share-collaborators__empty">...</p>
                        ) : monthCollaborators.length === 0 ? (
                          <p className="share-collaborators__empty">{collaborationText.noCollaborators}</p>
                        ) : (
                          monthCollaborators.map((collaborator) => (
                            <article key={collaborator.share_id} className="share-collaborator">
                              <div className="share-collaborator__copy">
                                <strong>
                                  {collaborator.collaborator_name || collaborator.collaborator_email}
                                </strong>
                                <span>{collaborator.collaborator_email}</span>
                              </div>
                              <button
                                type="button"
                                className="ghost-button share-collaborator__remove"
                                disabled={revokingShareId === collaborator.share_id}
                                onClick={() => handleRevokeMonthShare(collaborator.share_id)}
                              >
                                {revokingShareId === collaborator.share_id
                                  ? collaborationText.revokingShare
                                  : collaborationText.revokeShare}
                              </button>
                            </article>
                          ))
                        )}
                      </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="dashboard-hero">
            <article className="summary-card">
              <div className="summary-card__top">
                <div>
                  <p className="card__label">{dictionary.dashboard.currentBalance}</p>
                  <h1>{currencyFormatter.format(balance)}</h1>
                </div>
                <div className="summary-card__status">
                  <span className={`status-badge status-badge--${balanceStatusTone}`}>
                    {balance >= 0 ? dictionary.dashboard.balancePositive : dictionary.dashboard.balanceWarning}
                  </span>
                  <button
                    type="button"
                    className={`status-badge__help status-badge__help--${balanceStatusTone}`}
                    aria-label={dictionary.dashboard.balanceStatusHelp}
                    title={dictionary.dashboard.balanceStatusHelp}
                    aria-expanded={isBalanceHelpOpen}
                    onClick={() => setIsBalanceHelpOpen((current) => !current)}
                  >
                    ?
                  </button>
                </div>
              </div>

              <div className="summary-card__grid">
                <article className="summary-stat summary-stat--income">
                  <span>{dictionary.dashboard.income}</span>
                  <strong>{currencyFormatter.format(totals.income)}</strong>
                </article>
                <article className="summary-stat summary-stat--expense">
                  <span>{dictionary.dashboard.expenses}</span>
                  <strong>{currencyFormatter.format(totals.expense)}</strong>
                </article>
                <article className="summary-stat">
                  <span>{dictionary.dashboard.entries}</span>
                  <strong>{transactionCount}</strong>
                </article>
              </div>
            </article>

            <div className="hero-stack">
              <article className="feature-card">
                <span className="card__label">{dictionary.dashboard.topIncome}</span>
                <strong>{topIncome ? currencyFormatter.format(topIncome.amount) : currencyFormatter.format(0)}</strong>
                <p>{topIncome ? getCategoryLabel(topIncome.category, locale) : dictionary.dashboard.noIncomePeriod}</p>
              </article>

              <article className="feature-card">
                <span className="card__label">{dictionary.dashboard.topExpense}</span>
                <strong>{topExpense ? currencyFormatter.format(topExpense.amount) : currencyFormatter.format(0)}</strong>
                <p>{topExpense ? getCategoryLabel(topExpense.category, locale) : dictionary.dashboard.noExpensePeriod}</p>
              </article>
            </div>
          </section>

          <section className="desktop-insights">
            <article className="analytics-card analytics-card--donut">
              <div className="analytics-card__head">
                <div>
                  <p className="card__label">{dictionary.dashboard.expenseCategory}</p>
                  <h2>{dictionary.dashboard.expenses}</h2>
                </div>
                <span className="analytics-card__eyebrow">{expenseBreakdownLabel}</span>
              </div>

              <div className="analytics-card__body analytics-card__body--split">
                <div className="donut-chart">
                  <div
                    className="donut-chart__ring"
                    style={{ "--chart-fill": expenseGradient } as CSSProperties}
                  >
                    <div className="donut-chart__center">
                      <strong>{currencyFormatter.format(expenseBreakdownTotal)}</strong>
                      <span>{dictionary.dashboard.expenses}</span>
                    </div>
                  </div>
                </div>

                <div className="category-breakdown">
                  {expenseBreakdown.length === 0 ? (
                    <p className="category-breakdown__empty">{dictionary.dashboard.noExpensePeriod}</p>
                  ) : (
                    expenseBreakdown.map((item) => (
                      <article key={item.category} className="category-breakdown__item">
                        <span
                          className="category-breakdown__dot"
                          style={{ "--dot-color": item.color } as CSSProperties}
                          aria-hidden="true"
                        />
                        <div className="category-breakdown__copy">
                          <strong>{getCategoryLabel(item.category, locale)}</strong>
                          <small>{Math.round(item.share * 100)}%</small>
                        </div>
                        <span className="category-breakdown__amount">
                          {currencyFormatter.format(item.amount)}
                        </span>
                      </article>
                    ))
                  )}
                </div>
              </div>
            </article>

            <article className="analytics-card analytics-card--balance">
              <div className="analytics-card__head">
                <div>
                  <p className="card__label">{dictionary.dashboard.currentBalance}</p>
                  <h2>{dictionary.dashboard.panelTitle}</h2>
                </div>
                <span className="analytics-card__eyebrow">{expenseBreakdownLabel}</span>
              </div>

              <div className="balance-overview">
                <div className="balance-overview__bars" aria-hidden="true">
                  {balanceSnapshot.map((item) => (
                    <div key={item.label} className={`balance-bar balance-bar--${item.tone}`}>
                      <span
                        className="balance-bar__fill"
                        style={{
                          "--bar-size": `${Math.max(16, (item.value / maxMetricValue) * 100)}%`,
                        } as CSSProperties}
                      />
                    </div>
                  ))}
                </div>

                <div className="balance-overview__metrics">
                  {balanceSnapshot.map((item) => (
                    <article key={item.label} className="balance-metric">
                      <span className={`balance-metric__dot balance-metric__dot--${item.tone}`} aria-hidden="true" />
                      <div>
                        <strong>{item.label}</strong>
                        <small>{currencyFormatter.format(item.value)}</small>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </article>
          </section>

          <section className="workspace-grid">
            <section className="panel panel--list">
              <div className="panel__head panel__head--list">
                <div className="panel__title panel__title--list">
                  <p className="card__label">{dictionary.dashboard.panelEyebrow}</p>
                  <div className="panel__title-row panel__title-row--list">
                    <h2>{dictionary.dashboard.panelTitle}</h2>
                    <div className="composer-anchor">
                      <button
                        type="button"
                        className={`add-transaction-button ${isComposerOpen ? "add-transaction-button--open" : ""}`}
                        aria-label={dictionary.dashboard.addEntry}
                        aria-expanded={isComposerOpen}
                        aria-controls="transaction-composer"
                        onClick={() => setIsComposerOpen((current) => !current)}
                      >
                        <span className="add-transaction-button__core" aria-hidden="true">
                          <span />
                          <span />
                        </span>
                      </button>

                      {isComposerOpen ? (
                        <div id="transaction-composer" className="composer-popover">
                          <div className="composer-popover__head">
                            <div>
                              <p className="card__label">{dictionary.dashboard.newEntry}</p>
                              <h3>{dictionary.dashboard.registerEntry}</h3>
                            </div>
                          </div>

                          <form className="transaction-form" onSubmit={handleSubmit}>
                            <label>
                              {dictionary.dashboard.entryTitle}
                              <input
                                type="text"
                                value={formState.title}
                                onChange={(event) =>
                                  setFormState((current) => ({ ...current, title: event.target.value }))
                                }
                                placeholder={dictionary.dashboard.entryTitlePlaceholder}
                                required
                              />
                            </label>

                            <div className="form-row">
                              <label>
                                {dictionary.dashboard.amount}
                                <input
                                  type="number"
                                  value={formState.amount}
                                  onChange={(event) =>
                                    setFormState((current) => ({ ...current, amount: event.target.value }))
                                  }
                                  placeholder={dictionary.dashboard.amountPlaceholder}
                                  min="0.01"
                                  step="0.01"
                                  required
                                />
                              </label>

                              <label>
                                {dictionary.dashboard.type}
                                <select
                                  value={formState.type}
                                  onChange={(event) =>
                                    setFormState((current) => ({
                                      ...current,
                                      type: event.target.value as TransactionType,
                                    }))
                                  }
                                >
                                  <option value="income">{dictionary.dashboard.typeIncome}</option>
                                  <option value="expense">{dictionary.dashboard.typeExpense}</option>
                                </select>
                              </label>
                            </div>

                            <div className="form-row">
                              <label>
                                {dictionary.dashboard.category}
                                <select
                                  value={formState.category}
                                  onChange={(event) =>
                                    setFormState((current) => ({ ...current, category: event.target.value }))
                                  }
                                >
                                  {categories.map((category) => (
                                    <option key={category} value={category}>
                                      {getCategoryLabel(category, locale)}
                                    </option>
                                  ))}
                                </select>
                              </label>

                              <label>
                                {dictionary.dashboard.date}
                                <input
                                  type="date"
                                  value={formState.date}
                                  onChange={(event) =>
                                    setFormState((current) => ({ ...current, date: event.target.value }))
                                  }
                                  required
                                />
                              </label>
                            </div>

                            <label>
                              {dictionary.dashboard.notes}
                              <textarea
                                rows={3}
                                value={formState.description}
                                onChange={(event) =>
                                  setFormState((current) => ({ ...current, description: event.target.value }))
                                }
                                placeholder={dictionary.dashboard.notesPlaceholder}
                              />
                            </label>

                            <div className="composer-actions">
                              <button type="submit" className="button" disabled={isSaving}>
                                {isSaving ? dictionary.dashboard.savingEntry : dictionary.dashboard.saveEntry}
                              </button>
                              <button
                                type="button"
                                className="ghost-button composer-cancel"
                                onClick={() => setIsComposerOpen(false)}
                              >
                                {dictionary.dashboard.cancelEntry}
                              </button>
                            </div>
                          </form>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="panel__actions panel__actions--list">
                  <div className="filters">
                    <label>
                      {dictionary.dashboard.type}
                      <select
                        value={filterType}
                        onChange={(event) => {
                          const nextType = event.target.value as "all" | TransactionType;
                          setFilterType(nextType);

                          if (nextType === "income") {
                            setFilterExpenseCategory("all");
                          }
                        }}
                      >
                        <option value="all">{dictionary.dashboard.typeAll}</option>
                        <option value="income">{dictionary.dashboard.income}</option>
                        <option value="expense">{dictionary.dashboard.expenses}</option>
                      </select>
                    </label>

                    <label>
                      {dictionary.dashboard.expenseCategory}
                      <select
                        value={filterExpenseCategory}
                        onChange={(event) => {
                          const nextCategory = event.target.value;
                          setFilterExpenseCategory(nextCategory);

                          if (nextCategory !== "all") {
                            setFilterType("expense");
                          }
                        }}
                      >
                        <option value="all">{dictionary.dashboard.expenseCategoryAll}</option>
                        {expenseCategories.map((category) => (
                          <option key={category} value={category}>
                            {getCategoryLabel(category, locale)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                </div>
              </div>

              {isComposerOpen ? (
                <button
                  type="button"
                  className="composer-backdrop"
                  aria-label={dictionary.dashboard.cancelEntry}
                  onClick={() => setIsComposerOpen(false)}
                />
              ) : null}

              {confirmDeleteId ? (
                <button
                  type="button"
                  className="delete-bubble-backdrop"
                  aria-label={dictionary.dashboard.deleteCancel}
                  onClick={() => setConfirmDeleteId(null)}
                />
              ) : null}

              <div className="transaction-list" aria-live="polite">
                {filteredTransactions.length === 0 ? (
                  <div className="empty-state">{dictionary.dashboard.noTransactions}</div>
                ) : (
                  [...filteredTransactions]
                    .sort((first, second) => second.transaction_date.localeCompare(first.transaction_date))
                    .map((transaction) => (
                      <article key={transaction.id} className="transaction-item">
                        <div className="transaction-item__main">
                          <div className="transaction-item__title-row">
                            <h3>{transaction.title}</h3>
                            <span className={`transaction-item__type type-${transaction.type}`}>
                              {transaction.type === "income"
                                ? dictionary.dashboard.typeIncome
                                : dictionary.dashboard.typeExpense}
                            </span>
                          </div>
                          <p className="transaction-item__meta">
                            {getCategoryLabel(transaction.category, locale)} |{" "}
                            {dateFormatter.format(new Date(`${transaction.transaction_date}T12:00:00`))}
                          </p>
                          <p className="transaction-item__notes">{transaction.description ?? ""}</p>
                        </div>

                        <div className="transaction-item__side">
                          <strong className={`transaction-item__amount amount-${transaction.type}`}>
                            {transaction.type === "income" ? "+" : "-"}
                            {currencyFormatter.format(transaction.amount)}
                          </strong>
                          <div className="transaction-item__actions">
                            <button
                              type="button"
                              className="ghost-button"
                              disabled={deletingId === transaction.id}
                              onClick={() =>
                                setConfirmDeleteId((current) =>
                                  current === transaction.id ? null : transaction.id,
                                )
                              }
                            >
                              {deletingId === transaction.id
                                ? dictionary.dashboard.removing
                                : dictionary.dashboard.remove}
                            </button>

                            {confirmDeleteId === transaction.id ? (
                              <div className="delete-bubble" role="dialog" aria-modal="false">
                                <p className="delete-bubble__title">{dictionary.dashboard.deleteTitle}</p>
                                <p className="delete-bubble__text">
                                  {dictionary.dashboard.deleteQuestion.replace("{title}", transaction.title)}
                                </p>
                                <div className="delete-bubble__actions">
                                  <button
                                    type="button"
                                    className="ghost-button delete-bubble__cancel"
                                    onClick={() => setConfirmDeleteId(null)}
                                  >
                                    {dictionary.dashboard.deleteCancel}
                                  </button>
                                  <button
                                    type="button"
                                    className="ghost-button delete-bubble__confirm"
                                    disabled={deletingId === transaction.id}
                                    onClick={() => handleRemove(transaction.id)}
                                  >
                                    {deletingId === transaction.id
                                      ? dictionary.dashboard.removing
                                      : dictionary.dashboard.deleteConfirm}
                                  </button>
                                </div>
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </article>
                    ))
                )}
              </div>
            </section>
          </section>
        </main>
      </div>
    </div>
  );
}

function getDateValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function getMonthValue(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function getSuggestedDateForMonth(monthValue: string) {
  if (!monthValue) {
    return getDateValue(new Date());
  }

  const today = new Date();
  const todayMonth = getMonthValue(today);

  if (todayMonth === monthValue) {
    return getDateValue(today);
  }

  return `${monthValue}-01`;
}

function clampDateToMonth(dateValue: string, monthValue: string) {
  if (!monthValue || dateValue.startsWith(monthValue)) {
    return dateValue;
  }

  return getSuggestedDateForMonth(monthValue);
}

function getDisplayDateForMonthValue(monthValue: string) {
  const referenceDate = new Date();

  if (!monthValue) {
    return new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate(),
      12,
    );
  }

  const [yearText, monthText] = monthValue.split("-");
  const year = Number(yearText);
  const monthIndex = Number(monthText) - 1;

  if (Number.isNaN(year) || Number.isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) {
    return new Date(
      referenceDate.getFullYear(),
      referenceDate.getMonth(),
      referenceDate.getDate(),
      12,
    );
  }

  const lastDayOfMonth = new Date(year, monthIndex + 1, 0).getDate();
  const day = Math.min(referenceDate.getDate(), lastDayOfMonth);

  return new Date(year, monthIndex, day, 12);
}

function normalizeSearchTerm(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
