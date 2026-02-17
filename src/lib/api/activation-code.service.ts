import apiClient from "./client";
import {
  ActivationCode,
  ActivationStatsResponse,
  GenerateCodeRequest,
  GenerateCodeResponse,
  ListActivationCodesParams,
  ListActivationCodesResponse,
  ListAuditLogsParams,
  ListAuditLogsResponse,
  RevokeCodeRequest,
  RevokeCodeResponse,
} from "@/types/activation";

const splitFullName = (fullName: string | undefined) => {
  const trimmed = (fullName || "").trim();
  if (!trimmed) {
    return { nombre: "", apellido: "" };
  }
  const parts = trimmed.split(" ");
  return {
    nombre: parts[0] || "",
    apellido: parts.slice(1).join(" "),
  };
};

const mapActivationCode = (code: any): ActivationCode => {
  const fullName = code.whitelist_entry?.full_name || "";
  const { nombre, apellido } = splitFullName(fullName);

  return {
    id: code.id,
    code_hash: code.code_hash || "",
    whitelist_id: code.whitelist_id,
    whitelist: {
      id: code.whitelist_entry?.id,
      identifier: code.whitelist_entry?.identifier,
      identifier_type: code.whitelist_entry?.identifier_type || "email",
      nombre,
      apellido,
      assigned_role: code.whitelist_entry?.assigned_role,
      supervisor_nombre: code.whitelist_entry?.supervisor_name || undefined,
      notes: code.whitelist_entry?.notes,
    },
    expires_at: code.expires_at,
    status: code.status,
    used_at: code.used_at || null,
    revoked_at: code.revoked_at || null,
    revoke_reason: code.revoke_reason || null,
    failed_attempts: code.failed_attempts ?? code.activation_attempts ?? 0,
    max_attempts: code.max_attempts ?? 5,
    created_at: code.generated_at || code.created_at,
    updated_at: code.updated_at || code.generated_at || code.created_at,
  };
};

const mapAuditLog = (log: any) => ({
  id: log.id,
  event_type: log.event_type,
  activation_code_id: log.activation_code_id,
  whitelist_id: log.whitelist_id,
  whitelist_entry: log.whitelist_identifier
    ? {
        identifier: log.whitelist_identifier,
        full_name: log.whitelist_full_name,
      }
    : undefined,
  identifier_attempted: log.identifier_attempted,
  ip_address: log.ip_address,
  user_agent: log.user_agent,
  device_id: log.device_id,
  success: log.success,
  failure_reason: log.failure_reason,
  created_user_id: log.created_user_id,
  created_user_name: log.created_user_name,
  request_metadata: log.request_metadata,
  created_at: log.created_at,
});

const mapStats = (stats: any): ActivationStatsResponse => ({
  overview: {
    total_whitelisted: stats.total_whitelist_entries || 0,
    total_activated: stats.activated_users || 0,
    pending_activation: stats.pending_activations || 0,
    activation_rate_pct: stats.activation_rate || 0,
  },
  codes: {
    total_generated: stats.total_codes_generated || 0,
    active_codes: stats.active_codes || 0,
    expired_codes: stats.expired_codes || 0,
    used_codes: stats.used_codes || 0,
    average_attempts_per_code: 0,
  },
  time_metrics: {
    avg_activation_time_hours: 0,
    median_activation_time_hours: 0,
    fastest_activation_minutes: 0,
    slowest_activation_days: 0,
  },
  security: {
    failed_attempts_24h: stats.failed_attempts_last_24_hours || 0,
    blocked_ips: 0,
    locked_codes: stats.locked_codes || 0,
    rate_limit_violations_24h: 0,
  },
  trends: {
    activations_by_day: [],
  },
});

/**
 * Activation Codes API Service
 * Handles all activation code operations
 */
export const activationCodeService = {
  /**
   * List activation codes with filters
   */
  async list(
    params?: ListActivationCodesParams,
  ): Promise<ListActivationCodesResponse> {
    const response = await apiClient.get<ListActivationCodesResponse>(
      "/admin/activation-codes",
      { params },
    );
    const data: any = response.data;
    return {
      ...data,
      items: (data.items || []).map(mapActivationCode),
      summary: data.summary || {
        active_codes: data.active_codes || 0,
        expired_codes: data.expired_codes || 0,
        used_codes: data.used_codes || 0,
        expiring_in_24h: 0,
      },
    } as ListActivationCodesResponse;
  },

  /**
   * Get single activation code details
   */
  async getById(id: number): Promise<ActivationCode> {
    const response = await apiClient.get(`/admin/activation-codes/${id}`);
    return mapActivationCode(response.data);
  },

  /**
   * Generate new activation code for whitelist entry
   */
  async generate(data: GenerateCodeRequest): Promise<GenerateCodeResponse> {
    const response = await apiClient.post<GenerateCodeResponse>(
      "/admin/activation-codes/generate",
      data,
    );
    return response.data;
  },

  /**
   * Revoke activation code
   */
  async revoke(
    id: number,
    data: RevokeCodeRequest,
  ): Promise<RevokeCodeResponse> {
    const response = await apiClient.post<RevokeCodeResponse>(
      `/admin/activation-codes/${id}/revoke`,
      data,
    );
    return response.data;
  },

  /**
   * Extend activation code expiration
   */
  async extend(
    id: number,
    additional_hours: number,
  ): Promise<{ success: boolean; new_expires_at: string }> {
    const response = await apiClient.post(
      `/admin/activation-codes/${id}/extend`,
      { additional_hours },
    );
    return response.data;
  },

  /**
   * Resend activation email
   */
  async resendEmail(
    id: number,
    custom_message?: string,
  ): Promise<{ success: boolean; email_sent: boolean; code?: string }> {
    const response = await apiClient.post(
      `/admin/activation-codes/${id}/resend-email`,
      { custom_message },
    );
    return response.data;
  },

  /**
   * Get activation audit logs
   */
  async getAuditLogs(
    params?: ListAuditLogsParams,
  ): Promise<ListAuditLogsResponse> {
    const response = await apiClient.get<ListAuditLogsResponse>(
      "/admin/activation-audit",
      { params },
    );
    const data: any = response.data;
    return {
      ...data,
      items: (data.items || []).map(mapAuditLog),
      summary: data.summary || {
        total_events: data.pagination?.total_items || 0,
        successful_events: 0,
        failed_events: 0,
        unique_ips: 0,
        date_range: {
          from: params?.from_date || "",
          to: params?.to_date || "",
        },
      },
    } as ListAuditLogsResponse;
  },

  /**
   * Get activation statistics
   */
  async getStats(): Promise<ActivationStatsResponse> {
    const response = await apiClient.get<ActivationStatsResponse>(
      "/admin/activation-audit/stats",
    );
    return mapStats(response.data);
  },

  /**
   * Get activation attempts for a specific code
   */
  async getAttempts(codeId: number): Promise<ListAuditLogsResponse> {
    const response = await apiClient.get<ListAuditLogsResponse>(
      "/admin/activation-audit",
      {
        params: {
          activation_code_id: codeId,
          limit: 100,
        },
      },
    );
    const data: any = response.data;
    return {
      ...data,
      items: (data.items || []).map(mapAuditLog),
      summary: data.summary || {
        total_events: data.pagination?.total_items || 0,
        successful_events: 0,
        failed_events: 0,
        unique_ips: 0,
        date_range: {
          from: "",
          to: "",
        },
      },
    } as ListAuditLogsResponse;
  },
};
