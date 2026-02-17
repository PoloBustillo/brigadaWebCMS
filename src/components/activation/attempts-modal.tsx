"use client";

import { useEffect } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableEmpty,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useActivationCodeStore } from "@/store/activation-code-store";
import { ActivationCode } from "@/types/activation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Shield,
  Clock,
} from "lucide-react";
import { format } from "date-fns";

interface AttemptsModalProps {
  isOpen: boolean;
  code: ActivationCode;
  onClose: () => void;
}

const eventTypeLabels: Record<string, string> = {
  code_generated: "Generado",
  code_extended: "Extendido",
  code_validation_attempt: "Validacion",
  code_validation_success: "Validado",
  activation_attempt: "Intento de activacion",
  activation_success: "Activacion exitosa",
  activation_failed: "Activacion fallida",
  code_revoked: "Revocado",
  email_sent: "Email enviado",
  email_resent: "Email reenviado",
  code_expired: "Expirado",
  code_locked: "Bloqueado",
  rate_limit_exceeded: "Limite excedido",
};

export function AttemptsModal({ isOpen, code, onClose }: AttemptsModalProps) {
  const { auditLogs, isLoading, fetchCodeAttempts } = useActivationCodeStore();

  useEffect(() => {
    if (isOpen) {
      fetchCodeAttempts(code.id);
    }
  }, [isOpen, code.id, fetchCodeAttempts]);

  const getEventIcon = (eventType: string, success: boolean) => {
    if (success) {
      return (
        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
      );
    }
    if (eventType === "code_revoked" || eventType === "code_locked") {
      return <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
    if (eventType === "activation_failed") {
      return <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />;
    }
    if (eventType === "code_validation_attempt" || eventType === "activation_attempt") {
      return <Clock className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />;
    }
    return (
      <AlertTriangle className="w-4 h-4 text-orange-600 dark:text-orange-400" />
    );
  };

  const getEventBadgeClasses = (eventType: string, success: boolean) => {
    if (success) {
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    }
    if (
      eventType === "code_revoked" ||
      eventType === "code_locked" ||
      eventType === "activation_failed"
    ) {
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    }
    if (eventType === "code_validation_attempt" || eventType === "activation_attempt") {
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    }
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Intentos y auditoria"
      size="xl"
      footer={<Button onClick={onClose}>Cerrar</Button>}
    >
      <div className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-xs text-muted-foreground mb-1">Eventos totales</p>
            <p className="text-2xl font-bold">{auditLogs.length}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900/10 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-xs text-muted-foreground mb-1">
              Intentos fallidos
            </p>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {code.failed_attempts} / {code.max_attempts}
            </p>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-xs text-muted-foreground mb-1">Estado del codigo</p>
            <p className="text-sm font-semibold capitalize mt-1">
              {code.status}
            </p>
          </div>
        </div>

        {/* Warning if locked or near limit */}
        {code.failed_attempts >= code.max_attempts - 1 && (
          <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-semibold text-red-900 dark:text-red-100 mb-1">
                {code.status === "locked" ? "Codigo bloqueado" : "Riesgo alto"}
              </h4>
              <p className="text-sm text-red-800 dark:text-red-200">
                  {code.status === "locked"
                    ? "Este codigo fue bloqueado por demasiados intentos fallidos."
                    : "Este codigo esta cerca del limite de intentos fallidos."}
              </p>
            </div>
          </div>
        )}

        {/* Audit Log Table */}
        <div>
          <h4 className="text-sm font-semibold mb-2">Auditoria</h4>
          {isLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          ) : auditLogs.length === 0 ? (
            <Table>
              <TableBody>
                <TableEmpty
                  message="Sin eventos registrados"
                  description="Los eventos apareceran aqui cuando ocurran"
                />
              </TableBody>
            </Table>
          ) : (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Evento</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>IP</TableHead>
                    <TableHead>Detalle</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventIcon(log.event_type, log.success)}
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getEventBadgeClasses(log.event_type, log.success)}`}
                          >
                            {eventTypeLabels[log.event_type] || log.event_type}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {format(new Date(log.created_at), "PPp")}
                        </div>
                      </TableCell>
                      <TableCell>
                        {log.ip_address ? (
                          <code className="text-xs font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                            {log.ip_address}
                          </code>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {log.failure_reason ? (
                          <div className="text-xs text-red-600 dark:text-red-400">
                            {log.failure_reason}
                          </div>
                        ) : log.request_metadata ? (
                          <div className="text-xs text-muted-foreground">
                            {JSON.stringify(log.request_metadata, null, 2).slice(0, 50)}
                            {JSON.stringify(log.request_metadata).length > 50 && "..."}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">
                            Sin detalles
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
