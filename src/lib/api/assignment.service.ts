import apiClient from "./client";
import { Assignment, AssignmentStatus } from "@/types";

export interface CreateAssignmentData {
  user_id: number;
  survey_id: number;
  location?: string;
  notes?: string;
}

export interface UpdateAssignmentData {
  status?: "active" | "inactive";
  location?: string;
  notes?: string;
}

export interface GetAssignmentsParams {
  status?: AssignmentStatus;
  skip?: number;
  limit?: number;
}

export const assignmentService = {
  /**
   * List all assignments with user and survey details (admin view)
   */
  async getAssignments(params?: GetAssignmentsParams): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>("/assignments", {
      params,
    });
    return response.data;
  },

  /**
   * Get assignments for a specific user
   */
  async getUserAssignments(
    userId: number,
    params?: GetAssignmentsParams,
  ): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>(
      `/assignments/user/${userId}`,
      { params },
    );
    return response.data;
  },

  /**
   * Get assignments for a specific survey
   */
  async getSurveyAssignments(
    surveyId: number,
    params?: GetAssignmentsParams,
  ): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>(
      `/assignments/survey/${surveyId}`,
      { params },
    );
    return response.data;
  },

  /**
   * Create new assignment (brigadista + survey)
   */
  async createAssignment(data: CreateAssignmentData): Promise<Assignment> {
    const response = await apiClient.post<Assignment>("/assignments", data);
    return response.data;
  },

  /**
   * Update assignment status or location
   */
  async updateAssignment(
    id: number,
    data: UpdateAssignmentData,
  ): Promise<Assignment> {
    const response = await apiClient.patch<Assignment>(
      `/assignments/${id}`,
      data,
    );
    return response.data;
  },

  /**
   * Delete assignment
   */
  async deleteAssignment(id: number): Promise<void> {
    await apiClient.delete(`/assignments/${id}`);
  },
};
