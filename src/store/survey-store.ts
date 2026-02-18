import { create } from "zustand";
import { Survey, Question } from "@/types";

interface SurveyState {
  surveys: Survey[];
  selectedSurvey: Survey | null;
  surveyQuestions: Question[];
  isLoading: boolean;
  error: string | null;

  // Actions
  setSurveys: (surveys: Survey[]) => void;
  setSelectedSurvey: (survey: Survey | null) => void;
  setSurveyQuestions: (questions: Question[]) => void;
  addSurvey: (survey: Survey) => void;
  updateSurvey: (id: number, survey: Partial<Survey>) => void;
  deleteSurvey: (id: number) => void;
  addQuestion: (question: Question) => void;
  updateQuestion: (id: number, question: Partial<Question>) => void;
  deleteQuestion: (id: number) => void;
  reorderQuestions: (questions: Question[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSurveyStore = create<SurveyState>((set) => ({
  surveys: [],
  selectedSurvey: null,
  surveyQuestions: [],
  isLoading: false,
  error: null,

  setSurveys: (surveys) =>
    set({
      surveys,
      error: null,
    }),

  setSelectedSurvey: (survey) =>
    set({
      selectedSurvey: survey,
      surveyQuestions: survey?.versions?.[0]?.questions || [],
    }),

  setSurveyQuestions: (questions) =>
    set({
      surveyQuestions: questions,
    }),

  addSurvey: (survey) =>
    set((state) => ({
      surveys: [...state.surveys, survey],
    })),

  updateSurvey: (id, updatedSurvey) =>
    set((state) => ({
      surveys: state.surveys.map((survey) =>
        survey.id === id ? { ...survey, ...updatedSurvey } : survey,
      ),
      selectedSurvey:
        state.selectedSurvey?.id === id
          ? { ...state.selectedSurvey, ...updatedSurvey }
          : state.selectedSurvey,
    })),

  deleteSurvey: (id) =>
    set((state) => ({
      surveys: state.surveys.filter((survey) => survey.id !== id),
      selectedSurvey:
        state.selectedSurvey?.id === id ? null : state.selectedSurvey,
    })),

  addQuestion: (question) =>
    set((state) => ({
      surveyQuestions: [...state.surveyQuestions, question],
    })),

  updateQuestion: (id, updatedQuestion) =>
    set((state) => ({
      surveyQuestions: state.surveyQuestions.map((question) =>
        question.id === id ? { ...question, ...updatedQuestion } : question,
      ),
    })),

  deleteQuestion: (id) =>
    set((state) => ({
      surveyQuestions: state.surveyQuestions.filter(
        (question) => question.id !== id,
      ),
    })),

  reorderQuestions: (questions) =>
    set({
      surveyQuestions: questions,
    }),

  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
    }),
}));
