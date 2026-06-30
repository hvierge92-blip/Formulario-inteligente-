import React, { useEffect, useRef } from "react";
import { UserProfile } from "../types";
import { ThumbsUp, MessageSquare, Repeat2, Send as SendIcon, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface LinkedInPreviewProps {
  text: string;
  onChange: (val: string) => void;
  profile: UserProfile;
}

export default function LinkedInPreview({ text, onChange, profile }: LinkedInPreviewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit text content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const charCount = text.length;
  const isLengthOk = charCount >= 800 && charCount <= 1300;

  // Analizar si hay un gancho inicial (primer párrafo corto seguido de salto de línea)
  const paragraphs = text.split("\n").filter((p) => p.trim().length > 0);
  const firstLine = paragraphs[0] || "";
  const hasHook = firstLine.length > 0 && firstLine.length <= 120 && text.includes("\n");

  // Analizar si está estructurado (buen uso de párrafos y espacios)
  const isStructured = paragraphs.length >= 3;

  return (
    <div className="flex flex-col gap-4">
      {/* LinkedIn Post Box */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden text-[#1d2226] font-sans">
        {/* Header */}
        <div className="p-4 flex items-start gap-3">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-100"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm text-gray-900 leading-tight hover:text-blue-700 hover:underline cursor-pointer">
              {profile.name}
            </h4>
            <p className="text-xs text-gray-500 truncate mt-0.5">{profile.headline || "Consultor Independiente & Emprendedor"}</p>
            <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
              <span>1 h</span>
              <span>•</span>
              <span>Editado</span>
              <span>•</span>
              <span className="text-[10px]">🌐</span>
            </div>
          </div>
        </div>

        {/* Editable Post Content */}
        <div className="px-4 pb-3">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-sm text-gray-800 leading-relaxed border-0 outline-hidden focus:ring-0 p-0 resize-none min-h-[120px] placeholder-gray-400"
            placeholder="Escribe o edita tu post aquí..."
          />
        </div>

        {/* Fictional Reactions Counter */}
        <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center -space-x-1">
              <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white border border-white">👍</span>
              <span className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center text-[10px] text-white border border-white">👏</span>
              <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white border border-white">❤️</span>
            </span>
            <span className="hover:text-blue-600 hover:underline cursor-pointer">Tú y otras 47 personas</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hover:text-blue-600 hover:underline cursor-pointer">12 comentarios</span>
            <span>•</span>
            <span className="hover:text-blue-600 hover:underline cursor-pointer">3 veces compartido</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-2 py-1 bg-gray-50 border-t border-gray-100 grid grid-cols-4 gap-1">
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-md text-gray-600 font-medium text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <ThumbsUp className="w-4 h-4" />
            <span className="hidden sm:inline">Recomendar</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-md text-gray-600 font-medium text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Comentar</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-md text-gray-600 font-medium text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <Repeat2 className="w-4 h-4" />
            <span className="hidden sm:inline">Compartir</span>
          </button>
          <button className="flex items-center justify-center gap-2 py-2.5 rounded-md text-gray-600 font-medium text-xs hover:bg-gray-100 active:bg-gray-200 transition-colors">
            <SendIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Enviar</span>
          </button>
        </div>
      </div>

      {/* Audit Panel for Copywriting Insights */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-slate-300">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-indigo-400" />
          Análisis de Copywriting (LinkedIn)
        </h5>
        
        <div className="space-y-3 text-xs">
          {/* Character Limits Check */}
          <div className="flex items-start gap-2.5">
            {isLengthOk ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex justify-between items-center gap-2 font-medium">
                <span>Longitud sugerida (800 - 1300 caracteres):</span>
                <span className={`font-mono px-1.5 py-0.5 rounded ${isLengthOk ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {charCount} carac.
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {charCount < 800 
                  ? "Te recomendamos ampliar el desarrollo para dar valor suficiente." 
                  : charCount > 1300 
                    ? "Los posts demasiado largos reducen el ratio de lectura. Intenta recortar algo." 
                    : "Longitud óptima para profundizar sin aburrir al lector."}
              </p>
            </div>
          </div>

          {/* Hook Check */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
            {hasHook ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-medium">Gancho de primera línea:</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {hasHook 
                  ? "¡Excelente! Primera frase directa y corta con espacio posterior. Ideal para enganchar al usuario en el botón 'ver más'." 
                  : "Asegúrate de que la primera línea sea un gancho potente de menos de 100 caracteres seguido de un salto de línea."}
              </p>
            </div>
          </div>

          {/* Structure Check */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
            {isStructured ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-medium">Legibilidad y Estructura:</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {isStructured 
                  ? "Buen uso de saltos de línea y párrafos. Evita la fatiga visual del lector móvil." 
                  : "Introduce más saltos de línea para estructurar las ideas. Los párrafos largos reducen drásticamente la retención."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
