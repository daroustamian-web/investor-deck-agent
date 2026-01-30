import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, BrandConfig, ProjectData, Message, QuestionCategory } from './types';

const DEFAULT_BRAND: BrandConfig = {
  logo: null,
  companyName: '',
  primaryColor: '#003B75',
  secondaryColor: '#00A3E0',
  accentColor: '#FF6B35',
  darkColor: '#1E293B',
  lightColor: '#F8FAFC',
};

const generateId = () => Math.random().toString(36).substring(2, 9);

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Branding
      brand: DEFAULT_BRAND,
      setBrand: (brandUpdate) =>
        set((state) => ({
          brand: { ...state.brand, ...brandUpdate },
        })),

      // Project data
      projectData: {},
      setProjectData: (data) =>
        set((state) => ({
          projectData: { ...state.projectData, ...data },
        })),

      // Chat
      messages: [],
      addMessage: (message) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              ...message,
              id: generateId(),
              timestamp: new Date(),
            },
          ],
        })),
      clearMessages: () => set({ messages: [] }),

      // Progress
      currentCategory: 'site',
      setCurrentCategory: (category) => set({ currentCategory: category }),
      completedCategories: [],
      markCategoryComplete: (category) =>
        set((state) => ({
          completedCategories: state.completedCategories.includes(category)
            ? state.completedCategories
            : [...state.completedCategories, category],
        })),

      // Generation
      isGenerating: false,
      setIsGenerating: (generating) => set({ isGenerating: generating }),
      deckReady: false,
      setDeckReady: (ready) => set({ deckReady: ready }),

      // Reset
      reset: () =>
        set({
          brand: DEFAULT_BRAND,
          projectData: {},
          messages: [],
          currentCategory: 'site',
          completedCategories: [],
          isGenerating: false,
          deckReady: false,
        }),
    }),
    {
      name: 'investor-deck-storage',
      partialize: (state) => ({
        brand: state.brand,
        projectData: state.projectData,
        completedCategories: state.completedCategories,
        currentCategory: state.currentCategory,
      }),
    }
  )
);
