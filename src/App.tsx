import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  History, 
  User, 
  PenSquare, 
  Flame, 
  Plus, 
  HelpCircle, 
  Share2, 
  Trash2, 
  AlertTriangle,
  FileText,
  Info,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from "lucide-react";
import { Platform, Tone, UserProfile, GeneratedPost, PLATFORMS, TONES, PRESET_AVATARS } from "./types";
import LinkedInPreview from "./components/LinkedInPreview";
import InstagramPreview from "./components/InstagramPreview";
import TwitterPreview from "./components/TwitterPreview";

// Mock copywriter loading quotes to rotate during generation
const LOADING_QUOTES = [
  "Analizando la psicología del público objetivo...",
  "Redactando un gancho inicial magnético...",
  "Estructurando párrafos cortos para facilitar la lectura móvil...",
  "Eliminando paja corporativa y rodeos innecesarios...",
  "Ajustando el tono para maximizar la conversión...",
  "Insertando llamados a la acción (CTA) persuasivos...",
  "Optimizando hashtags y distribución de emojis...",
  "Generando dos variantes estratégicamente diferenciadas..."
];

export default function App() {
  // --- STATE ---
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState<Platform>("linkedin");
  const [tone, setTone] = useState<Tone>("profesional");
  const [includeEmojis, setIncludeEmojis] = useState(true);
  const [includeHashtags, setIncludeHashtags] = useState(true);
  
  // Loading & Generation Status
  const [isLoading, setIsLoading] = useState(false);
  const [loadingQuoteIndex, setLoadingQuoteIndex] = useState(0);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Active variants
  const [variant1, setVariant1] = useState("");
  const [variant2, setVariant2] = useState("");
  const [selectedVariant, setSelectedVariant] = useState<1 | 2>(1);

  // Custom User Profile for simulated preview
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("copywriter_profile");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: "Álvaro M. Ruiz",
      username: "alvarom_copy",
      headline: "Consultor de Personal Branding & Copywriting Estratégico | Atrae clientes de alto valor",
      avatarUrl: PRESET_AVATARS[0].url
    };
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Saved History (max 10)
  const [history, setHistory] = useState<GeneratedPost[]>(() => {
    const saved = localStorage.getItem("post_generator_history");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [];
  });

  // UI States
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);

  // --- PERSISTENCE EFFECT ---
  useEffect(() => {
    localStorage.setItem("copywriter_profile", JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem("post_generator_history", JSON.stringify(history));
  }, [history]);

  // Loading quote rotator
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingQuoteIndex((prev) => (prev + 1) % LOADING_QUOTES.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Pre-load default template on first boot so right side is beautiful
  useEffect(() => {
    if (!variant1 && !variant2) {
      // Set default pre-loaded starter copywriting variants
      setVariant1(
        `¿El mayor error que cometen los freelancers? Querer solucionarle la vida a todo el mundo. ❌\n\nCuando dices que haces "marketing digital" o "diseño web" en general, compites contra 50.000 personas en plataformas cobrando 10$/hora. Estás en una carrera hacia el abismo financiero.\n\nEl verdadero secreto para cobrar tickets altos es la ultra-especialización. 🎯\n\nNo seas "diseñador web".\nSé "el especialista en embudos de venta para clínicas dentales estéticas".\n\n¿Qué consigues con esto?\n1. Desaparece la competencia: Ya no te comparan por precio, sino por idoneidad.\n2. Multiplicas tu tarifa: Un generalista es un gasto; un especialista es una solución médica de negocio.\n3. Te vuelves un imán de clientes: Las clínicas dentales estéticas se recomendarán entre ellas tu contacto.\n\nLa especialización no reduce tus oportunidades; multiplica tu valor y define tu posicionamiento.\n\n¿Cuál es tu nicho o qué te impide elegir uno? Te leo en comentarios. 👇\n\n#MarcaPersonal #Freelance #Posicionamiento #Negocios #Copywriting`
      );
      setVariant2(
        `Si eres freelance y cobras por horas, estás vendiendo tu libertad en cómodos plazos. ⏳\n\nLa tarifa por horas tiene un techo insalvable: el día solo tiene 24 horas. Si quieres ganar más, tienes que trabajar más. Eso no es un negocio, es un autoempleo mal pagado.\n\nLa solución es el Cobro por Valor (Value-Based Pricing). 💰\n\nNo cobres por el tiempo que tardas en diseñar un logotipo. Cobra por el impacto que ese logotipo tendrá en las ventas de la empresa durante los próximos 5 años.\n\nCambia tu chip mental:\n- De: "Tardo 10 horas, cobro 50€/hora = 500€"\n- A: "Este rediseño de marca aumentará tu conversión un 15%, lo que equivale a unos 10.000€ extras este trimestre. Mi tarifa es de 2.000€".\n\nEl cliente paga feliz porque entiende el retorno de inversión (ROI), y tú dejas de cronometrar tu vida.\n\n¿Sigues cobrando por horas o has dado el paso al cobro por valor? Cuéntame tu experiencia. 💬\n\n#Freelancers #Emprendimiento #Estrategia #Ventas #Productividad`
      );
      setTopic("Por qué la especialización y el cobro por valor son obligatorios para freelancers");
    }
  }, []);

  // Show visual temporary alerts
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // --- ACTIONS ---

  // Generate Post
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!topic.trim()) {
      showToast("Por favor, introduce una idea para el post.");
      return;
    }

    setIsLoading(true);
    setErrorMsg(null);
    setLoadingQuoteIndex(0);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic: topic.trim(),
          platform,
          tone,
          includeEmojis,
          includeHashtags,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Algo salió mal.");
      }

      setVariant1(data.variants[0]);
      setVariant2(data.variants[1]);
      setSelectedVariant(1);

      // Create a history record
      const newRecord: GeneratedPost = {
        id: Date.now().toString(),
        topic: topic.trim(),
        platform,
        tone,
        includeEmojis,
        includeHashtags,
        variant1: data.variants[0],
        variant2: data.variants[1],
        createdAt: new Date().toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit"
        })
      };

      setHistory((prev) => {
        const filtered = prev.filter(p => p.topic.toLowerCase() !== topic.trim().toLowerCase());
        return [newRecord, ...filtered].slice(0, 10);
      });

      showToast("¡Posts generados con éxito!");
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  // Copy active text to Clipboard
  const handleCopy = () => {
    const textToCopy = selectedVariant === 1 ? variant1 : variant2;
    navigator.clipboard.writeText(textToCopy);
    showToast("📋 ¡Copiado al portapapeles con éxito!");
  };

  // Quick preset topic applicator
  const applyPresetTopic = (idea: string) => {
    setTopic(idea);
    showToast("💡 Idea preestablecida aplicada");
  };

  // Load a historical post
  const handleLoadHistory = (record: GeneratedPost) => {
    setTopic(record.topic);
    setPlatform(record.platform);
    setTone(record.tone);
    setIncludeEmojis(record.includeEmojis);
    setIncludeHashtags(record.includeHashtags);
    setVariant1(record.variant1);
    setVariant2(record.variant2);
    setSelectedVariant(1);
    showToast("📁 Registro del historial cargado");
  };

  // Remove history record
  const handleRemoveHistory = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setHistory((prev) => prev.filter(item => item.id !== id));
    showToast("🗑️ Registro eliminado");
  };

  // Clear all history
  const handleClearHistory = () => {
    setHistory([]);
    showToast("🧹 Historial vaciado");
  };

  // Active editable text updates
  const handleTextChange = (newVal: string) => {
    if (selectedVariant === 1) {
      setVariant1(newVal);
    } else {
      setVariant2(newVal);
    }
  };

  const activeText = selectedVariant === 1 ? variant1 : variant2;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col font-sans antialiased relative selection:bg-indigo-500/30 selection:text-white">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-indigo-600 text-white font-medium text-xs sm:text-sm px-5 py-3 rounded-full shadow-2xl border border-indigo-400 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-30 px-4 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg shadow-indigo-600/20">
              <span className="font-display">R</span>
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold tracking-tight font-display text-white">
                Redacta<span className="text-indigo-400 font-extrabold">RRSS</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-medium">Asistente de Copywriting & Marca Personal</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Profile Customize Button */}
            <button
              id="profile-custom-btn"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all cursor-pointer ${
                isEditingProfile 
                  ? "bg-slate-800 border-slate-700 text-white" 
                  : "bg-slate-900/40 border-slate-800 hover:border-slate-750 text-slate-300"
              }`}
            >
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">Personalizar Perfil</span>
              <span className="sm:hidden">Perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:py-8 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:items-start">
        
        {/* LEFT COLUMN: Input form & Profile config (5 cols on lg) */}
        <section className="lg:col-span-5 flex flex-col gap-6">

          {/* Inline Profile Configuration Panel */}
          {isEditingProfile && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-xl animate-fadeIn">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-indigo-400" />
                  Personalizar Perfil de Vista Previa
                </h3>
                <button 
                  onClick={() => setIsEditingProfile(false)}
                  className="text-slate-400 hover:text-slate-200 text-xs font-medium"
                >
                  Cerrar
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Nombre Completo</label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    placeholder="Ej. Álvaro M. Ruiz"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Usuario (@handle)</label>
                    <input
                      type="text"
                      value={profile.username}
                      onChange={(e) => setProfile({ ...profile, username: e.target.value.replace("@", "") })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                      placeholder="Ej. alvarom_copy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Cargo o Titular (LinkedIn)</label>
                    <input
                      type="text"
                      value={profile.headline}
                      onChange={(e) => setProfile({ ...profile, headline: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                      placeholder="Ej. Copywriter & Consultor"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">Elegir Foto de Perfil (Avatar Preset)</label>
                  <div className="grid grid-cols-4 gap-2.5">
                    {PRESET_AVATARS.map((av) => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => setProfile({ ...profile, avatarUrl: av.url })}
                        className={`relative rounded-lg overflow-hidden border-2 aspect-square transition-all ${
                          profile.avatarUrl === av.url ? "border-indigo-500 scale-95" : "border-transparent opacity-60 hover:opacity-100"
                        }`}
                      >
                        <img src={av.url} alt={av.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        <span className="absolute bottom-0 left-0 right-0 bg-black/70 text-[8px] text-center text-white py-0.5 font-medium truncate">{av.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">O URL de imagen personalizada</label>
                  <input
                    type="text"
                    value={profile.avatarUrl}
                    onChange={(e) => setProfile({ ...profile, avatarUrl: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Main Request Form */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-xl">
            <h2 className="text-xs font-bold tracking-widest text-slate-400 uppercase mb-4 flex items-center gap-2">
              <PenSquare className="w-4 h-4 text-indigo-400" />
              Diseña tu Publicación
            </h2>

            <form onSubmit={handleGenerate} className="space-y-5">
              
              {/* Post Idea/Topic Textarea */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="topic-input" className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Idea o Tema <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">{topic.length} carac.</span>
                </div>
                <textarea
                  id="topic-input"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none leading-relaxed text-slate-200"
                  placeholder="Escribe sobre la importancia de la salud mental en el emprendimiento o tu idea de post..."
                />
              </div>

              {/* Inspiration Starter Suggestions */}
              <div>
                <span className="block text-[10px] font-medium text-slate-500 uppercase tracking-widest mb-1.5">Ideas Rápidas de Copywriting:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    "Por qué madrugar está sobrevalorado para ser productivo",
                    "5 aprendizajes tras facturar 10K/mes como freelance",
                    "El mito de trabajar 80h semanales para tener éxito",
                    "Por qué delegar tareas mecánicas te hará más rico"
                  ].map((idea, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => applyPresetTopic(idea)}
                      className="text-[10px] bg-slate-800 hover:bg-slate-700 border border-slate-750 text-slate-300 px-2 py-1.5 rounded-md transition-colors text-left truncate max-w-[280px] cursor-pointer"
                    >
                      💡 {idea}
                    </button>
                  ))}
                </div>
              </div>

              {/* Selector de Red Social */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Red Social</label>
                <div className="grid grid-cols-3 gap-2">
                  {PLATFORMS.map((plat) => {
                    const isSelected = platform === plat.id;
                    return (
                      <button
                        key={plat.id}
                        type="button"
                        onClick={() => setPlatform(plat.id)}
                        className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-950/20 border-indigo-600 text-white"
                            : "bg-slate-800 border-slate-700 opacity-60 hover:opacity-100 text-slate-300"
                        }`}
                      >
                        <span className="text-xs font-bold">{plat.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selector de Tono */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-400 uppercase tracking-wider block">Tono</label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => {
                    const isSelected = tone === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTone(t.id)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-600 text-white"
                            : "bg-slate-800 border border-slate-700 text-slate-300 hover:border-slate-600"
                        }`}
                        title={t.desc}
                      >
                        {t.emoji} {t.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles Extra */}
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Incluir Emojis en el Post</span>
                  <button
                    type="button"
                    onClick={() => setIncludeEmojis(!includeEmojis)}
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${includeEmojis ? "bg-indigo-600" : "bg-slate-800"}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${includeEmojis ? "right-1" : "left-1"}`} />
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-slate-300">Incluir Hashtags recomendados</span>
                  <button
                    type="button"
                    onClick={() => setIncludeHashtags(!includeHashtags)}
                    className={`w-10 h-5 rounded-full relative transition-colors cursor-pointer ${includeHashtags ? "bg-indigo-600" : "bg-slate-800"}`}
                  >
                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${includeHashtags ? "right-1" : "left-1"}`} />
                  </button>
                </div>
              </div>

              {/* Botón de Generar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all mt-4 cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Redactando variantes...</span>
                  </div>
                ) : (
                  "GENERAR POSTS"
                )}
              </button>
            </form>
          </div>

          {/* History Panel (Latest 10) */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 shadow-xl">
            <button
              onClick={() => setIsHistoryExpanded(!isHistoryExpanded)}
              className="w-full flex items-center justify-between text-slate-300 hover:text-white"
            >
              <h3 className="text-xs font-medium text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <History className="w-4 h-4 text-indigo-400" />
                Historial Reciente ({history.length})
              </h3>
              {isHistoryExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isHistoryExpanded && (
              <div className="mt-4 pt-3 border-t border-slate-800 max-h-[300px] overflow-y-auto space-y-2 pr-1">
                {history.length === 0 ? (
                  <p className="text-xs text-slate-500 text-center py-4">Ningún post generado recientemente en este navegador.</p>
                ) : (
                  <>
                    {history.map((record) => {
                      const pf = PLATFORMS.find(p => p.id === record.platform);
                      return (
                        <div
                          key={record.id}
                          onClick={() => handleLoadHistory(record)}
                          className="p-2.5 rounded-lg bg-slate-950/40 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all group relative"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold text-white uppercase bg-slate-800">
                              {record.platform}
                            </span>
                            <span className="text-[9px] text-slate-500">{record.createdAt}</span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium line-clamp-2 pr-6">
                            {record.topic}
                          </p>
                          <button
                            onClick={(e) => handleRemoveHistory(record.id, e)}
                            className="absolute right-2 bottom-2 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Eliminar de historial"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}
                    <button
                      onClick={handleClearHistory}
                      className="w-full text-center text-xs text-slate-500 hover:text-red-400 mt-2 block font-semibold hover:underline"
                    >
                      Limpiar todo el historial
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </section>

        {/* RIGHT COLUMN: Interactive Simulated Preview & Toggle (7 cols on lg) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Error Message if API fails */}
          {errorMsg && (
            <div className="bg-red-950/30 border border-red-900/50 p-4 rounded-xl flex items-start gap-3 text-red-300 text-xs sm:text-sm">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-red-200">Error de Conexión</h4>
                <p className="mt-1 leading-relaxed">{errorMsg}</p>
                <div className="mt-3 flex gap-2">
                  <a 
                    href="#profile-custom-btn" 
                    className="bg-red-900/50 hover:bg-red-900/70 border border-red-700 px-3 py-1 rounded text-[11px] text-white font-semibold transition-colors"
                    onClick={() => {
                      showToast("Configura tu clave de API de Gemini en el panel Secrets de AI Studio");
                    }}
                  >
                    ¿Cómo solucionarlo?
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Loading state screen overlay wrapper */}
          {isLoading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center min-h-[420px] flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 via-transparent to-purple-600/5 opacity-50" />
              
              <div className="relative z-10 space-y-6 max-w-sm">
                <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto relative">
                  <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                  <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping" />
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-bold text-white tracking-wider uppercase">Fórmula Copywriter Activa</h4>
                  <p className="text-xs text-slate-400 font-mono italic animate-pulse">
                    "{LOADING_QUOTES[loadingQuoteIndex]}"
                  </p>
                </div>

                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-4/5 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Output & Simulator Toolbar */}
              <div className="flex items-center justify-between mb-2 p-2 bg-slate-900/40 border border-slate-800 rounded-xl gap-4">
                
                {/* Variant selection TABS (MUST support always 2 variants) */}
                <div className="flex bg-slate-950 rounded-lg p-1 border border-slate-800">
                  <button
                    onClick={() => setSelectedVariant(1)}
                    className={`px-4 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                      selectedVariant === 1 
                        ? "bg-slate-800 text-white" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Variante 1
                  </button>
                  <button
                    onClick={() => setSelectedVariant(2)}
                    className={`px-4 py-1.5 rounded text-xs font-semibold transition-all cursor-pointer ${
                      selectedVariant === 2 
                        ? "bg-slate-800 text-white" 
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    Variante 2
                  </button>
                </div>

                {/* Simulation controls & actions */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-mono hidden sm:inline">
                    {activeText.length} caracteres
                  </span>
                  
                  {/* Regenerate a variant */}
                  <button
                    onClick={() => handleGenerate()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-slate-200 transition-all cursor-pointer flex items-center gap-1.5"
                    title="Regenerar otra variante diferente con las mismas configuraciones"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Regenerar</span>
                  </button>

                  {/* Copy active post */}
                  <button
                    onClick={handleCopy}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 rounded-lg text-xs font-bold text-white shadow-lg shadow-indigo-500/10 transition-all cursor-pointer flex items-center gap-1.5"
                    title="Copiar texto listo para pegar en la red social"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Post</span>
                  </button>
                </div>
              </div>

              {/* Editable Live Simulators based on selected platform */}
              <div className="relative">
                {/* Visual Platform Accent Line */}
                <div className="absolute top-0 left-0 right-0 h-1 z-10 rounded-t-xl overflow-hidden">
                  <div className={`h-full transition-all duration-300 ${
                    platform === "linkedin" 
                      ? "bg-[#0077B5]" 
                      : platform === "instagram" 
                        ? "bg-gradient-to-r from-pink-500 via-purple-500 to-orange-500" 
                        : "bg-slate-900"
                  }`} />
                </div>

                {/* Live simulator selection */}
                <div className="pt-1.5">
                  {platform === "linkedin" && (
                    <LinkedInPreview
                      text={activeText}
                      onChange={handleTextChange}
                      profile={profile}
                    />
                  )}
                  {platform === "instagram" && (
                    <InstagramPreview
                      text={activeText}
                      onChange={handleTextChange}
                      profile={profile}
                      topic={topic}
                      tone={tone}
                    />
                  )}
                  {platform === "twitter" && (
                    <TwitterPreview
                      text={activeText}
                      onChange={handleTextChange}
                      profile={profile}
                    />
                  )}
                </div>

                {/* Helpful Instruction Note */}
                <div className="mt-3 flex items-center justify-center gap-1.5 text-slate-500 text-[11px] font-medium text-center">
                  <PenSquare className="w-3.5 h-3.5 text-indigo-400/70" />
                  <span>💡 Consejo: Puedes hacer clic y editar el post directamente en la vista previa antes de copiarlo.</span>
                </div>
              </div>
            </>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 mt-12 py-6 bg-slate-950 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 RedactaRRSS. Diseñado con el tema de interfaz Sleek.</p>
          <div className="flex gap-4">
            <span className="text-slate-400 font-semibold flex items-center gap-1">
              Desarrollado en AI Studio Build <ExternalLink className="w-3 h-3 text-slate-500" />
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
