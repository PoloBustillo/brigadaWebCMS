"use client";

import { useRequireAuth } from "@/hooks/use-auth";
import { AdminGuard } from "@/components/auth/admin-guard";
import { Skeleton } from "@/components/ui/skeleton";

export default function UsersPage() {
  const { isChecking } = useRequireAuth();

  if (isChecking) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <AdminGuard>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Usuarios</h1>
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700">
            Crear Usuario
          </button>
        </div>
        <div className="bg-white rounded-lg shadow">
          <p className="p-6 text-gray-600">Lista de usuarios...</p>
        </div>
      </div>
    </AdminGuard>
  );
}
