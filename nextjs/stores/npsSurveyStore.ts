import { create } from 'zustand';

export type NpsSurveyState =
  | { waitingForResponse: true; lastShownAt: number; ignoredCount: number }
  | { responded: true; lastShownAt: number };

export interface N8nPrompts {
  showContactPrompt?: boolean;
}

export interface NpsStoreState {
  shouldShowNpsSurveyNext: boolean;
  currentSurveyState?: NpsSurveyState;
  currentUserId?: string;
  promptsData?: N8nPrompts;
  telemetryEnabled: boolean;
}

export interface NpsActions {
  setupNpsSurveyOnLogin: (userId: string, settings?: { userActivated?: boolean; userActivatedAt?: number; npsSurvey?: NpsSurveyState } | null) => void;
  setShouldShowNpsSurvey: (settings: { userActivated?: boolean; userActivatedAt?: number; npsSurvey?: NpsSurveyState }) => void;
  resetNpsSurveyOnLogOut: () => void;
  showNpsSurveyIfPossible: () => Promise<void>;
  respondNpsSurvey: () => Promise<void>;
  ignoreNpsSurvey: () => Promise<void>;
  setTelemetryEnabled: (enabled: boolean) => void;
}

export type NpsSurveyStore = NpsStoreState & NpsActions;

const SEVEN_DAYS_IN_MILLIS = 7 * 24 * 60 * 60 * 1000;
const SIX_MONTHS_IN_MILLIS = 183 * 24 * 60 * 60 * 1000;
const THREE_DAYS_IN_MILLIS = 3 * 24 * 60 * 60 * 1000;
export const MAXIMUM_TIMES_TO_SHOW_SURVEY_IF_IGNORED = 3;

export const useNpsSurveyStore = create<NpsSurveyStore>((set, get) => ({
  shouldShowNpsSurveyNext: false,
  currentSurveyState: undefined,
  currentUserId: undefined,
  promptsData: undefined,
  telemetryEnabled: true,

  setupNpsSurveyOnLogin: (userId, settings) => {
    set({ currentUserId: userId });
    if (settings) get().setShouldShowNpsSurvey(settings);
  },

  setShouldShowNpsSurvey: (settings) => {
    if (!get().telemetryEnabled) {
      set({ shouldShowNpsSurveyNext: false });
      return;
    }
    const currentSurveyState = settings.npsSurvey;
    set({ currentSurveyState });
    const userActivated = Boolean(settings.userActivated);
    const userActivatedAt = settings.userActivatedAt;
    const lastShownAt = currentSurveyState && 'lastShownAt' in currentSurveyState ? currentSurveyState.lastShownAt : undefined;
    if (!userActivated || !userActivatedAt) return;
    const timeSinceActivation = Date.now() - userActivatedAt;
    if (timeSinceActivation < THREE_DAYS_IN_MILLIS) return;
    if (!currentSurveyState || !lastShownAt) {
      set({ shouldShowNpsSurveyNext: true });
      return;
    }
    const timeSinceLastShown = Date.now() - lastShownAt;
    if ('responded' in currentSurveyState && timeSinceLastShown < SIX_MONTHS_IN_MILLIS) return;
    if ('waitingForResponse' in currentSurveyState && timeSinceLastShown < SEVEN_DAYS_IN_MILLIS) return;
    set({ shouldShowNpsSurveyNext: true });
  },

  resetNpsSurveyOnLogOut: () => set({ shouldShowNpsSurveyNext: false }),

  showNpsSurveyIfPossible: async () => {
    if (!get().shouldShowNpsSurveyNext) return;
    set({ shouldShowNpsSurveyNext: false });
    const current = get().currentSurveyState;
    const updated: NpsSurveyState = {
      waitingForResponse: true,
      lastShownAt: Date.now(),
      ignoredCount: current && 'ignoredCount' in current ? current.ignoredCount : 0,
    };
    set({ currentSurveyState: updated });
  },

  respondNpsSurvey: async () => {
    const current = get().currentSurveyState;
    if (!current) return;
    const updated: NpsSurveyState = {
      responded: true,
      lastShownAt: current.lastShownAt,
    };
    set({ currentSurveyState: updated });
  },

  ignoreNpsSurvey: async () => {
    const current = get().currentSurveyState;
    if (!current) return;
    const ignoredCount = 'ignoredCount' in current ? current.ignoredCount : 0;
    if (ignoredCount + 1 >= MAXIMUM_TIMES_TO_SHOW_SURVEY_IF_IGNORED) {
      await get().respondNpsSurvey();
      return;
    }
    const updated: NpsSurveyState = {
      waitingForResponse: true,
      lastShownAt: current.lastShownAt,
      ignoredCount: ignoredCount + 1,
    };
    set({ currentSurveyState: updated });
  },

  setTelemetryEnabled: (enabled: boolean) => set({ telemetryEnabled: enabled }),
}));

export default useNpsSurveyStore;

