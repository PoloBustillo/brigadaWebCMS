"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  HelpCircle,
  Mail,
  MessageSquare,
  BookOpen,
  Github,
  Bug,
} from "lucide-react";

interface IssueForm {
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  email: string;
}

export default function HelpPage() {
  const [activeTab, setActiveTab] = useState<"faq" | "report" | "docs">("faq");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState<IssueForm>({
    title: "",
    description: "",
    severity: "medium",
    email: "",
  });

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      // TODO: Implement actual API call to submit issue
      // await issueService.submitIssue(formData);
      setTimeout(() => {
        setSubmitSuccess(true);
        setFormData({
          title: "",
          description: "",
          severity: "medium",
          email: "",
        });
        setIsSubmitting(false);
        setTimeout(() => setSubmitSuccess(false), 5000);
      }, 500);
    } catch {
      alert("Error al enviar el reporte. Por favor intenta de nuevo.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Ayuda y Soporte
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Encuentra respuestas a preguntas comunes, reporta problemas y accede a
          documentación
        </p>
      </div>

      {/* Tabs Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex gap-6">
          <button
            onClick={() => setActiveTab("faq")}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === "faq"
                ? "border-primary-600 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4" />
              Preguntas Frecuentes
            </div>
          </button>
          <button
            onClick={() => setActiveTab("report")}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === "report"
                ? "border-primary-600 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <Bug className="w-4 h-4" />
              Reportar Problema
            </div>
          </button>
          <button
            onClick={() => setActiveTab("docs")}
            className={`pb-3 px-1 border-b-2 font-medium transition-colors ${
              activeTab === "docs"
                ? "border-primary-600 text-primary-600 dark:text-primary-400"
                : "border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300"
            }`}
          >
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Documentación
            </div>
          </button>
        </div>
      </div>

      {/* FAQ Tab */}
      {activeTab === "faq" && (
        <div className="space-y-4 max-w-3xl">
          {[
            {
              q: "¿Cómo creo un nuevo usuario?",
              a: "Ve a la sección de Usuarios > Invitaciones. Busca al usuario en la whitelist o crea una nueva invitación. El sistema generará un código de activación que el usuario puede usar para completar su registro.",
            },
            {
              q: "¿Qué hago si un usuario olvida su contraseña?",
              a: "Ve a Usuarios > Usuarios y busca al usuario. Haz clic en el perfil del usuario y selecciona 'Restablecer contraseña'. Se generará una contraseña temporal que puedes compartir con el usuario.",
            },
            {
              q: "¿Cómo interpreto los reportes?",
              a: "Los reportes muestran estadísticas de respuestas de encuestas. Puedes filtrar por período de tiempo, tipo de encuesta y estado. Los gráficos visualizan tendencias y patrones en los datos.",
            },
            {
              q: "¿Cuál es la diferencia entre roles?",
              a: "Admin: Control total del sistema. Encargado: Puede crear encuestas y asignaciones. Brigadista: Solo puede responder encuestas y ver sus asignaciones.",
            },
            {
              q: "¿Cómo restablezco mis cambios no guardados?",
              a: "Si sales de una página sin guardar, los cambios se perderán. Asegúrate de hacer clic en 'Guardar' antes de salir de cualquier formulario.",
            },
          ].map((item, index) => (
            <Card key={index} className="p-6">
              <div className="flex gap-4">
                <HelpCircle className="w-5 h-5 text-primary-600 dark:text-primary-400 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {item.q}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{item.a}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Report Issue Tab */}
      {activeTab === "report" && (
        <div className="max-w-3xl">
          {submitSuccess && (
            <div className="mb-6 flex items-center gap-3 rounded-lg bg-green-50 dark:bg-green-900/20 p-4 border border-green-200 dark:border-green-800">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <p className="text-green-800 dark:text-green-200">
                Tu reporte ha sido enviado exitosamente. Nuestro equipo lo
                revisará pronto.
              </p>
            </div>
          )}

          <Card className="p-6 mb-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Por favor, describe el problema de manera clara y detallada.
                  Incluye pasos para reproducirlo si es posible.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitIssue} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tu Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  placeholder="tu@email.com"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Título del problema
                </label>
                <Input
                  name="title"
                  value={formData.title}
                  onChange={handleFormChange}
                  placeholder="Ej: No puedo crear una nueva encuesta"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Severidad
                </label>
                <select
                  name="severity"
                  value={formData.severity}
                  onChange={handleFormChange}
                  disabled={isSubmitting}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="low">Baja - Inconveniente menor</option>
                  <option value="medium">Media - Funcionalidad afectada</option>
                  <option value="high">
                    Alta - Característica no funciona
                  </option>
                  <option value="critical">Crítica - Sistema inusable</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descripción del problema
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  placeholder="Describe qué sucedió, qué esperabas que sucediera, y pasos para reproducir el problema..."
                  required
                  disabled={isSubmitting}
                  rows={6}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {isSubmitting ? "Enviando..." : "Enviar Reporte"}
              </Button>
            </form>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border border-primary-200 dark:border-primary-800">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
              Información de contacto
            </h3>
            <div className="space-y-3 text-sm text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>soporte@brigada.example.com</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>Tiempo de respuesta: 24-48 horas</span>
              </div>
              <div className="flex items-center gap-3">
                <Github className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                <span>
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-primary-600 dark:text-primary-400"
                  >
                    Ver Issues en GitHub
                  </a>
                </span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === "docs" && (
        <div className="space-y-6 max-w-3xl">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              📚 Documentación General
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Accede a la documentación completa del sistema Brigada CMS.
            </p>
            <a
              href="/docs"
              className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 hover:underline"
            >
              <BookOpen className="w-4 h-4" />
              Ir a Documentación
            </a>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🎯 Primeros Pasos
            </h3>
            <ul className="space-y-3 text-gray-600 dark:text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 font-semibold mt-0.5">
                  1.
                </span>
                <span>
                  <strong>Crear una Encuesta:</strong> Ve a Encuestas &gt; Nueva
                  Encuesta
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 font-semibold mt-0.5">
                  2.
                </span>
                <span>
                  <strong>Invitar Usuarios:</strong> Ve a Usuarios &gt;
                  Invitaciones y genera códigos de activación
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 font-semibold mt-0.5">
                  3.
                </span>
                <span>
                  <strong>Crear Asignaciones:</strong> Ve a Asignaciones para
                  asignar encuestas a brigadistas
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary-600 dark:text-primary-400 font-semibold mt-0.5">
                  4.
                </span>
                <span>
                  <strong>Ver Reportes:</strong> Ve a Reportes para ver
                  estadísticas y análisis de respuestas
                </span>
              </li>
            </ul>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🔐 Información de Seguridad
            </h3>
            <div className="space-y-3 text-gray-600 dark:text-gray-400 text-sm">
              <p>
                <strong>Autorización:</strong> El sistema utiliza JWT (JSON Web
                Tokens) para autenticar usuarios.
              </p>
              <p>
                <strong>Contraseñas:</strong> Las contraseñas se almacenan de
                forma segura usando hash bcrypt.
              </p>
              <p>
                <strong>Roles:</strong> Los permisos se basan en roles de
                usuario. Cada rol tiene acceso limitado según su nivel.
              </p>
              <p>
                <strong>HTTPS:</strong> Todas las comunicaciones se realizan a
                través de conexiones encriptadas.
              </p>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              💡 Tips y Trucos
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-400 text-sm">
              <li>
                • Usa el atajo Cmd+K (Mac) o Ctrl+K (Windows) para búsqueda
                rápida
              </li>
              <li>• Puedes generar múltiples códigos de invitación a la vez</li>
              <li>• Los reportes se pueden exportar en formato CSV</li>
              <li>
                • Usa temas oscuros para reducir fatiga visual en sesiones
                largas
              </li>
            </ul>
          </Card>

          <Card className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-green-900 dark:text-green-200 mb-3">
              ✨ Novedades
            </h3>
            <p className="text-green-800 dark:text-green-300 mb-2">
              <strong>Versión 1.0.0:</strong> Lanzamiento inicial del Brigada
              CMS
            </p>
            <p className="text-green-700 dark:text-green-400 text-sm">
              Características: Gestión de usuarios, Encuestas, Asignaciones,
              Reportes y Sistema de Invitaciones
            </p>
          </Card>
        </div>
      )}
    </div>
  );
}
