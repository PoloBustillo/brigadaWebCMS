/**
 * Whitelist API Service
 * Handles all whitelist operations for user pre-authorization
 */

import apiClient from "./client";
import {
  CreateWhitelistRequest,
  CreateWhitelistResponse,
  WhitelistEntry,
  WhitelistUpdate,
  ListWhitelistParams,
  ListWhitelistResponse,
} from "@/types/activation";

const normalizeWhitelistEntry = (entry: any): WhitelistEntry => ({
  id: entry.id,
  identifier: entry.identifier,
  identifier_type: entry.identifier_type,
  full_name: entry.full_name,
  phone: entry.phone,
  assigned_role: entry.assigned_role,
  assigned_supervisor_id: entry.assigned_supervisor?.id,
  assigned_supervisor_name: entry.assigned_supervisor?.name,
  is_activated: entry.is_activated,
  has_active_code: entry.has_active_code,
  code_expires_at: entry.code_expires_at,
  activated_user_id: entry.activated_user_id,
  activated_user_name: entry.activated_user_name,
  activated_at: entry.activated_at,
  created_by: entry.created_by || 0,
  created_by_name: entry.created_by_name,
  created_at: entry.created_at,
  updated_at: entry.updated_at || entry.created_at,
  notes: entry.notes,
});

export const whitelistService = {
  /**
   * List whitelist entries with filters
   */
  async list(params?: ListWhitelistParams): Promise<ListWhitelistResponse> {
    const response = await apiClient.get<ListWhitelistResponse>(
      "/admin/whitelist",
      { params },
    );
    const data: any = response.data;
    return {
      ...data,
      items: (data.items || []).map(normalizeWhitelistEntry),
    } as ListWhitelistResponse;
  },

  /**
   * Get single whitelist entry details
   */
  async getById(id: number): Promise<WhitelistEntry> {
    const response = await apiClient.get<WhitelistEntry>(
      `/admin/whitelist/${id}`,
    );
    return normalizeWhitelistEntry(response.data);
  },

  /**
   * Create new whitelist entry
   */
  async create(data: CreateWhitelistRequest): Promise<CreateWhitelistResponse> {
    const response = await apiClient.post<CreateWhitelistResponse>(
      "/admin/whitelist",
      data,
    );
    return response.data;
  },

  /**
   * Update whitelist entry (only if not activated)
   */
  async update(id: number, data: WhitelistUpdate): Promise<WhitelistEntry> {
    const response = await apiClient.patch<WhitelistEntry>(
      `/admin/whitelist/${id}`,
      data,
    );
    return normalizeWhitelistEntry(response.data);
  },

  /**
   * Delete whitelist entry (only if not activated)
   */
  async delete(id: number): Promise<void> {
    await apiClient.delete(`/admin/whitelist/${id}`);
  },
};
