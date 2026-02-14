"use client";

import { useRole } from "@/hooks/use-role";
import { EmptyState } from "@/components/ui/empty-state";
import { UserRole } from "@/types";

interface AdminGuardProps {
  children: React.ReactNode;
  /**
   * Optional custom fallback to show when user doesn't have permission
   */
  fallback?: React.ReactNode;
  /**
   * Roles allowed to access the content. Defaults to ['admin']
   */
  allowedRoles?: UserRole[];
}

/**
 * Component to guard content that requires specific roles
 * Shows access denied message if user doesn't have required role
 *
 * @example
 * // Admin only
 * <AdminGuard>
 *   <AdminOnlyContent />
 * </AdminGuard>
 *
 * @example
 * // Admin or Encargado
 * <AdminGuard allowedRoles={['admin', 'encargado']}>
 *   <SupervisorContent />
 * </AdminGuard>
 *
 * @example
 * // Custom fallback
 * <AdminGuard fallback={<CustomAccessDenied />}>
 *   <ProtectedContent />
 * </AdminGuard>
 */
export function AdminGuard({
  children,
  fallback,
  allowedRoles = ["admin"],
}: AdminGuardProps) {
  const { hasRole, role } = useRole(allowedRoles);

  if (!hasRole) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex items-center justify-center min-h-[400px] p-8">
        <div className="max-w-md w-full">
          <EmptyState
            type="no-access"
            title="Acceso Denegado"
            description={`Esta página requiere permisos de ${allowedRoles.join(" o ")}.${role ? ` Tu rol actual es: ${role}` : ""}`}
          />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
