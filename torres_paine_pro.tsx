import React, { useState, useEffect, useRef } from 'react';
import { Mountain, MapPin, Calendar, DollarSign, Backpack, AlertTriangle, Camera, Navigation, Star, CheckCircle, Clock, Users, Zap, Shield, Heart, TrendingUp, Eye, Settings, Menu, X, Play, Pause, RotateCcw, Info, Download, Share2, Bookmark, Bell, Wifi, WifiOff, MessageCircle, Map, Thermometer, Wind, CloudRain, Sun, Moon, Battery, Signal, Bluetooth, Compass, Route, Timer, Headphones, Mic, FileText, Search, Filter, SortAsc, MoreVertical, Send, ImageIcon, Video, Trash2, Edit, Save, Plus, Minus, Home, User, Globe, Phone, Tent, Utensils, Shirt, Scissors, Package, Plane, Car, Bus, CreditCard, ReceiptText } from 'lucide-react';

const TorresPaineCompleteApp = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState('standard');
  const [currentDay, setCurrentDay] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [notifications, setNotifications] = useState([]);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [weather, setWeather] = useState({ temp: 8, condition: 'windy', wind: 45 });
  const [photos, setPhotos] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [deviceInfo, setDeviceInfo] = useState({ battery: 85, signal: 'offline', bluetooth: true });
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [planningPhase, setPlanningPhase] = useState(1);
  const [budget, setBudget] = useState({ total: 0, spent: 0 });

  // Datos completos del circuito
  const circuitData = {
    totalDistance: 130,
    totalDays: 8,
    walkingHours: '60-70',
    highestPoint: '1,241m',
    difficulty: 'EXTREMA'
  };

  const circuitDays = [
    { 
      day: 1, 
      location: 'Serón', 
      distance: '9.3km', 
      difficulty: 1, 
      highlight: 'Inicio épico',
      services: ['agua', 'camping', 'refugio'],
      altitude: '150m',
      walkingTime: '3-4h',
      weather: 'Variable',
      tips: ['Registrarse CONAF', 'Verificar equipo', 'Salida temprana']
    },
    { 
      day: 2, 
      location: 'Dickson', 
      distance: '18.5km', 
      difficulty: 3, 
      highlight: 'Pampa ventosa',
      services: ['agua', 'camping', 'refugio', 'duchas'],
      altitude: '250m',
      walkingTime: '6-7h',
      weather: 'Vientos fuertes',
      tips: ['Vientos 60+ km/h', 'Usar cortavientos', 'Hidratarse bien']
    },
    { 
      day: 3, 
      location: 'Los Perros', 
      distance: '12km', 
      difficulty: 2, 
      highlight: 'Preparación Gardner',
      services: ['agua', 'camping'],
      altitude: '285m',
      walkingTime: '4-5h',
      weather: 'Húmedo',
      tips: ['Solo camping', 'Sin duchas', 'Preparar Gardner']
    },
    { 
      day: 4, 
      location: 'Grey (Paso Gardner)', 
      distance: '16km', 
      difficulty: 5, 
      highlight: 'PASO GARDNER - EXTREMO',
      services: ['agua', 'camping', 'refugio', 'duchas'],
      altitude: '1,241m',
      walkingTime: '8-10h',
      weather: 'Extremo',
      tips: ['SALIDA 5:00 AM', 'Crampones obligatorios', 'Día más peligroso']
    },
    { 
      day: 5, 
      location: 'Paine Grande', 
      distance: '11km', 
      difficulty: 1, 
      highlight: 'Recuperación',
      services: ['agua', 'camping', 'refugio', 'duchas', 'wifi', 'tienda'],
      altitude: '75m',
      walkingTime: '3-4h',
      weather: 'Estable',
      tips: ['Refugio principal', 'WiFi disponible', 'Reabastecimiento']
    },
    { 
      day: 6, 
      location: 'Cuernos (Valle Francés)', 
      distance: '25km', 
      difficulty: 4, 
      highlight: 'Valle Francés - DÍA MÁS LARGO',
      services: ['agua', 'camping', 'refugio', 'duchas'],
      altitude: '200m',
      walkingTime: '8-9h',
      weather: 'Variable',
      tips: ['Día más largo', 'Dejar mochilas Italiano', 'Mirador imperdible']
    },
    { 
      day: 7, 
      location: 'Chileno', 
      distance: '7.5km', 
      difficulty: 1, 
      highlight: 'Preparación Torres',
      services: ['agua', 'camping'],
      altitude: '410m',
      walkingTime: '2-3h',
      weather: 'Protegido',
      tips: ['Solo camping', 'Preparar Torres', 'Descanso antes final']
    },
    { 
      day: 8, 
      location: 'Las Torres', 
      distance: '19km', 
      difficulty: 3, 
      highlight: 'GRAN FINAL - MIRADOR TORRES',
      services: ['agua', 'parking'],
      altitude: '850m',
      walkingTime: '6-8h',
      weather: 'Montaña',
      tips: ['Salida 4:00 AM', 'Mirador más famoso', 'Celebración final']
    }
  ];

  const planningPhases = [
    {
      phase: 1,
      title: '6+ MESES ANTES: DECISIÓN Y RESERVAS CRÍTICAS',
      subtitle: '⚠️ ETAPA MÁS IMPORTANTE - Sin esto NO hay viaje',
      color: 'from-red-500 to-pink-500',
      urgency: 'CRÍTICO',
      tasks: [
        { category: 'ACCIONES INMEDIATAS', items: ['Decidir fechas exactas del viaje', 'Elegir tipo alojamiento (camping/refugio)'] },
        { category: 'RESERVAS OBLIGATORIAS', items: ['pasesparques.cl - Entrada parque', 'lastorres.com + vertice.travel'] },
        { category: 'PRESUPUESTO', items: ['Definir presupuesto total', 'Apartar dinero para depósitos'] },
        { category: '⚠️ URGENTE', items: ['Refugios se agotan RÁPIDO', 'Temporada alta = 6+ meses'] }
      ]
    },
    {
      phase: 2,
      title: '4-5 MESES ANTES: TRANSPORTE Y PREPARACIÓN FÍSICA',
      subtitle: '✈️ Confirmar reservas y comenzar entrenamiento',
      color: 'from-orange-500 to-red-500',
      urgency: 'ALTO',
      tasks: [
        { category: '✈️ TRANSPORTE', items: ['Reservar vuelos Santiago→Pto.Natales', 'skyairline.com, latam.com'] },
        { category: '🏨 HOSPEDAJE', items: ['Hotel Puerto Natales (2 noches)', 'Confirmar reservas refugios'] },
        { category: '🏃 ENTRENAMIENTO', items: ['Iniciar plan entrenamiento 16 semanas', 'Caminatas con peso 10+ kg'] },
        { category: '🛡️ SEGURO', items: ['Contratar seguro viaje', '⚠️ Cobertura deportes extremos'] }
      ]
    },
    {
      phase: 3,
      title: '3 MESES ANTES: EQUIPAMIENTO Y DOCUMENTOS',
      subtitle: '🎒 Conseguir y probar todo el equipo necesario',
      color: 'from-green-500 to-teal-500',
      urgency: 'MEDIO',
      tasks: [
        { category: '🎒 EQUIPOS', items: ['Comprar/alquilar carpa 4 estaciones', 'Saco dormir -10°C mínimo'] },
        { category: '👕 ROPA', items: ['Sistema 3 capas completo', 'Botas trekking impermeables'] },
        { category: '📄 DOCUMENTOS', items: ['Verificar vigencia pasaporte', 'Vacunas (si es necesario)'] },
        { category: '🧪 PRUEBAS', items: ['Probar carpa en casa', 'Test peso mochila completa'] }
      ]
    },
    {
      phase: 4,
      title: '2 MESES ANTES: FINALIZACIÓN Y CONFIRMACIONES',
      subtitle: '✅ Confirmar todo y ultimar detalles',
      color: 'from-blue-500 to-cyan-500',
      urgency: 'MEDIO',
      tasks: [
        { category: '✅ CONFIRMACIONES', items: ['Confirmar todas las reservas', 'Llamar refugios/aerolíneas'] },
        { category: '🎒 EQUIPOS FINALES', items: ['Completar equipos faltantes', 'Reparar equipos dañados'] },
        { category: '🍽️ COMIDA', items: ['Planificar menús completos', 'Lista compras Puerto Natales'] },
        { category: '💰 FINANZAS', items: ['Conseguir efectivo USD/CLP', 'Avisar banco viajes'] }
      ]
    },
    {
      phase: 5,
      title: '1 MES ANTES: ENTRENAMIENTO INTENSIVO',
      subtitle: '💪 Preparación física final y detalles menores',
      color: 'from-purple-500 to-pink-500',
      urgency: 'ALTO',
      tasks: [
        { category: '💪 ENTRENAMIENTO', items: ['Caminatas largas 8+ horas', 'Peso completo 18+ kg'] },
        { category: '🏥 SALUD', items: ['Chequeo médico final', 'Medicamentos personales'] },
        { category: '🌤️ CLIMA', items: ['Monitorear pronósticos', 'Plan B fechas alternativas'] },
        { category: '📋 LISTAS', items: ['Lista final equipaje', 'Checklist completa'] }
      ]
    }
  ];

  const gearList = {
    capaBase: [
      '2x Camisetas térmicas lana merino',
      '2x Camisetas manga corta técnicas', 
      '3x Ropa interior térmica',
      '4x Calcetines trekking lana',
      '1x Calzoncillos/bragas extra'
    ],
    capaIntermedia: [
      '1x Fleece o soft shell capucha',
      '1x Chaleco plumas ultraliviano',
      '1x Polar grueso campamento',
      '1x Chaqueta térmica extra'
    ],
    capaExterior: [
      '1x Chaqueta impermeable',
      '1x Pantalón impermeable',
      '1x Poncho lluvia emergencia',
      '2x Pantalones trekking',
      '1x Short técnico'
    ],
    extremidades: [
      '2x Gorros térmicos',
      '1x Gorro visera para sol',
      '1x Buff o cuello polar',
      '2x Guantes impermeables'
    ],
    calzado: [
      'Botas trekking impermeables',
      'Zapatillas campamento',
      'Polainas impermeables',
      'Crampones (sept-abril)'
    ],
    accesorios: [
      'Gafas sol categoría 4',
      'Protector solar SPF 50+',
      'Bálsamo labial UV',
      'Repelente DEET 30%+'
    ]
  };

  const dailyMenu = {
    'dias1-2': {
      title: 'Serón → Dickson',
      desayuno: 'Avena + frutos secos',
      almuerzo: 'Sándwich + barrita',
      cena: 'Pasta liofilizada',
      bebidas: 'Café, té, chocolate',
      agua: '3-4 litros/día'
    },
    'dias3-4': {
      title: 'Los Perros → Grey',
      desayuno: 'Granola energética',
      almuerzo: 'Frutos secos + queso',
      cena: 'Estofado liofilizado',
      extra: 'Bebida isotónica',
      chocolate: 'Energía extra'
    },
    'dias5-6': {
      title: 'Paine Grande → Cuernos',
      desayuno: 'Pancakes instantáneos',
      almuerzo: 'Wrap + atún',
      cena: 'Arroz con pollo',
      snack: 'Queso + galletas',
      fruta: 'Deshidratada'
    },
    'dias7-8': {
      title: 'Chileno → Las Torres',
      desayuno: 'Barras energéticas',
      almuerzo: 'Trail mix premium',
      cena: 'Celebración en refugio',
      final: 'GRAN CELEBRACIÓN'
    }
  };

  const transportOptions = {
    economica: { name: 'ECONÓMICA', method: 'Bus Santiago→Pto.Natales', cost: '$190-360 USD', time: '28 horas' },
    intermedia: { name: 'INTERMEDIA', method: 'Vuelo Stgo→Punta Arenas + Bus', cost: '$90-180 USD', time: '6 horas total' },
    premium: { name: 'PREMIUM', method: 'Vuelo directo Stgo→Pto.Natales', cost: '$57-120 USD', time: '3h 15min' }
  };

  const emergencyInfo = {
    conaf: '+56 61 2691931',
    hospital: '+56 61 2411583',
    carabineros: '+56 61 2411023',
    emergencias: '131',
    rescueCost: '$2,000-5,000 USD',
    coverage: 'Sin señal: 80% del circuito'
  };

  const budgetBreakdown = {
    mochilero: {
      transporte: 250,
      alojamiento: 280,
      entrada: 56,
      comida: 100,
      equipos: 150,
      seguro: 50,
      total: '$600-900'
    },
    standard: {
      transporte: 150,
      alojamiento: 500,
      entrada: 56,
      comida: 250,
      equipos: 200,
      seguro: 75,
      total: '$1000-1500'
    },
    premium: {
      transporte: 120,
      alojamiento: 800,
      entrada: 56,
      comida: 400,
      equipos: 300,
      seguro: 100,
      total: '$1800-2500'
    }
  };

  // Interactive Map Component
  const InteractiveMap = () => (
    <div className="relative h-96 bg-gradient-to-br from-green-700 via-blue-700 to-purple-700 rounded-xl overflow-hidden border border-white/20">
      <div className="absolute inset-0 bg-black/20"></div>
      
      {/* Map Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="text-center text-white">
            <div className="text-sm font-bold bg-blue-600/80 px-3 py-1 rounded-full mb-2">LAGO NORDENSKJÖLD</div>
          </div>
        </div>
        
        <div className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2">
          <div className="text-center text-white">
            <div className="text-sm font-bold bg-cyan-600/80 px-3 py-1 rounded-full mb-2">LAGO GREY</div>
          </div>
        </div>
      </div>
      
      {/* Circuit Trail */}
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
        <path
          d="M 100 150 Q 150 100 200 120 Q 250 140 300 120 Q 350 100 320 160 Q 290 220 240 200 Q 190 180 140 200 Q 90 220 100 150"
          stroke="#ef4444"
          strokeWidth="3"
          strokeDasharray="5,5"
          fill="none"
          className="animate-pulse"
        />
      </svg>
      
      {/* Day Points */}
      {circuitDays.map((day, index) => {
        const positions = [
          { x: '25%', y: '50%' }, // Serón
          { x: '35%', y: '30%' }, // Dickson  
          { x: '50%', y: '25%' }, // Los Perros
          { x: '65%', y: '20%' }, // Gardner/Grey
          { x: '75%', y: '40%' }, // Paine Grande
          { x: '70%', y: '65%' }, // Cuernos
          { x: '50%', y: '75%' }, // Chileno
          { x: '30%', y: '80%' }  // Torres
        ];
        
        return (
          <button
            key={day.day}
            onClick={() => setCurrentDay(day.day)}
            className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
              currentDay === day.day 
                ? 'scale-125 z-20' 
                : 'hover:scale-110 z-10'
            }`}
            style={{ left: positions[index].x, top: positions[index].y }}
          >
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
              currentDay === day.day
                ? 'bg-red-500 border-red-300 text-white shadow-lg'
                : 'bg-white/80 border-white text-gray-800 hover:bg-white'
            }`}>
              {day.day}
            </div>
            <div className={`mt-1 text-xs font-medium text-center px-2 py-1 rounded ${
              currentDay === day.day
                ? 'bg-red-500/90 text-white'
                : 'bg-black/60 text-white'
            }`}>
              {day.location}
            </div>
          </button>
        );
      })}
      
      {/* Current Location Indicator */}
      {currentLocation && (
        <div className="absolute top-4 right-4 bg-green-500/90 text-white px-3 py-2 rounded-lg text-sm">
          <div className="flex items-center space-x-2">
            <Navigation className="w-4 h-4" />
            <span>Tu ubicación</span>
          </div>
        </div>
      )}
    </div>
  );

  // Detailed Day Info Component
  const DayDetails = ({ day }) => {
    const dayData = circuitDays[day - 1];
    
    return (
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">
              Día {day}: {dayData.location}
            </h3>
            <p className="text-lg text-blue-200 mb-2">{dayData.highlight}</p>
            <div className="flex items-center space-x-4 text-sm text-gray-300">
              <span>📏 {dayData.distance}</span>
              <span>⏱️ {dayData.walkingTime}</span>
              <span>📍 {dayData.altitude}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="flex">
              {[1,2,3,4,5].map(star => (
                <Star 
                  key={star}
                  className={`w-5 h-5 ${
                    star <= dayData.difficulty 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm text-gray-300 mt-1">Dificultad {dayData.difficulty}/5</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-semibold text-blue-300 mb-3">🏠 Servicios Disponibles</h4>
            <div className="space-y-2">
              {dayData.services.map(service => (
                <div key={service} className="flex items-center space-x-2 text-sm text-gray-300">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span className="capitalize">{service}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-300 mb-3">💡 Consejos del Día</h4>
            <div className="space-y-2">
              {dayData.tips.map((tip, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm text-gray-300">
                  <span className="text-yellow-400 mt-0.5">•</span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-blue-300 mb-3">🌤️ Condiciones</h4>
            <div className="space-y-2 text-sm text-gray-300">
              <p><strong>Clima:</strong> {dayData.weather}</p>
              <p><strong>Tiempo caminata:</strong> {dayData.walkingTime}</p>
              <p><strong>Altitud máxima:</strong> {dayData.altitude}</p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Planning Phase Component
  const PlanningPhaseView = () => {
    const currentPhase = planningPhases[planningPhase - 1];
    
    return (
      <div className="space-y-6">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">{currentPhase.title}</h2>
              <p className="text-gray-300 mt-1">{currentPhase.subtitle}</p>
            </div>
            <div className="flex space-x-2">
              {planningPhases.map((phase, index) => (
                <button
                  key={phase.phase}
                  onClick={() => setPlanningPhase(phase.phase)}
                  className={`w-10 h-10 rounded-full border-2 font-bold transition-all duration-300 ${
                    planningPhase === phase.phase
                      ? 'bg-blue-500 border-blue-400 text-white'
                      : 'border-white/30 text-gray-400 hover:border-blue-400'
                  }`}
                >
                  {phase.phase}
                </button>
              ))}
            </div>
          </div>
          
          <div className={`bg-gradient-to-r ${currentPhase.color} rounded-xl p-1 mb-6`}>
            <div className="bg-black/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">URGENCIA: {currentPhase.urgency}</span>
                <span className="text-white">Fase {planningPhase} de {planningPhases.length}</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {currentPhase.tasks.map((taskGroup, index) => (
              <div key={index} className="bg-white/10 rounded-xl p-4">
                <h3 className="font-bold text-white mb-3">{taskGroup.category}</h3>
                <div className="space-y-2">
                  {taskGroup.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-2">
                      <span className="text-blue-400 mt-1">•</span>
                      <span className="text-gray-300 text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPlanningPhase(Math.max(1, planningPhase - 1))}
              disabled={planningPhase === 1}
              className="px-6 py-2 bg-gray-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500 transition-all duration-300"
            >
              ← Anterior
            </button>
            <span className="text-gray-300">
              {planningPhase} / {planningPhases.length}
            </span>
            <button
              onClick={() => setPlanningPhase(Math.min(planningPhases.length, planningPhase + 1))}
              disabled={planningPhase === planningPhases.length}
              className="px-6 py-2 bg-blue-600 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-500 transition-all duration-300"
            >
              Siguiente →
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Complete Gear List Component
  const GearListView = () => (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">📋 Lista Completa de Equipamiento</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(gearList).map(([category, items]) => (
            <div key={category} className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold text-white mb-3 capitalize flex items-center">
                {category === 'capaBase' && <span className="mr-2">🏔️</span>}
                {category === 'capaIntermedia' && <span className="mr-2">🧥</span>}
                {category === 'capaExterior' && <span className="mr-2">🌧️</span>}
                {category === 'extremidades' && <span className="mr-2">🧤</span>}
                {category === 'calzado' && <span className="mr-2">👢</span>}
                {category === 'accesorios' && <span className="mr-2">🕶️</span>}
                {category.replace(/([A-Z])/g, ' $1').toLowerCase()}
              </h3>
              <div className="space-y-2">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <input 
                      type="checkbox" 
                      className="mt-1 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-gray-300 text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-orange-500/20 to-red-500/20 rounded-xl p-6 border border-orange-400/30">
          <h3 className="text-xl font-bold text-white mb-4">⚠️ EQUIPOS CRÍTICOS</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-orange-300 mb-2">OBLIGATORIOS</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• Carpa 4 estaciones</li>
                <li>• Saco dormir -10°C mínimo</li>
                <li>• Botas impermeables</li>
                <li>• Crampones (abril-septiembre)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-orange-300 mb-2">RECOMENDADOS</h4>
              <ul className="space-y-1 text-gray-300 text-sm">
                <li>• GPS satelital</li>
                <li>• Power bank solar</li>
                <li>• Botiquín completo</li>
                <li>• Silbato emergencia</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Budget Calculator Component
  const BudgetCalculator = () => (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">💰 Calculadora de Presupuesto Detallada</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {Object.entries(budgetBreakdown).map(([level, costs]) => (
            <div key={level} className={`rounded-xl p-6 border-2 transition-all duration-300 ${
              selectedDifficulty === level 
                ? 'border-blue-400 bg-blue-500/20' 
                : 'border-white/20 bg-white/5 hover:border-white/40'
            }`}>
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white capitalize">{level}</h3>
                <p className="text-2xl font-bold text-blue-400 mt-2">{costs.total}</p>
              </div>
              
              <div className="space-y-3">
                {Object.entries(costs).filter(([key]) => key !== 'total').map(([category, cost]) => (
                  <div key={category} className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-300 capitalize">{category}:</span>
                    <span className="text-white font-medium">${cost}</span>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setSelectedDifficulty(level)}
                className={`w-full mt-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                  selectedDifficulty === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                }`}
              >
                Seleccionar {level}
              </button>
            </div>
          ))}
        </div>
        
        <div className="mt-8 bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-400/30">
          <h3 className="text-xl font-bold text-white mb-4">📊 Cronograma de Pagos</h3>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { time: '6 meses antes', amount: '$300-400', items: 'Depósitos + entrada' },
              { time: '4 meses antes', amount: '$400-900', items: 'Vuelos + equipos' },
              { time: '2 meses antes', amount: '$600-800', items: 'Saldo refugios + ropa' },
              { time: '1 semana antes', amount: '$450', items: 'Efectivo + comida' },
              { time: 'Durante viaje', amount: '$200', items: 'Extras + souvenirs' }
            ].map((payment, index) => (
              <div key={index} className="bg-white/10 rounded-lg p-4 text-center">
                <p className="text-sm text-gray-300 mb-1">{payment.time}</p>
                <p className="text-lg font-bold text-green-400 mb-2">{payment.amount}</p>
                <p className="text-xs text-gray-400">{payment.items}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  // Daily Menu Component
  const MenuView = () => (
    <div className="space-y-6">
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">🍽️ Menú Diario Completo</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Object.entries(dailyMenu).map(([period, menu]) => (
            <div key={period} className="bg-white/10 rounded-xl p-4">
              <h3 className="font-bold text-white mb-3">{menu.title}</h3>
              <div className="space-y-2">
                {Object.entries(menu).filter(([key]) => key !== 'title').map(([meal, food]) => (
                  <div key={meal} className="flex justify-between items-center py-1">
                    <span className="text-gray-300 capitalize">{meal}:</span>
                    <span className="text-white text-sm">{food}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
            <h3 className="font-bold text-red-300 mb-3">🆘 Provisiones Emergencia</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• 2 días comida extra</li>
              <li>• Barras energéticas extra</li>
              <li>• Chocolate alto en calorías</li>
              <li>• Sopa instantánea</li>
            </ul>
          </div>
          
          <div className="bg-green-500/10 rounded-xl p-4 border border-green-500/30">
            <h3 className="font-bold text-green-300 mb-3">💊 Suplementos</h3>
            <ul className="space-y-1 text-gray-300 text-sm">
              <li>• Sal, pimienta, ajo en polvo</li>
              <li>• Aceite oliva pequeño</li>
              <li>• Multivitamínicos</li>
              <li>• Electrolitos en polvo</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Status Bar */}
      <div className="flex justify-between items-center px-4 py-2 bg-black/50 text-white text-sm">
        <div className="flex items-center space-x-2">
          <span>{new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })}</span>
          {isOffline ? <WifiOff className="w-4 h-4 text-red-400" /> : <Wifi className="w-4 h-4 text-green-400" />}
        </div>
        <div className="flex items-center space-x-2">
          <Signal className="w-4 h-4 text-gray-400" />
          <Battery className="w-4 h-4 text-green-400" />
          <span>{deviceInfo.battery}%</span>
        </div>
      </div>

      {/* Emergency Mode */}
      {emergencyMode && (
        <div className="fixed inset-0 z-50 bg-red-900/95 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-red-500 rounded-2xl p-8 max-w-md w-full text-center border-2 border-red-400">
            <AlertTriangle className="w-16 h-16 text-white mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">MODO EMERGENCIA</h2>
            <div className="space-y-3 text-white text-lg">
              <p><strong>CONAF Rescate:</strong><br/>{emergencyInfo.conaf}</p>
              <p><strong>Hospital:</strong><br/>{emergencyInfo.hospital}</p>
              <p><strong>Emergencias:</strong><br/>{emergencyInfo.emergencias}</p>
              <p className="text-sm text-red-100 mt-4">Costo rescate: {emergencyInfo.rescueCost}</p>
            </div>
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => window.open(`tel:${emergencyInfo.conaf}`)}
                className="flex-1 py-3 bg-white text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all duration-300"
              >
                <Phone className="w-5 h-5 mx-auto mb-1" />
                Llamar Rescate
              </button>
              <button
                onClick={() => setEmergencyMode(false)}
                className="px-6 py-3 bg-red-700 text-white rounded-xl font-bold hover:bg-red-800 transition-all duration-300"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/10 z-30">
        <div className="flex justify-around items-center py-2">
          {[
            { id: 'dashboard', icon: Home, label: 'Inicio' },
            { id: 'map', icon: Map, label: 'Mapa' },
            { id: 'planning', icon: Calendar, label: 'Plan' },
            { id: 'gear', icon: Backpack, label: 'Equipos' },
            { id: 'budget', icon: DollarSign, label: 'Presupuesto' },
            { id: 'menu', icon: Utensils, label: 'Menú' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-300 ${
                activeView === item.id 
                  ? 'text-blue-400 bg-blue-500/20' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 pb-20">
        {activeView === 'dashboard' && (
          <div className="space-y-6">
            {/* Hero Stats */}
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-white mb-2">Torres del Paine</h1>
                <p className="text-blue-200">Circuito O - Guía Completa 2025</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">{circuitData.totalDistance}km</div>
                  <div className="text-sm text-gray-300">Distancia Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{circuitData.totalDays}</div>
                  <div className="text-sm text-gray-300">Días</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">{circuitData.walkingHours}h</div>
                  <div className="text-sm text-gray-300">Caminata</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-400">{circuitData.highestPoint}</div>
                  <div className="text-sm text-gray-300">Punto Máximo</div>
                </div>
              </div>
            </div>

            {/* Weather Widget */}
            <div className="bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl p-4 border border-blue-400/30">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <Thermometer className="w-5 h-5 text-blue-300" />
                    <span className="text-xl font-bold text-white">{weather.temp}°C</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Wind className="w-4 h-4 text-gray-300" />
                    <span className="text-sm text-gray-300">{weather.wind} km/h</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl mb-1">💨</div>
                  <span className="text-xs text-blue-200">Tiempo actual</span>
                </div>
              </div>
            </div>

            {/* Current Day Info */}
            <DayDetails day={currentDay} />
          </div>
        )}
        
        {activeView === 'map' && (
          <div className="space-y-6">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-4">🗺️ Mapa Interactivo del Circuito</h2>
              <InteractiveMap />
              
              {/* Day selector */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 mt-6">
                {circuitDays.map(day => (
                  <button
                    key={day.day}
                    onClick={() => setCurrentDay(day.day)}
                    className={`p-2 rounded-lg text-center transition-all duration-300 ${
                      currentDay === day.day
                        ? 'bg-blue-500 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    <div className="font-bold">D{day.day}</div>
                    <div className="text-xs">{day.location}</div>
                  </button>
                ))}
              </div>
            </div>
            
            <DayDetails day={currentDay} />
          </div>
        )}
        
        {activeView === 'planning' && <PlanningPhaseView />}
        {activeView === 'gear' && <GearListView />}
        {activeView === 'budget' && <BudgetCalculator />}
        {activeView === 'menu' && <MenuView />}
      </main>

      {/* Emergency Button */}
      <button
        onClick={() => setEmergencyMode(!emergencyMode)}
        className="fixed bottom-20 right-4 z-50 w-16 h-16 bg-red-600 rounded-full shadow-lg border-2 border-red-500 hover:bg-red-500 transition-all duration-300"
      >
        <AlertTriangle className="w-8 h-8 text-white mx-auto" />
      </button>
    </div>
  );
};

export default TorresPaineCompleteApp;