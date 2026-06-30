import React, { useEffect, useRef } from "react";
import { UserProfile } from "../types";
import { MessageCircle, Repeat2, Heart, BarChart2, Share, CheckCircle2, AlertCircle, Info } from "lucide-react";

interface TwitterPreviewProps {
  text: string;
  onChange: (val: string) => void;
  profile: UserProfile;
}

export default function TwitterPreview({ text, onChange, profile }: TwitterPreviewProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea to fit content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [text]);

  const charCount = text.length;
  const charsLeft = 280 - charCount;
  const isOverLimit = charCount > 280;
  
  // Calculate SVG circular progress values
  const radius = 10;
  const circumference = 2 * Math.PI * radius;
  const percentage = Math.min((charCount / 280) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col gap-4">
      {/* X (Twitter) Post Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden text-[#0f1419] font-sans max-w-md mx-auto w-full p-4">
        {/* Author Header */}
        <div className="flex items-start gap-3">
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            className="w-10 h-10 rounded-full object-cover border border-gray-100"
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-gray-900 truncate hover:underline cursor-pointer">
                {profile.name}
              </span>
              <span className="text-[11px] text-blue-500">⚡</span> {/* Verification badge simulation */}
              <span className="text-xs text-gray-500 truncate font-normal">
                @{profile.username || "nombre_usuario"}
              </span>
              <span className="text-xs text-gray-400">•</span>
              <span className="text-xs text-gray-400 hover:underline cursor-pointer">5m</span>
            </div>

            {/* Editable Content */}
            <div className="mt-1">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => onChange(e.target.value)}
                className="w-full bg-transparent text-sm text-gray-900 leading-normal border-0 outline-hidden focus:ring-0 p-0 resize-none min-h-[80px] placeholder-gray-400"
                placeholder="¿Qué está pasando?"
                maxLength={400} // Allow typing a bit over to show error state
              />
            </div>

            {/* Bottom Actions and Circle Counter Row */}
            <div className="mt-3 flex items-center justify-between text-gray-500 border-t border-gray-100 pt-3">
              <div className="flex items-center gap-4 sm:gap-6">
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer group">
                  <span className="p-1.5 rounded-full group-hover:bg-blue-50">
                    <MessageCircle className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-normal">14</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-green-500 transition-colors cursor-pointer group">
                  <span className="p-1.5 rounded-full group-hover:bg-green-50">
                    <Repeat2 className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-normal">5</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-pink-500 transition-colors cursor-pointer group">
                  <span className="p-1.5 rounded-full group-hover:bg-pink-50">
                    <Heart className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-normal">84</span>
                </button>
                <button className="flex items-center gap-1.5 hover:text-blue-500 transition-colors cursor-pointer group">
                  <span className="p-1.5 rounded-full group-hover:bg-blue-50">
                    <BarChart2 className="w-4 h-4" />
                  </span>
                  <span className="text-xs font-normal">2.4k</span>
                </button>
                <button className="hover:text-blue-500 transition-colors cursor-pointer p-1.5 rounded-full hover:bg-blue-50">
                  <Share className="w-4 h-4" />
                </button>
              </div>

              {/* High-Fidelity Circular Character Counter */}
              <div className="flex items-center gap-2">
                {charCount > 0 && (
                  <div className="relative w-7 h-7 flex items-center justify-center">
                    <svg className="w-6 h-6 -rotate-90">
                      {/* Gray Background Circle */}
                      <circle
                        cx="12"
                        cy="12"
                        r={radius}
                        className="stroke-gray-100 fill-none"
                        strokeWidth="2"
                      />
                      {/* Active Progress Circle */}
                      <circle
                        cx="12"
                        cy="12"
                        r={radius}
                        className={`fill-none transition-all duration-300 ${
                          isOverLimit
                            ? "stroke-red-500"
                            : charsLeft <= 20
                            ? "stroke-amber-500"
                            : "stroke-blue-500"
                        }`}
                        strokeWidth="2"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                      />
                    </svg>
                    {/* Character numbers when running out */}
                    {charsLeft <= 20 && (
                      <span className={`absolute text-[9px] font-bold ${isOverLimit ? "text-red-500" : "text-amber-500"}`}>
                        {charsLeft}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copywriting Audit (X) */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-slate-300">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-sky-400" />
          Análisis de Copywriting (X / Twitter)
        </h5>

        <div className="space-y-3 text-xs">
          {/* Character Limits Check */}
          <div className="flex items-start gap-2.5">
            {!isOverLimit ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="flex justify-between items-center gap-2 font-medium">
                <span>Límite de caracteres (Máximo 280):</span>
                <span className={`font-mono px-1.5 py-0.5 rounded ${!isOverLimit ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {charCount} / 280
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {isOverLimit
                  ? `Has superado el límite estricto por ${charCount - 280} caracteres. Edita tu post para acortarlo o divídelo en un hilo.`
                  : charsLeft <= 30
                    ? `Te quedan solo ${charsLeft} caracteres. Aprovechas el espacio al máximo de forma concisa.`
                    : "Post dentro del límite válido para publicarse en X."}
              </p>
            </div>
          </div>

          {/* Punchy Check */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
            {charCount < 220 ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-medium">Impacto y Síntesis:</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {charCount < 220
                  ? "Excelente brevedad. Los tweets más cortos e impactantes suelen recibir hasta un 17% más de engagement."
                  : "Estás cerca del límite. Revisa si puedes simplificar alguna frase para ganar fuerza conceptual."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
