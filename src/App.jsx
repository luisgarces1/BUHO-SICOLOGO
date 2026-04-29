import React, { useState, useEffect } from 'react';
import { 
  Heart, Shield, Star, Droplets, Coins, MessageCircle, 
  Home, Map, User, Smile, Frown, AlertCircle, Sun, 
  Users, Hand, Lock, Award, BookOpen, Volume2, Gamepad2, RotateCw
} from 'lucide-react';
import luVideo from './assets/be_ae_b_e_afb_c_b_a_bmp_.mp4';
import rouletteImg from './assets/WhatsApp Image 2026-04-28 at 7.49.31 PM.jpeg';
import monsterSprites from './assets/Gemini_Generated_Image_kfsx50kfsx50kfsx.png';

// --- Utilidad de Voz (Text-to-Speech) ---
let selectedVoice = null;

const loadVoices = () => {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  
  // Preferencias de voces femeninas en español que suelen sonar mejor/más humanas
  const preferredNames = ['Microsoft Helena', 'Microsoft Sabina', 'Google español', 'Lucia', 'Monica', 'Paulina'];
  const esVoices = voices.filter(v => v.lang.startsWith('es'));
  
  // Intentar encontrar la mejor coincidencia
  selectedVoice = esVoices.find(v => preferredNames.some(p => v.name.includes(p))) || esVoices[0];
};

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();
}

const speak = (text, onStart, onEnd) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    } else {
      utterance.lang = 'es-ES';
    }
    
    // Ajustes para que suene más "tierna" y pausada para niños
    utterance.rate = 0.85; // Un poco más lento para mayor claridad y ternura
    utterance.pitch = 1.2; // Tono ligeramente más alto para sonar más amigable/juvenil
    utterance.volume = 1.0;

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    
    window.speechSynthesis.speak(utterance);
  }
};

const AudioButton = ({ text, className = "", colorClass = "bg-white/50 text-purple-700 hover:bg-white" }) => (
  <button 
    onClick={(e) => { e.stopPropagation(); speak(text); }} 
    className={`p-2 rounded-full transition-colors shadow-sm active:scale-95 flex-shrink-0 ${colorClass} ${className}`}
    title="Escuchar texto"
  >
    <Volume2 size={20} />
  </button>
);

