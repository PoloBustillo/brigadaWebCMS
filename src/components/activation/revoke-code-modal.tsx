"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { useActivationCodeStore } from "@/store/activation-code-store";
import { ActivationCode } from "@/types/activation";
import { AlertTriangle, Loader2 } from "lucide-react";

interface RevokeCodeModalProps {
  isOpen: boolean;
  code: ActivationCode;
  onClose: () => void;
}

export function RevokeCodeModal({
  isOpen,
  code,
  onClose,
}: RevokeCodeModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  const { revokeCode, isLoading } = useActivationCodeStore();

  const handleRevoke = async () => {
    if (!reason.trim()) {
      setError("Escribe un motivo para la revocacion");
      return;
    }

    try {
      await revokeCode(code.id, reason);
      setReason("");
      setError("");
      onClose();
    } catch (error) {
      // Error handled in store
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      setError("");
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Revocar codigo de activacion"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleRevoke}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Revocando...
              </>
            ) : (
              "Revocar codigo"
            )}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {/* Warning */}
        <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-900 dark:text-red-100 mb-1">
              Accion permanente
            </h3>
            <p className="text-sm text-red-800 dark:text-red-200">
              Este codigo quedara revocado. El usuario no podra activarse con
              el.
            </p>
          </div>
        </div>

        {/* Code Information */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h4 className="font-medium text-sm mb-2">Detalles del codigo</h4>
          <div className="space-y-1 text-sm">
            <p>
              <span className="text-muted-foreground">Usuario:</span>{" "}
              <span className="font-medium">
                {code.whitelist.nombre} {code.whitelist.apellido}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Identificador:</span>{" "}
              <span className="font-mono">{code.whitelist.identifier}</span>
            </p>
            <p>
              <span className="text-muted-foreground">Rol:</span>{" "}
              <span className="font-medium">
                {code.whitelist.assigned_role}
              </span>
            </p>
          </div>
        </div>

        {/* Reason Input */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Motivo de revocacion <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
            placeholder="Ej. solicitud del usuario, seguridad, informacion incorrecta..."
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={3}
            disabled={isLoading}
          />
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400 mt-1">
              {error}
            </p>
          )}
        </div>

        {/* Confirmation */}
        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <p className="text-xs text-muted-foreground">
            <strong>Nota:</strong> Puedes generar un nuevo codigo para este
            usuario cuando lo necesites. La revocacion quedara registrada en
            la auditoria.
          </p>
        </div>
      </div>
    </Modal>
  );
}
