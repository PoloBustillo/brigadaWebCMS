import apiClient from "./client";
import { Survey, Question, AnswerOption, QuestionType } from "@/types";

interface CreateSurveyData {
  title: string;
  description?: string;
  questions: CreateQuestionData[];
}

interface UpdateSurveyData {
  title?: string;
  description?: string;
  questions?: CreateQuestionData[];
  change_summary?: string;
}

interface CreateQuestionData {
  question_text: string;
  question_type: QuestionType;
  is_required?: boolean;
  order: number;
  options?: { option_text: string; order: number }[];
  validation_rules?: Record<string, any>;
}

interface GetSurveysParams {
  skip?: number;
  limit?: number;
  is_active?: boolean;
}

export const surveyService = {
  /**
   * Get list of surveys
   */
  async getSurveys(params?: GetSurveysParams): Promise<Survey[]> {
    const response = await apiClient.get<Survey[]>("/admin/surveys", {
      params,
    });
    return response.data;
  },

  /**
   * Get survey by ID with versions
   */
  async getSurvey(id: number): Promise<Survey> {
    const response = await apiClient.get<Survey>(`/admin/surveys/${id}`);
    return response.data;
  },

  /**
   * Create new survey with questions
   */
  async createSurvey(data: CreateSurveyData): Promise<Survey> {
    const response = await apiClient.post<Survey>("/admin/surveys", data);
    return response.data;
  },

  /**
   * Update existing survey (creates new version)
   */
  async updateSurvey(id: number, data: UpdateSurveyData): Promise<Survey> {
    const response = await apiClient.put<Survey>(`/admin/surveys/${id}`, data);
    return response.data;
  },

  /**
   * Delete survey
   */
  async deleteSurvey(id: number): Promise<void> {
    await apiClient.delete(`/admin/surveys/${id}`);
  },

  /**
   * Publish a survey version
   */
  async publishVersion(surveyId: number, versionId: number): Promise<void> {
    await apiClient.post(
      `/admin/surveys/${surveyId}/versions/${versionId}/publish`,
    );
  },
};