// --- Componentes de UI Reutilizables ---
const Card = ({ children, className = "", onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-3xl shadow-sm border-2 border-transparent hover:border-purple-200 transition-all p-5 ${className} ${onClick ? 'cursor-pointer active:scale-95' : ''}`}
  >
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "" }) => {
  const variants = {
    primary: "bg-purple-500 text-white hover:bg-purple-600 shadow-md",
    secondary: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    magic: "bg-gradient-to-r from-yellow-400 to-orange-400 text-white shadow-md hover:scale-105",
    green: "bg-green-400 text-white shadow-md hover:bg-green-500",
  };
  return (
    <button 
      onClick={onClick} 
      className={`rounded-full py-3 px-6 font-bold text-lg transition-transform active:scale-95 ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

// --- Vistas de la Aplicación ---

// 1. Vista: Inicio (Dashboard)
const HomeView = ({ setTab }) => {
  const homeText = "¡Hola, Valiente! ¡Qué alegría verte por aquí! Toca el botón de abajo para decirme cómo te sientes hoy.";

  useEffect(() => {
    // Retraso de 800ms para evitar que el audio se corte al cargar la vista
    const timer = setTimeout(() => {
      speak(homeText);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col h-full min-h-[65vh] animate-fade-in">
      <div className="bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden flex-1 flex flex-col items-center justify-center text-center">
        <div className="relative z-10 flex flex-col items-center w-full h-full justify-center">
          <AudioButton 
            text={homeText} 
            colorClass="bg-white/20 text-white hover:bg-white/40 absolute -top-4 right-0" 
          />
          <h1 className="text-5xl font-extrabold mb-4 text-yellow-100 mt-4">¡Hola,<br/>Valiente!</h1>
          <p className="text-2xl opacity-90 mb-10">¡Qué alegría verte por aquí!</p>
          
          <Button variant="magic" className="mt-4 text-xl py-4 px-8 shadow-xl" onClick={() => setTab('chat')}>
            ¿Cómo te sientes hoy?
          </Button>
        </div>
        <Sun className="absolute -right-10 -top-10 w-64 h-64 text-yellow-300 opacity-50 animate-spin-slow" />
      </div>
    </div>
  );
};

// 2. Vista: Lú el Búho (Emociones y Comunicación)
const ChatView = () => {
  const [emotion, setEmotion] = useState(null);

  const responses = {
    happy: "¡Qué alegría! Tu sonrisa ilumina el mundo. ¡Chócala con la amiga psicóloga que está a tu lado!",
    sad: "Está bien sentirse triste a veces. Llorar limpia el corazón. ¿Te gustaría mostrarle esta carita triste a la amiga psicóloga que te acompaña? Está aquí para escucharte y ayudarte.",
    scared: "El miedo nos hace estar alerta, pero no estás solo. La amiga psicóloga que está contigo en esta habitación te protege. ¡Si quieres, puedes tomarle la mano!",
    angry: "¡Uf! Cuando estés muy enojado, imagina que eres un globo. Toma aire... y suéltalo despacio. ¿Qué tal si le cuentas a la amiga psicóloga qué te hizo enojar tanto?"
  };

  const handleEmotion = (emo) => {
    setEmotion(emo);
    speak(responses[emo]);
  };

  return (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="bg-purple-100 rounded-3xl p-8 relative">
        <AudioButton 
          text="¡Hola! Soy Lú. Este es nuestro lugar seguro. Nadie nos escucha. ¿Cómo se siente tu corazón hoy?" 
          className="absolute top-4 right-4" 
          colorClass="bg-purple-200 text-purple-700 hover:bg-purple-300"
        />
        <div className="w-24 h-24 bg-purple-300 rounded-full mx-auto flex items-center justify-center border-4 border-white shadow-md mb-4 text-4xl">
          🦉
        </div>
        <h2 className="text-2xl font-bold text-purple-800 mb-2">¡Hola! Soy Lú</h2>
        <p className="text-purple-600 font-medium text-lg">
          Este es nuestro lugar seguro. Nadie nos escucha. ¿Cómo se siente tu corazón hoy?
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <button onClick={() => handleEmotion('happy')} className="bg-yellow-100 hover:bg-yellow-200 p-6 rounded-3xl text-4xl transition-transform active:scale-95 shadow-sm">
          😄<span className="block text-sm font-bold text-yellow-700 mt-2">Feliz</span>
        </button>
        <button onClick={() => handleEmotion('sad')} className="bg-blue-100 hover:bg-blue-200 p-6 rounded-3xl text-4xl transition-transform active:scale-95 shadow-sm">
          😢<span className="block text-sm font-bold text-blue-700 mt-2">Triste</span>
        </button>
        <button onClick={() => handleEmotion('scared')} className="bg-indigo-100 hover:bg-indigo-200 p-6 rounded-3xl text-4xl transition-transform active:scale-95 shadow-sm">
          😨<span className="block text-sm font-bold text-indigo-700 mt-2">Asustado</span>
        </button>
        <button onClick={() => handleEmotion('angry')} className="bg-red-100 hover:bg-red-200 p-6 rounded-3xl text-4xl transition-transform active:scale-95 shadow-sm">
          😡<span className="block text-sm font-bold text-red-700 mt-2">Enojado</span>
        </button>
      </div>

      {emotion && (
        <div className="mt-6 bg-white p-6 rounded-3xl shadow-md border-2 border-purple-200 animate-slide-up text-left">
          <div className="flex items-start gap-4">
            <span className="text-3xl">🦉</span>
            <div>
              <p className="text-lg text-gray-700 font-medium leading-relaxed">{responses[emotion]}</p>
            </div>
            <AudioButton text={responses[emotion]} colorClass="bg-purple-100 text-purple-600 hover:bg-purple-200" />
          </div>
        </div>
      )}
    </div>
  );
};

// 3. Vista: Cofre de Sueños (Esperanza y Pobreza)
const DreamsView = () => {
  const [selectedDream, setSelectedDream] = useState(null);
  
  const dreams = [
    { id: 1, icon: "🩺", title: "Doctor", desc: "Para sanar a las personas." },
    { id: 2, icon: "🚀", title: "Astronauta", desc: "Para explorar las estrellas." },
    { id: 3, icon: "🎨", title: "Artista", desc: "Para pintar un mundo hermoso." },
    { id: 4, icon: "💻", title: "Inventor", desc: "Para crear cosas nuevas." },
    { id: 5, icon: "👮", title: "Policía", desc: "Para proteger a los demás." },
    { id: 6, icon: "👩‍🏫", title: "Maestro", desc: "Para enseñar a otros niños." },
    { id: 7, icon: "🚒", title: "Bombero", desc: "Para salvar y ayudar en emergencias." },
    { id: 8, icon: "⚽", title: "Futbolista", desc: "Para jugar con mucha energía y pasión." },
    { id: 9, icon: "🌟", title: "Otro", desc: "¡Porque tú puedes ser lo que quieras!" }
  ];

  const handleDreamClick = (dream) => {
    setSelectedDream(dream);
    if (dream.title === "Otro") {
      speak(`¡Serás lo que desees ser! ${dream.desc} Recuerda: El estudio y creer en ti mismo son tu escalera hacia el éxito. ¡Tú puedes lograrlo!`);
    } else {
      speak(`¡Serás un gran ${dream.title}! ${dream.desc} Recuerda: El estudio y creer en ti mismo son tu escalera hacia el éxito. ¡Tú puedes lograrlo!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl font-black text-yellow-600 flex items-center justify-center gap-2">
          <Star /> Cofre de Sueños <Star />
        </h2>
        <AudioButton 
          text="Cofre de Sueños. No importa dónde vivas hoy o lo que tengas. ¡Tu mente y tu corazón son tus mayores tesoros! ¿Qué quieres ser de grande?" 
          colorClass="bg-yellow-100 text-yellow-700" 
        />
      </div>
      <p className="text-gray-600 font-medium">
        No importa dónde vivas hoy o lo que tengas. ¡Tu mente y tu corazón son tus mayores tesoros! ¿Qué quieres ser de grande?
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {dreams.map(dream => (
          <div 
            key={dream.id}
            onClick={() => handleDreamClick(dream)}
            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${selectedDream?.id === dream.id ? 'bg-yellow-100 border-yellow-400 scale-105' : 'bg-white border-gray-100 hover:border-yellow-200'}`}
          >
            <span className="text-4xl block mb-2">{dream.icon}</span>
            <span className="font-bold text-gray-700">{dream.title}</span>
          </div>
        ))}
      </div>

      {selectedDream && (
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-orange-500 p-6 rounded-3xl text-white shadow-lg animate-slide-up border-b-4 border-orange-600">
          <h3 className="text-2xl font-black mb-2 tracking-tight">
            {selectedDream.title === "Otro" ? "¡Serás lo que desees ser!" : `¡Serás un gran ${selectedDream.title.toLowerCase()}!`}
          </h3>
          <p className="text-lg opacity-95 font-medium">{selectedDream.desc}</p>
          <p className="mt-4 font-bold bg-white/20 p-3 rounded-xl">Recuerda: El estudio y creer en ti mismo son tu escalera hacia el éxito. ¡Tú puedes lograrlo!</p>
        </div>
      )}
    </div>
  );
};

// 4. Vista: Escudo Mágico (Prevención Abuso, Bullying, Miedos)
const ShieldView = () => {
  const [activeLesson, setActiveLesson] = useState(null);

  const lessons = {
    body: {
      title: "Mi Cuerpo es Mío",
      icon: <Lock className="text-pink-500 w-12 h-12" />,
      color: "bg-pink-100 border-pink-300",
      content: "Tu cuerpo es tu tesoro. Nadie debe tocar las partes que cubre tu traje de baño. Si alguien lo hace o te pide que lo toques, di ¡NO! muy fuerte, corre y cuéntaselo a un adulto en quien confíes. ¡Nunca será tu culpa!"
    },
    secrets: {
      title: "Secretos vs Sorpresas",
      icon: <AlertCircle className="text-orange-500 w-12 h-12" />,
      color: "bg-orange-100 border-orange-300",
      content: "Las 'sorpresas' son buenas (como un regalo de cumpleaños) y hacen feliz a la gente. Los 'secretos malos' te hacen sentir miedo o dolor en la barriga. ¡Los secretos malos SIEMPRE deben contarse a alguien que te cuide!"
    },
    bullying: {
      title: "Escudo contra el Bullying",
      icon: <Hand className="text-red-500 w-12 h-12" />,
      color: "bg-red-100 border-red-300",
      content: "Si alguien te dice palabras feas, te pega o te hace sentir mal, levanta tu mano y di ¡ALTO! Aléjate de ahí y busca a un maestro o a tu familia. Eres muy valioso y valiosa, y nadie tiene derecho a lastimarte."
    }
  };

  const handleLessonClick = (key) => {
    if (activeLesson === key) {
      setActiveLesson(null);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    } else {
      setActiveLesson(key);
      const lesson = lessons[key];
      speak(`${lesson.title}. ${lesson.content}. Mi Red de Apoyo: Piensa en 3 adultos en los que confíes mucho. Mamá, Papá, Abuela o Maestra. ¡Ellos siempre te ayudarán!`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center relative">
        <div className="flex items-center justify-center gap-2">
          <h2 className="text-2xl font-black text-red-600 flex items-center justify-center gap-2">
            <Shield /> Escudo Mágico
          </h2>
          <AudioButton 
            text="Escudo Mágico. Todos los superhéroes tienen reglas para protegerse. ¡Aprende las tuyas! Toca una carta para escuchar." 
            colorClass="bg-red-100 text-red-600" 
          />
        </div>
        <p className="text-gray-600 font-medium mt-2">
          Todos los superhéroes tienen reglas para protegerse. ¡Aprende las tuyas! Toca una carta.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {Object.entries(lessons).map(([key, lesson]) => (
          <div 
            key={key}
            onClick={() => handleLessonClick(key)}
            className={`p-1 rounded-3xl cursor-pointer transition-all ${activeLesson === key ? 'scale-100' : 'hover:scale-105'}`}
          >
            <div className={`${lesson.color} border-2 rounded-[22px] p-5 flex items-center gap-4`}>
              <div className="bg-white p-3 rounded-2xl shadow-sm">{lesson.icon}</div>
              <h3 className="font-bold text-xl text-gray-800">{lesson.title}</h3>
            </div>
            
            {activeLesson === key && (
              <div className="bg-white border-2 border-t-0 -mt-4 pt-8 pb-5 px-6 rounded-b-[22px] shadow-sm animate-slide-down">
                <p className="text-gray-700 text-lg leading-relaxed font-medium">
                  {lesson.content}
                </p>
                <div className="mt-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                  <span className="font-bold text-gray-600 text-sm block mb-1">Mi Red de Apoyo:</span>
                  <p className="text-sm text-gray-500">Piensa en 3 adultos en los que confíes mucho (Mamá, Papá, Abuela, Maestra). ¡La persona que está contigo ahora mismo también puede ayudarte!</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// 5. Vista: Jugar Juntos (Minijuego Rompehielos Sicólogo-Niño)
const PlayView = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = [
    { turn: 'niño', icon: '👦👧', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', q: 'Si pudieras tener un superpoder, ¿cuál elegirías y por qué?' },
    { turn: 'psicóloga', icon: '🧑👩', color: 'bg-blue-100 border-blue-300 text-blue-800', q: 'Turno de la amiga psicóloga: ¿Cuál era tu juguete favorito cuando tenías mi edad?' },
    { turn: 'niño', icon: '👦👧', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', q: 'Si fueras un animal, ¿cuál serías y qué sonido harías?' },
    { turn: 'psicóloga', icon: '🧑👩', color: 'bg-blue-100 border-blue-300 text-blue-800', q: 'Turno de la amiga psicóloga: Cuéntame un chiste (aunque sea muy malo).' },
    { turn: 'niño', icon: '👦👧', color: 'bg-yellow-100 border-yellow-300 text-yellow-800', q: '¿Qué es lo que más te hace reír a carcajadas?' },
    { turn: 'psicóloga', icon: '🧑👩', color: 'bg-blue-100 border-blue-300 text-blue-800', q: 'Turno de la amiga psicóloga: ¿A qué le tenías un poquito de miedo cuando eras pequeño?' }
  ];

  const currentQ = questions[questionIndex];

  const handleNext = () => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (questionIndex + 1 === questions.length) {
      setIsFinished(true);
    } else {
      setQuestionIndex((prev) => prev + 1);
    }
  };

  if (isFinished) {
    return (
      <div className="space-y-6 animate-fade-in text-center flex flex-col items-center justify-center min-h-[50vh] px-2">
        <div className="bg-green-100 p-8 rounded-3xl border-4 border-green-300 shadow-xl relative animate-slide-up mt-8">
          <Heart className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 text-green-500 bg-white rounded-full p-2 border-4 border-green-300" fill="currentColor" />
          <h2 className="text-3xl font-black text-green-800 mb-4 mt-6">¡Excelente!</h2>
          <p className="text-lg text-green-700 font-medium mb-6 leading-relaxed">
            Ahora que ya nos conocemos mejor y hemos roto el hielo... ¡Es tu turno de brillar! <br/><br/>
            Cuéntale a tu amiga psicóloga cómo te sientes, una historia que te guste o algo que te haya pasado hoy. ¡Ella está aquí para escucharte con todo el corazón!
          </p>
          <AudioButton 
            text="¡Excelente! Ahora que ya nos conocemos mejor y hemos roto el hielo... ¡Es tu turno de brillar! Cuéntale a tu amiga psicóloga cómo te sientes, una historia que te guste o algo que te haya pasado hoy. ¡Ella está aquí para escucharte con todo el corazón!" 
            colorClass="bg-green-200 text-green-800 hover:bg-green-300 mx-auto flex w-12 h-12 items-center justify-center" 
          />
        </div>
        <Button variant="green" className="mt-8 flex justify-center items-center gap-2" onClick={() => { setIsFinished(false); setQuestionIndex(0); }}>
          <Gamepad2 size={20} /> Volver a Jugar
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-center">
      <div className="flex items-center justify-center gap-2">
        <h2 className="text-2xl font-black text-green-600 flex items-center justify-center gap-2">
          <Gamepad2 /> Jugar Juntos
        </h2>
        <AudioButton 
          text="Jugar Juntos. Vamos a hacer un juego por turnos. Una pregunta para ti, y una pregunta para la amiga psicóloga que te acompaña. ¡A jugar!" 
          colorClass="bg-green-100 text-green-700" 
        />
      </div>
      <p className="text-gray-600 font-medium">
        Un turno para ti, un turno para la amiga psicóloga que te acompaña. ¡Para conocernos mejor!
      </p>

      <div className={`mt-8 p-8 rounded-3xl border-4 ${currentQ.color} relative animate-slide-up shadow-md`}>
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-5xl bg-white rounded-full p-2 shadow-sm border-2 border-inherit">
          {currentQ.icon}
        </div>
        <h3 className="text-xl font-bold mt-4 mb-4 leading-relaxed">
          {currentQ.q}
        </h3>
        <AudioButton text={currentQ.q} colorClass="bg-white/50 hover:bg-white text-inherit w-12 h-12 flex items-center justify-center mx-auto mb-4" />
      </div>

      <Button variant="green" className="w-full flex justify-center items-center gap-2 mt-4" onClick={handleNext}>
        Siguiente Pregunta <Gamepad2 size={20} />
      </Button>
    </div>
  );
};

// 6. Vista: Mi Tribu (Convivencia y Cooperación)
const TribeView = () => (
  <div className="space-y-6 animate-fade-in text-center">
    <div className="bg-indigo-100 rounded-3xl p-8 pb-12 relative overflow-hidden">
      <div className="relative z-10 flex items-center justify-center gap-2 mb-2">
        <h2 className="text-3xl font-black text-indigo-800">Mi Tribu</h2>
        <AudioButton text="Mi Tribu. El mundo es más divertido cuando compartimos y nos respetamos." colorClass="bg-indigo-200 text-indigo-800" />
      </div>
      <p className="text-indigo-600 font-medium relative z-10">
        El mundo es más divertido cuando compartimos y nos respetamos.
      </p>
      <Users className="absolute -bottom-6 -right-6 w-32 h-32 text-indigo-200" />
    </div>

    <div className="grid grid-cols-1 gap-4 -mt-8 relative z-20 px-4">
      <div className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-green-400 flex items-center gap-4">
        <div className="bg-green-100 p-3 rounded-full text-green-600"><Heart /></div>
        <div className="text-left flex-1">
          <h4 className="font-bold text-gray-800">Ser Amable</h4>
          <p className="text-sm text-gray-600">Un "por favor" y "gracias" son palabras mágicas que abren puertas.</p>
        </div>
        <AudioButton text="Ser Amable. Un por favor y gracias son palabras mágicas que abren puertas." colorClass="bg-green-50 text-green-600 hover:bg-green-100" />
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-blue-400 flex items-center gap-4">
        <div className="bg-blue-100 p-3 rounded-full text-blue-600"><Users /></div>
        <div className="text-left flex-1">
          <h4 className="font-bold text-gray-800">Compartir</h4>
          <p className="text-sm text-gray-600">Prestar tus juguetes o ayudar a un amigo hace crecer tu corazón.</p>
        </div>
        <AudioButton text="Compartir. Prestar tus juguetes o ayudar a un amigo hace crecer tu corazón." colorClass="bg-blue-50 text-blue-600 hover:bg-blue-100" />
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-md border-l-4 border-purple-400 flex items-center gap-4">
        <div className="bg-purple-100 p-3 rounded-full text-purple-600"><Smile /></div>
        <div className="text-left flex-1">
          <h4 className="font-bold text-gray-800">Todos somos únicos</h4>
          <p className="text-sm text-gray-600">Algunos usan lentes, otros corren rápido. ¡Nuestras diferencias nos hacen especiales!</p>
        </div>
        <AudioButton text="Todos somos únicos. Algunos usan lentes, otros corren rápido. ¡Nuestras diferencias nos hacen especiales!" colorClass="bg-purple-50 text-purple-600 hover:bg-purple-100" />
      </div>
    </div>
  </div>
);


// 7. Vista: El Monstruo de Colores (Cuento y Ruleta)
const MonsterView = () => {
  const [step, setStep] = useState('intro'); // 'intro', 'story', 'roulette'
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [history, setHistory] = useState([]);

  const emotions = [
    { id: 1, name: 'Alegría', gender: 'f', color: 'bg-yellow-400', text: 'Amarillo como el sol. ¡Brilla con mucha fuerza!', pos: '0% 0%', description: '¡Qué felicidad! Sientes ganas de saltar, bailar y jugar.' },
    { id: 2, name: 'Tristeza', gender: 'f', color: 'bg-blue-400', text: 'Azul como el mar. Suave y dulce.', pos: '50% 100%', description: 'Está bien estar triste. Es como un día de lluvia.' },
    { id: 3, name: 'Rabia', gender: 'f', color: 'bg-red-500', text: 'Roja como el fuego. Feroz y ardiente.', pos: '100% 0%', description: '¡Uff! Quieres gritar y soltar todo ese fuego.' },
    { id: 4, name: 'Miedo', gender: 'm', color: 'bg-gray-600', text: 'Negro y oscuro. Se esconde en las sombras.', pos: '50% 0%', description: 'El miedo nos hace sentir pequeños, pero Lú te acompaña.' },
    { id: 5, name: 'Calma', gender: 'f', color: 'bg-green-400', text: 'Verde como las hojas de los árboles.', pos: '0% 100%', description: 'Respiras poco a poco y profundamente. Todo está en paz.' },
    { id: 6, name: 'Amor', gender: 'm', color: 'bg-pink-400', text: 'Rosa y dulce. ¡Un gran abrazo!', pos: '100% 100%', description: '¡Qué bonito! Te sientes querido y con ganas de dar amor.' }
  ];

  const storyText = "¡Hola! Soy Lú el Búho. Hoy te contaré una historia especial. Había una vez un monstruo que se despertó muy confundido; sus emociones estaban todas mezcladas y no sabía qué le pasaba. Su amiga le enseñó que cada sentimiento tiene un color: la alegría es amarilla como el sol, la tristeza es azul como el mar, la rabia es roja y feroz como el fuego, el miedo es negro y se esconde en la oscuridad, y la calma es verde, tranquila como los árboles. Al poner cada emoción en su propio bote, el monstruo se sintió mucho mejor. ¡Incluso descubrió un nuevo color, el rosa, que es el del amor! Recuerda: cuando ordenas lo que sientes, todo es más fácil. ¿Cómo te sientes tú hoy?";

  const spinRoulette = () => {
    if (spinning) return;

    setSpinning(true);
    setSelectedEmotion(null);

    // Lógica para que no repita hasta agotar el ciclo
    let available = emotions.filter(e => !history.includes(e.id));
    
    // Si ya salieron todos, reiniciamos el historial (excepto el último para que no repita consecutivo)
    if (available.length === 0) {
      const lastId = history[history.length - 1];
      available = emotions.filter(e => e.id !== lastId);
      setHistory([lastId]);
    }

    const targetEmotion = available[Math.floor(Math.random() * available.length)];
    const emotionIndex = emotions.findIndex(e => e.id === targetEmotion.id);
    
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const sectionAngle = 60;
    const degreesToTarget = (360 - (emotionIndex * sectionAngle)) - (sectionAngle / 2);
    
    // Cálculo preciso para que siempre gire hacia adelante y caiga exacto
    const currentRotationMod = rotation % 360;
    let targetRotation = rotation + (extraSpins * 360) + degreesToTarget - currentRotationMod;
    if (targetRotation <= rotation) targetRotation += 360;
    
    setRotation(targetRotation);

    setTimeout(() => {
      setSpinning(false);
      setSelectedEmotion(targetEmotion);
      setHistory(prev => [...prev, targetEmotion.id]);
      const promptText = "¿Alguna vez te has sentido así? ¡Cuéntale a tu amiga la psicóloga!";
      const article = targetEmotion.gender === 'f' ? 'la' : 'el';
      speak(`¡Te ha tocado ${article} ${targetEmotion.name}! ${targetEmotion.text}. ${targetEmotion.description}. ${promptText}`);
    }, 3000);
  };

  if (step === 'intro') {
    return (
      <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in text-center py-8">
        <div className="w-64 h-64 bg-white rounded-full flex items-center justify-center border-8 border-purple-200 shadow-2xl overflow-hidden">
          <img src={rouletteImg} alt="Ruleta de Colores" className="w-full h-full object-cover scale-125 object-[45%_48%]" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-purple-800 mb-2">El Monstruo de Colores</h2>
          <p className="text-lg text-purple-600 font-medium">¿Quieres escuchar su historia y jugar con la ruleta?</p>
        </div>
        <Button variant="magic" className="w-full py-4 text-xl" onClick={() => {
          setStep('story');
          speak(storyText);
        }}>
          ¡Sí, vamos!
        </Button>
      </div>
    );
  }

  if (step === 'story') {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="bg-white p-8 rounded-3xl shadow-lg border-2 border-purple-100 text-center relative">
          <AudioButton text={storyText} className="absolute top-4 right-4" />
          <div className="text-6xl mb-6 animate-bounce-slow">👾</div>
          <h2 className="text-2xl font-black text-purple-800 mb-4">El Cuento del Monstruo</h2>
          <p className="text-lg text-gray-700 leading-relaxed text-left font-medium">
            {storyText}
          </p>
          <Button variant="primary" className="mt-8 w-full" onClick={() => {
            window.speechSynthesis.cancel();
            setStep('roulette');
          }}>
            ¡Ahora juguemos a la Ruleta!
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in text-center">
      <div>
        <h2 className="text-2xl font-black text-purple-800 flex items-center justify-center gap-2">
          <RotateCw className={spinning ? 'animate-spin' : ''} /> Ruleta de Emociones
        </h2>
        <p className="text-gray-600 font-medium mt-1">¡Gira la flecha y cuéntale a Lú qué te hace sentir así!</p>
      </div>

      <div className="relative w-80 h-80 mx-auto mt-8">
        {/* La Ruleta */}
        <div 
          className="w-full h-full rounded-full border-8 border-gray-800 shadow-2xl relative overflow-hidden transition-transform duration-[3000ms] ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {emotions.map((emo, i) => (
            <div 
              key={emo.id}
              className={`absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left ${emo.color}`}
              style={{ 
                transform: `rotate(${i * 60}deg) skewY(-30deg)`,
                border: '1px solid rgba(0,0,0,0.1)'
              }}
            >
              <div className="absolute bottom-1 left-1 transform rotate-[45deg] skewY(30deg) w-20 h-20">
                <div 
                  className="w-full h-full bg-no-repeat rounded-xl shadow-sm border-2 border-white/80"
                  style={{ 
                    backgroundImage: `url(${monsterSprites})`,
                    backgroundPosition: emo.pos,
                    backgroundSize: '320% 210%', // Ajustado para mayor resolución visual y mejor encuadre
                    backgroundColor: 'white'
                  }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* La Flecha */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="w-8 h-12 bg-gray-800 clip-path-arrow shadow-md"></div>
        </div>
        
        {/* Centro */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full border-4 border-gray-800 z-10 shadow-sm flex items-center justify-center">
          <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
        </div>
      </div>

      <div className="px-4">
        <Button 
          variant="magic" 
          className="w-full py-4 text-2xl shadow-xl flex items-center justify-center gap-3"
          onClick={spinRoulette}
          disabled={spinning}
        >
          {spinning ? '¡Girando...!' : '¡Toca para Girar!'} <RotateCw size={24} />
        </Button>
      </div>

      {selectedEmotion && !spinning && (
        <div className={`mt-6 p-6 rounded-3xl shadow-lg border-b-4 animate-slide-up text-white ${selectedEmotion.color} border-black/10`}>
          <div className="flex items-center justify-center gap-4 mb-3">
            <div 
              className="w-36 h-36 bg-white rounded-3xl border-4 border-white/50 shadow-lg overflow-hidden"
              style={{ 
                backgroundImage: `url(${monsterSprites})`,
                backgroundPosition: selectedEmotion.pos,
                backgroundSize: '310% 205%',
                imageRendering: 'pixelated'
              }}
            />
            <h3 className="text-3xl font-black uppercase tracking-wider">{selectedEmotion.name}</h3>
          </div>
          <p className="text-lg font-bold opacity-90 mb-3">{selectedEmotion.text}</p>
          <div className="bg-white/20 p-4 rounded-2xl">
            <p className="text-sm font-medium leading-relaxed">
              {selectedEmotion.description}
              <br/><br/>
              <span className="font-black text-white underline decoration-2">¿Alguna vez te has sentido así? ¡Cuéntale a tu amiga psicóloga!</span>
            </p>
          </div>
          <AudioButton 
            text={`${selectedEmotion.name}. ${selectedEmotion.text}. ${selectedEmotion.description}. ¿Alguna vez te has sentido así? ¡Cuéntale a tu amiga psicóloga!`} 
            colorClass="bg-white/20 text-white mt-4 mx-auto" 
          />
        </div>
      )}

      <style dangerouslySetInnerHTML={{__html: `
        .clip-path-arrow {
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
          transform: rotate(180deg);
        }
      `}} />
    </div>
  );
};


// 0. Vista: Landing Page (Intro)
const LandingView = ({ setTab }) => {
  const videoRef = React.useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.play().catch(e => console.error("Auto-play error:", e));
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] space-y-8 animate-fade-in text-center px-4">
      <div className="relative mt-8 cursor-pointer" onClick={handlePlayVideo}>
        <div className={`w-56 h-56 rounded-full overflow-hidden border-4 border-purple-300 mx-auto bg-white transition-all duration-300 ${isPlaying ? 'scale-105 shadow-[0_0_30px_rgba(168,85,247,0.6)]' : 'animate-bounce-slow shadow-2xl'}`}>
          <video 
            ref={videoRef}
            src={luVideo} 
            playsInline 
            onPlay={() => setIsPlaying(true)}
            onEnded={() => setIsPlaying(false)}
            onPause={() => setIsPlaying(false)}
            className="w-full h-full object-cover" 
          />
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); handlePlayVideo(); }} 
          className="absolute -bottom-2 right-2 bg-purple-100 p-4 shadow-lg rounded-full text-purple-700 hover:bg-purple-200 transition-transform active:scale-95 z-10"
          title="Escuchar video"
        >
          <Volume2 size={24} />
        </button>
      </div>
      
      <div>
        <h1 className="text-4xl font-extrabold text-purple-800 mb-4">Lú el Búho</h1>
        <p className="text-lg text-purple-600 font-medium leading-relaxed max-w-xs mx-auto">
          Toca el botón para que iniciemos.
        </p>
      </div>

      <Button variant="magic" className="w-full max-w-md py-5 text-3xl flex items-center justify-center shadow-xl mt-4" onClick={() => {
        window.speechSynthesis.cancel();
        speak("¡Genial! Vamos a jugar.");
        setTab('home');
      }}>
        ¡Iniciemos!
      </Button>
    </div>
  );
};

// Pantalla inicial requerida para habilitar el audio automático en navegadores
const StartScreen = ({ onStart }) => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-400 to-indigo-600 text-white animate-fade-in text-center px-4 w-full max-w-2xl mx-auto md:rounded-3xl md:h-[90vh] md:my-4 shadow-2xl">
    <div className="w-48 h-48 mb-8 rounded-full overflow-hidden shadow-2xl border-4 border-white mx-auto animate-bounce-slow">
      <img src="/lu-intro.png" alt="Lú el Búho" className="w-full h-full object-cover" />
    </div>
    <h1 className="text-5xl font-black mb-4 tracking-tight">Lú el Búho</h1>
    <p className="text-xl mb-12 opacity-90 font-medium">Tu refugio seguro</p>
    <Button variant="magic" className="text-2xl py-5 px-12 shadow-2xl animate-pulse" onClick={onStart}>
      Toca para Entrar
    </Button>
  </div>
);

// --- Componente Principal ---
export default function App() {
  const [hasEntered, setHasEntered] = useState(false);
  const [activeTab, setActiveTab] = useState('landing');

  // Detener el audio cuando el niño cambie de pantalla
  const handleTabChange = (tab) => {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    setActiveTab(tab);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'landing': return <LandingView setTab={handleTabChange} />;
      case 'home': return <HomeView setTab={handleTabChange} />;
      case 'chat': return <ChatView />;
      case 'dreams': return <DreamsView />;
      case 'shield': return <ShieldView />;
      case 'play': return <PlayView />;
      case 'tribe': return <TribeView />;
      case 'monster': return <MonsterView />;
      default: return <LandingView setTab={handleTabChange} />;
    }
  };

  if (!hasEntered) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center font-sans">
        <StartScreen onStart={() => setHasEntered(true)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center font-sans items-center">
      {/* Contenedor adaptado a tablets y móviles */}
      <div className="w-full max-w-2xl bg-white shadow-2xl relative flex flex-col h-screen md:h-[95vh] overflow-hidden md:rounded-[2.5rem] md:my-4 border-4 border-gray-100">
        
        {/* Header App */}
        {activeTab !== 'landing' && (
        <header className="px-6 pt-10 pb-4 flex justify-between items-center bg-white z-10">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white shadow-sm">
              <Star size={24} fill="currentColor" />
            </div>
            <h1 className="font-black text-xl text-gray-800 tracking-tight">Lú el Búho</h1>
          </div>
          {activeTab !== 'home' && (
            <button onClick={() => handleTabChange('home')} className="bg-gray-100 p-2 rounded-full text-gray-600 hover:bg-gray-200">
              <Home size={20} />
            </button>
          )}
        </header>
        )}

        {/* Área de Contenido con scroll */}
        <main className="flex-1 overflow-y-auto px-6 pb-24 bg-gray-50/50 rounded-t-3xl shadow-inner">
          <div className="py-4">
            {renderContent()}
          </div>
        </main>

        {/* Barra de Navegación Inferior */}
        {activeTab !== 'landing' && (
        <nav className="absolute bottom-0 w-full bg-white border-t border-gray-100 px-6 py-4 flex justify-between items-center z-20 pb-8 sm:pb-4 sm:rounded-b-3xl">
          <button 
            onClick={() => handleTabChange('dreams')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'dreams' ? 'text-yellow-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Star size={24} className={activeTab === 'dreams' ? 'fill-yellow-100' : ''} />
            <span className="text-[10px] font-bold">Sueños</span>
          </button>
          
          <button 
            onClick={() => handleTabChange('chat')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'chat' ? 'text-blue-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <MessageCircle size={24} className={activeTab === 'chat' ? 'fill-blue-100' : ''} />
            <span className="text-[10px] font-bold">Lú</span>
          </button>

          <button 
            onClick={() => handleTabChange('shield')}
            className={`flex flex-col items-center gap-1 -mt-6 ${activeTab === 'shield' ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <div className={`p-4 rounded-full shadow-lg ${activeTab === 'shield' ? 'bg-red-500 text-white' : 'bg-white border text-gray-400'}`}>
              <Shield size={28} className={activeTab === 'shield' ? 'fill-red-400' : ''} />
            </div>
            <span className="text-[10px] font-bold mt-1">Escudo</span>
          </button>

          <button 
            onClick={() => handleTabChange('tribe')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'tribe' ? 'text-indigo-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Users size={24} className={activeTab === 'tribe' ? 'fill-indigo-100' : ''} />
            <span className="text-[10px] font-bold">Tribu</span>
          </button>

          <button 
            onClick={() => handleTabChange('play')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'play' ? 'text-green-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Gamepad2 size={24} className={activeTab === 'play' ? 'fill-green-100' : ''} />
            <span className="text-[10px] font-bold">Jugar</span>
          </button>
 
          <button 
            onClick={() => handleTabChange('monster')}
            className={`flex flex-col items-center gap-1 ${activeTab === 'monster' ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <RotateCw size={24} className={activeTab === 'monster' ? 'fill-orange-100' : ''} />
            <span className="text-[10px] font-bold">Monstruo</span>
          </button>
        </nav>
        )}

        {/* Estilos CSS globales integrados para animaciones suaves */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in { animation: fadeIn 0.4s ease-out; }
          .animate-slide-up { animation: slideUp 0.3s ease-out; }
          .animate-slide-down { animation: slideDown 0.3s ease-out; }
          .animate-spin-slow { animation: spin 12s linear infinite; }
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-10px); }
            100% { transform: translateY(0px); }
          }
          .animate-bounce-slow { animation: float 4s ease-in-out infinite; }
        `}} />
      </div>
    </div>
  );
}