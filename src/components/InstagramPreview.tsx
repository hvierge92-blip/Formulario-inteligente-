import React, { useEffect, useRef } from "react";
import { UserProfile } from "../types";
import { Heart, MessageCircle, Send, Bookmark, CheckCircle2, AlertCircle, Info, MoreHorizontal } from "lucide-react";

interface InstagramPreviewProps {
  text: string;
  onChange: (val: string) => void;
  profile: UserProfile;
  topic: string;
  tone: string;
}

export default function InstagramPreview({ text, onChange, profile, topic, tone }: InstagramPreviewProps) {
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
  const isLengthOk = charCount >= 150 && charCount <= 300;

  // Extract hashtags from the text to verify presence
  const hasHashtags = text.includes("#");
  const hashtagCount = (text.match(/#[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ_]+/g) || []).length;

  // Determine gradient color based on post tone
  let gradientClass = "from-indigo-600 to-pink-500";
  let toneBadge = "Cercano";
  if (tone === "profesional") {
    gradientClass = "from-slate-800 to-slate-900";
    toneBadge = "Profesional";
  } else if (tone === "motivacional") {
    gradientClass = "from-amber-500 via-red-500 to-pink-600";
    toneBadge = "Motivacional";
  } else if (tone === "controversial") {
    gradientClass = "from-rose-700 via-purple-700 to-slate-900";
    toneBadge = "Controversial";
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Instagram Post Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden text-black font-sans max-w-md mx-auto w-full">
        {/* Header */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
              referrerPolicy="no-referrer"
            />
            <div>
              <h4 className="font-semibold text-xs leading-none">
                {profile.username || "nombre_usuario"}
              </h4>
              <span className="text-[10px] text-gray-500">Madrid, España</span>
            </div>
          </div>
          <button className="text-gray-700 hover:text-black">
            <MoreHorizontal className="w-5 h-5" />
          </button>
        </div>

        {/* Dynamic Slide Graphic for Carousels */}
        <div className={`aspect-square w-full bg-gradient-to-tr ${gradientClass} p-8 flex flex-col justify-between text-white relative select-none`}>
          <div className="flex items-center justify-between text-[11px] font-bold tracking-widest uppercase opacity-75">
            <span>{toneBadge} Post</span>
            <span className="bg-white/10 px-2 py-0.5 rounded-full backdrop-blur-xs">Slide 1/2</span>
          </div>

          <div className="my-auto space-y-4">
            <h3 className="text-2xl font-extrabold tracking-tight leading-snug drop-shadow-md max-h-[180px] overflow-hidden text-ellipsis">
              {topic ? (topic.length > 80 ? topic.slice(0, 80) + "..." : topic) : "Tu idea estrella"}
            </h3>
            <div className="h-1 w-12 bg-white rounded-full opacity-80" />
            <p className="text-xs text-white/90 leading-relaxed font-light">
              Desliza para leer la estrategia completa y cuéntame tu opinión.
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <div className="flex items-center gap-2">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-6 h-6 rounded-full object-cover border border-white/20"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-semibold">@{profile.username || "usuario"}</span>
            </div>
            <span className="text-[10px] font-semibold tracking-wider opacity-85">PASA DE SLIDE ➡️</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="hover:text-red-500 transition-colors">
              <Heart className="w-6 h-6" />
            </button>
            <button className="hover:text-gray-600 transition-colors">
              <MessageCircle className="w-6 h-6" />
            </button>
            <button className="hover:text-gray-600 transition-colors">
              <Send className="w-6 h-6 -rotate-12" />
            </button>
          </div>
          <button className="hover:text-gray-600 transition-colors">
            <Bookmark className="w-6 h-6" />
          </button>
        </div>

        {/* Likes Count */}
        <div className="px-3 pb-1 text-xs font-semibold">
          Les gusta a 138 personas
        </div>

        {/* Editable Caption */}
        <div className="px-3 pb-4">
          <div className="text-xs text-gray-800 leading-relaxed">
            <span className="font-semibold text-black mr-2">
              {profile.username || "nombre_usuario"}
            </span>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => onChange(e.target.value)}
              className="w-full bg-transparent text-xs text-gray-800 leading-relaxed border-0 outline-hidden focus:ring-0 p-0 resize-none min-h-[60px] placeholder-gray-400 mt-1"
              placeholder="Escribe el pie de foto de Instagram aquí..."
            />
          </div>
          <div className="text-[10px] text-gray-400 uppercase tracking-wider mt-2.5">
            Hace 2 horas
          </div>
        </div>
      </div>

      {/* Copywriting Audit (Instagram) */}
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-slate-300">
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
          <Info className="w-4 h-4 text-pink-400" />
          Análisis de Copywriting (Instagram)
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
                <span>Longitud de descripción (150 - 300 caracteres):</span>
                <span className={`font-mono px-1.5 py-0.5 rounded ${isLengthOk ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400"}`}>
                  {charCount} carac.
                </span>
              </div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {charCount < 150
                  ? "Instagram premia descripciones directas, pero necesitas dar algo de contexto para generar retención."
                  : charCount > 300
                    ? "Los textos demasiado largos se cortan en el feed. Intenta condensar para que el usuario no tenga que pulsar 'más' en exceso."
                    : "Longitud ideal para acompañar un carrusel o publicación visual."}
              </p>
            </div>
          </div>

          {/* Hashtags Check */}
          <div className="flex items-start gap-2.5 pt-2 border-t border-slate-800">
            {hasHashtags && hashtagCount >= 3 ? (
              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            )}
            <div>
              <div className="font-medium">Uso de Hashtags:</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                {hasHashtags
                  ? `Has incluido ${hashtagCount} hashtag(s). Ayudan a categorizar tu nicho en el buscador de Instagram.`
                  : "Considera incluir entre 3 y 5 hashtags seleccionados para maximizar la visibilidad orgánica en Instagram."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
