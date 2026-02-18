"use client";

import { useState } from "react";
import { Survey, SurveyVersion } from "@/types";
import { X, FileText, Calendar, User } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import SurveyVersions from "./survey-versions";
import SurveyPreviewModal from "./survey-preview-modal";

interface SurveyDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  survey: Survey | null;
  onPublish: (versionId: number) => void;
  isPublishing?: boolean;
}

export default function SurveyDetailsModal({
  isOpen,
  onClose,
  survey,
  onPublish,
  isPublishing = false,
}: SurveyDetailsModalProps) {
  const [previewVersion, setPreviewVersion] = useState<SurveyVersion | null>(
    null,
  );

  if (!isOpen || !survey) return null;

  const publishedVersion = survey.versions?.find((v) => v.is_published);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {survey.title}
              </h2>
              {survey.description && (
                <p className="text-gray-600">{survey.description}</p>
              )}
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 ml-4"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Info Cards */}
          <div className="p-6 border-b bg-gray-50">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Estado</p>
                    <p className="font-semibold text-gray-900">
                      {survey.is_active ? "Activa" : "Inactiva"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Versión Publicada</p>
                    <p className="font-semibold text-gray-900">
                      {publishedVersion
                        ? `v${publishedVersion.version_number}`
                        : "Ninguna"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Creada</p>
                    <p className="font-semibold text-gray-900">
                      {format(new Date(survey.created_at), "dd MMM yyyy", {
                        locale: es,
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Versions Content */}
          <div className="flex-1 overflow-y-auto p-6">
            <SurveyVersions
              survey={survey}
              onPublish={onPublish}
              onPreview={setPreviewVersion}
              isPublishing={isPublishing}
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <SurveyPreviewModal
        isOpen={previewVersion !== null}
        onClose={() => setPreviewVersion(null)}
        version={previewVersion}
        surveyTitle={survey.title}
        surveyDescription={survey.description}
      />
    </>
  );
}
