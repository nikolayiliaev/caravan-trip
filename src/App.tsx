import { useState } from 'react'
import itineraryData from './data/itinerary.json'
import bookingsData from './data/bookings.json'
import caravanData from './data/caravan.json'
import shoppingData from './data/shopping.json'
import weatherBackupData from './data/weather-backup.json'
import dailyPlansData from './data/daily-plans.json'

type View = 'home' | 'itinerary' | 'bookings' | 'shopping' | 'caravan' | 'weather' | 'flight' | 'day-detail' | 'add-day' | 'edit-day'

interface ScheduleItem {
  time: string
  activity: string
  description: string
  transport?: string
  food?: string
  notes?: string
  linkName?: string
  linkUrl?: string
}

interface CustomLink {
  type: string
  url: string
}

interface CustomDay {
  day: number
  date: string
  title: string
  accommodation: string
  recommendedFood: string
  weatherBackup: string
  areaDescription: string
  schedule: ScheduleItem[]
  mapUrl?: string
  links: CustomLink[]
}

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [customDays, setCustomDays] = useState<CustomDay[]>(() => {
    const saved = localStorage.getItem('custom-days')
    return saved ? JSON.parse(saved) : []
  })
  const [editingDay, setEditingDay] = useState<CustomDay | null>(null)

  const saveCustomDay = (day: CustomDay) => {
    const updated = [...customDays.filter(d => d.day !== day.day), day].sort((a, b) => a.day - b.day)
    setCustomDays(updated)
    localStorage.setItem('custom-days', JSON.stringify(updated))
    setCurrentView('itinerary')
  }

  const deleteCustomDay = (dayNum: number) => {
    const updated = customDays.filter(d => d.day !== dayNum)
    setCustomDays(updated)
    localStorage.setItem('custom-days', JSON.stringify(updated))
    setCurrentView('itinerary')
  }
  
  const minSwipeDistance = 50
  
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }
  
  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }
  
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchEnd - touchStart
    if (distance > minSwipeDistance && currentView !== 'home') {
      if (currentView === 'day-detail') {
        setCurrentView('itinerary')
      } else {
        setCurrentView('home')
      }
    }
  }

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} />
      case 'itinerary':
        return (
          <ItineraryView 
            onSelectDay={(day) => { setSelectedDay(day); setCurrentView('day-detail') }} 
            onAddDay={() => setCurrentView('add-day')}
            customDays={customDays}
          />
        )
      case 'bookings':
        return <BookingsView />
      case 'shopping':
        return <ShoppingView />
      case 'caravan':
        return <CaravanView />
      case 'weather':
        return <WeatherView />
      case 'flight':
        return <FlightView />
      case 'add-day':
        return <DayFormView onSave={saveCustomDay} onCancel={() => setCurrentView('itinerary')} />
      case 'edit-day':
        return (
          <DayFormView 
            onSave={saveCustomDay} 
            onCancel={() => setCurrentView('day-detail')} 
            onDelete={deleteCustomDay}
            editDay={editingDay} 
          />
        )
      case 'day-detail':
        return (
          <DayDetailView 
            day={selectedDay} 
            onBack={() => setCurrentView('itinerary')} 
            customDays={customDays}
            onEdit={(day) => { setEditingDay(day); setCurrentView('edit-day') }}
          />
        )
      default:
        return <HomeView onNavigate={setCurrentView} />
    }
  }

  return (
    <div 
      dir="rtl" 
      className="app-bg"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <main className="pb-10">
        {renderView()}
      </main>
    </div>
  )
}

interface HomeViewProps {
  onNavigate: (view: View) => void
}

function HomeView({ onNavigate }: HomeViewProps) {
  const today = new Date()
  const tripStart = new Date('2026-09-13')
  const daysUntilTrip = Math.ceil((tripStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <div className="max-w-2xl mx-auto px-5 py-8">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="header-title mb-3">{itineraryData.trip.title}</h1>
        <p className="text-gray-500 text-lg mb-5">{itineraryData.trip.dates}</p>
        {daysUntilTrip > 0 && (
          <div className="badge-blue text-base px-6 py-2">
            🎉 עוד {daysUntilTrip} ימים!
          </div>
        )}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 mb-12">
        <button onClick={() => onNavigate('itinerary')} className="menu-card menu-card-blue">
          <div className="text-4xl mb-2">📅</div>
          <div className="font-bold text-xl">מסלול</div>
        </button>
        <button onClick={() => onNavigate('bookings')} className="menu-card menu-card-green">
          <div className="text-4xl mb-2">📋</div>
          <div className="font-bold text-xl">הזמנות</div>
        </button>
        <button onClick={() => onNavigate('shopping')} className="menu-card menu-card-orange">
          <div className="text-4xl mb-2">🛒</div>
          <div className="font-bold text-xl">קניות</div>
        </button>
        <button onClick={() => onNavigate('caravan')} className="menu-card menu-card-purple">
          <div className="text-4xl mb-2">🚐</div>
          <div className="font-bold text-xl">קראוון</div>
        </button>
        <button onClick={() => onNavigate('weather')} className="menu-card menu-card-gray">
          <div className="text-4xl mb-2">🌧️</div>
          <div className="font-bold text-xl">גשם</div>
        </button>
        <button onClick={() => onNavigate('flight')} className="menu-card menu-card-pink">
          <div className="text-4xl mb-2">✈️</div>
          <div className="font-bold text-xl">טיסה</div>
        </button>
      </div>

    </div>
  )
}

interface ItineraryViewProps {
  onSelectDay: (day: number) => void
  onAddDay: () => void
  customDays: CustomDay[]
}

function ItineraryView({ onSelectDay, onAddDay, customDays }: ItineraryViewProps) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-6">📅 מסלול הטיול</h1>
      
      <div className="text-center mb-6">
        <button 
          onClick={onAddDay}
          className="badge-green px-6 py-3 text-base font-bold"
        >
          ➕ הוסף יום חדש
        </button>
      </div>

      <div className="space-y-6 flex flex-col items-center">
        {itineraryData.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => onSelectDay(day.dayNumber)}
            className="card p-5 w-full max-w-md text-right"
          >
            <div className="text-center mb-3">
              <span className="badge-purple">יום {day.dayNumber}</span>
            </div>
            <div className="text-gray-400 text-sm mb-3">{day.date} • {day.dayOfWeek}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{day.area}</h3>
            <p className="text-gray-600 mb-3">{day.mainActivity}</p>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-gray-500 text-sm">🏕️ {day.accommodation}</span>
              {day.drivingHours > 0 && (
                <span className="badge-light text-sm">🚗 {day.drivingHours} שעות</span>
              )}
            </div>
          </button>
        ))}
        
        {/* Custom Days */}
        {customDays.map((day) => (
          <button
            key={`custom-${day.day}`}
            onClick={() => onSelectDay(day.day)}
            className="card p-5 w-full max-w-md text-right border-2 border-green-400"
          >
            <div className="text-center mb-3">
              <span className="badge-green">יום {day.day} (מותאם)</span>
            </div>
            <div className="text-gray-400 text-sm mb-3">{day.date}</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{day.title}</h3>
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <span className="text-gray-500 text-sm">🏕️ {day.accommodation}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function BookingsView() {
  const [completedIds, setCompletedIds] = useState<number[]>(() => {
    const saved = localStorage.getItem('bookings-completed')
    return saved ? JSON.parse(saved) : []
  })
  
  const toggleCompleted = (id: number) => {
    const newCompletedIds = completedIds.includes(id) 
      ? completedIds.filter(i => i !== id)
      : [...completedIds, id]
    setCompletedIds(newCompletedIds)
    localStorage.setItem('bookings-completed', JSON.stringify(newCompletedIds))
  }
  
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">📋 הזמנות</h1>
      <div className="space-y-6">
        {bookingsData.bookings.map((booking) => {
          const isCompleted = completedIds.includes(booking.id)
          return (
            <div
              key={booking.id}
              onClick={() => toggleCompleted(booking.id)}
              className={`card p-5 cursor-pointer ${isCompleted ? 'opacity-50' : ''}`}
            >
              <div className="text-center mb-4">
                <span className={`${booking.priority === 'high' ? 'badge-red' : 'badge-orange'}`}>
                  {booking.dates}
                </span>
              </div>
              <h3 className={`font-bold text-gray-800 text-lg mb-3 text-center ${isCompleted ? 'line-through' : ''}`}>
                {booking.item}
              </h3>
              <p className="text-gray-600 text-sm mb-4 text-center">{booking.description}</p>
              {booking.notes && (
                <div className="info-box info-box-blue text-sm text-gray-600 mb-4">
                  💡 {booking.notes}
                </div>
              )}
              <div className="text-center">
                <a
                  href={booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-blue-600 hover:text-blue-800 underline text-sm"
                >
                  🔗 {booking.item}
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ShoppingView() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">🛒 קניות</h1>
      
      <div className="card p-6 mb-8 text-center">
        <h3 className="font-bold text-gray-800 text-lg mb-2">{shoppingData.shopping.mainStore.name}</h3>
        <p className="text-gray-500 text-sm mb-5">{shoppingData.shopping.mainStore.when}</p>
        <a
          href={shoppingData.shopping.mainStore.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          🗺️ פתח מפה
        </a>
      </div>

      <div className="space-y-6">
        {shoppingData.shopping.categories.map((category, idx) => (
          <div key={idx} className="card p-5 text-center">
            {category.rebuy && (
              <div className="mb-3">
                <span className="badge-green text-xs">לקנות שוב</span>
              </div>
            )}
            <h3 className="font-bold text-gray-800 text-lg mb-3">{category.name}</h3>
            <p className="text-gray-600 text-sm mb-4">{category.items}</p>
            <div className="flex flex-wrap justify-center gap-4 text-xs mt-4">
              <span className="badge-light px-4 py-2">📦 {category.quantity}</span>
              <span className="badge-light px-4 py-2">🍽️ {category.usage}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function CaravanView() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">🚐 קראוון</h1>
      
      {/* Vehicle Info */}
      <div className="card p-6 mb-6 text-center">
        <h2 className="font-bold text-gray-800 text-lg mb-5">פרטי הרכב</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="menu-card-blue rounded-xl p-4 text-center">
            <div className="text-xs opacity-80 mb-1">דגם</div>
            <div className="font-bold">{caravanData.caravan.model}</div>
          </div>
          <div className="menu-card-pink rounded-xl p-4 text-center">
            <div className="text-xs opacity-80 mb-1">גובה</div>
            <div className="font-bold">{caravanData.caravan.height}</div>
          </div>
          <div className="menu-card-green rounded-xl p-4 text-center">
            <div className="text-xs opacity-80 mb-1">אורך</div>
            <div className="font-bold">{caravanData.caravan.length}</div>
          </div>
          <div className="menu-card-orange rounded-xl p-4 text-center">
            <div className="text-xs opacity-80 mb-1">משקל</div>
            <div className="font-bold">{caravanData.caravan.weight}</div>
          </div>
        </div>
      </div>

      {/* Important */}
      <div className="space-y-4 mb-6">
        {caravanData.caravan.important.map((item, idx) => (
          <div
            key={idx}
            className={`card p-5 text-center border-r-4 ${item.priority === 'critical' ? 'border-red-500' : 'border-amber-500'}`}
          >
            <h3 className="font-bold text-gray-800 mb-3">{item.title}</h3>
            <p className="text-gray-600">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Tolls & Fuel */}
      <div className="space-y-4">
        <div className="card p-5 text-center">
          <h3 className="font-bold text-gray-800 mb-3">🛣️ אגרות</h3>
          <p className="text-gray-600 mb-4">{caravanData.tolls.austria.notes}</p>
          <a href={caravanData.tolls.austria.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
            🔗 קנה וינייטה
          </a>
        </div>
        <div className="card p-5 text-center">
          <h3 className="font-bold text-gray-800 mb-3">⛽ דלק</h3>
          <p className="text-gray-600 mb-4">📍 {caravanData.fuel.lastDay.location}</p>
          <a href={caravanData.fuel.lastDay.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
            🔗 מיקום
          </a>
        </div>
      </div>
    </div>
  )
}

function WeatherView() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">🌧️ תוכניות גשם</h1>
      <div className="space-y-6">
        {weatherBackupData.weatherBackup.map((plan, idx) => (
          <div key={idx} className="card p-6 text-center">
            <h3 className="text-xl font-bold text-gray-800 mb-5">{plan.area}</h3>
            <div className="space-y-4">
              <div className="info-box info-box-orange text-right">
                <span className="font-bold">☀️ ראשית:</span> {plan.mainPlan}
              </div>
              <div className="info-box info-box-blue text-right">
                <span className="font-bold">🌦️ Plan B:</span> {plan.planB}
              </div>
              <div className="info-box info-box-purple text-right">
                <span className="font-bold">🌧️ Plan C:</span> {plan.planC}
              </div>
              <div className="info-box info-box-red text-right">
                <span className="font-bold">⚠️ לא לעשות:</span> {plan.dontDo}
              </div>
            </div>
            {plan.url && (
              <div className="mt-5">
                <a href={plan.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">
                  🔗 מידע נוסף
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

function FlightView() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">✈️ פרטי טיסה</h1>
      
      {/* Outbound Flight */}
      <div className="card p-5 mb-6">
        <div className="text-center mb-4">
          <span className="badge-blue px-4 py-2">טיסה הלוך</span>
        </div>
        <div className="space-y-4">
          <div className="info-box info-box-blue">
            <div className="flex justify-between items-center">
              <span className="font-bold">📅 תאריך</span>
              <span>13/09/2026</span>
            </div>
          </div>
          <div className="info-box info-box-purple">
            <div className="flex justify-between items-center">
              <span className="font-bold">🛫 המראה</span>
              <span>TLV → PRG</span>
            </div>
          </div>
          <div className="info-box info-box-green">
            <div className="flex justify-between items-center">
              <span className="font-bold">⏰ שעת המראה</span>
              <span>06:00</span>
            </div>
          </div>
          <div className="info-box info-box-orange">
            <div className="flex justify-between items-center">
              <span className="font-bold">⏰ שעת נחיתה</span>
              <span>10:00 (שעון מקומי)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Return Flight */}
      <div className="card p-5 mb-6">
        <div className="text-center mb-4">
          <span className="badge-orange px-4 py-2">טיסה חזור</span>
        </div>
        <div className="space-y-4">
          <div className="info-box info-box-blue">
            <div className="flex justify-between items-center">
              <span className="font-bold">📅 תאריך</span>
              <span>22/09/2026</span>
            </div>
          </div>
          <div className="info-box info-box-purple">
            <div className="flex justify-between items-center">
              <span className="font-bold">🛬 נחיתה</span>
              <span>PRG → TLV</span>
            </div>
          </div>
          <div className="info-box info-box-green">
            <div className="flex justify-between items-center">
              <span className="font-bold">⏰ שעת המראה</span>
              <span>14:00</span>
            </div>
          </div>
          <div className="info-box info-box-orange">
            <div className="flex justify-between items-center">
              <span className="font-bold">⏰ שעת נחיתה</span>
              <span>19:00 (שעון ישראל)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Important Notes */}
      <div className="card p-5">
        <h2 className="font-bold text-gray-800 mb-4 text-center">📝 הערות חשובות</h2>
        <div className="space-y-3">
          <div className="info-box info-box-red">
            <span className="font-bold">⚠️ להגיע לשדה 3 שעות לפני</span>
          </div>
          <div className="info-box info-box-blue">
            <span>📄 לוודא דרכונים בתוקף</span>
          </div>
          <div className="info-box info-box-green">
            <span>🧳 משקל מזוודה: עד 23 ק״ג</span>
          </div>
        </div>
      </div>
    </div>
  )
}

interface DayFormViewProps {
  onSave: (day: CustomDay) => void
  onCancel: () => void
  onDelete?: (dayNum: number) => void
  editDay?: CustomDay | null
}

function DayFormView({ onSave, onCancel, onDelete, editDay }: DayFormViewProps) {
  const [dayNumber, setDayNumber] = useState(editDay?.day || 11)
  const [date, setDate] = useState(editDay?.date || '')
  const [title, setTitle] = useState(editDay?.title || '')
  const [accommodation, setAccommodation] = useState(editDay?.accommodation || '')
  const [food, setFood] = useState(editDay?.recommendedFood || '')
  const [weather, setWeather] = useState(editDay?.weatherBackup || '')
  const [areaDescription, setAreaDescription] = useState(editDay?.areaDescription || '')
  const [mapUrl, setMapUrl] = useState(editDay?.mapUrl || '')
  const [schedule, setSchedule] = useState<ScheduleItem[]>(
    editDay?.schedule.length ? editDay.schedule : [{ time: '', activity: '', description: '', transport: '', food: '', notes: '', linkName: '', linkUrl: '' }]
  )

  const addScheduleItem = () => {
    setSchedule([...schedule, { time: '', activity: '', description: '', transport: '', food: '', notes: '', linkName: '', linkUrl: '' }])
  }

  const updateScheduleItem = (index: number, field: keyof ScheduleItem, value: string) => {
    const updated = [...schedule]
    updated[index] = { ...updated[index], [field]: value }
    setSchedule(updated)
  }

  const removeScheduleItem = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index))
  }

  const handleSave = () => {
    if (!title || !date) {
      alert('נא למלא כותרת ותאריך')
      return
    }
    const filteredSchedule = schedule.filter(s => s.time || s.activity)
    const links = filteredSchedule
      .filter(s => s.linkName && s.linkUrl)
      .map(s => ({ type: s.linkName!, url: s.linkUrl! }))
    onSave({
      day: dayNumber,
      date,
      title,
      accommodation,
      recommendedFood: food,
      weatherBackup: weather,
      areaDescription,
      schedule: filteredSchedule,
      mapUrl: mapUrl || undefined,
      links
    })
  }

  const handleDelete = () => {
    if (editDay && onDelete && confirm('האם למחוק את היום?')) {
      onDelete(editDay.day)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-6">
        {editDay ? '✏️ עריכת יום' : '➕ הוסף יום חדש'}
      </h1>
      
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4 text-center">פרטים בסיסיים</h3>
          <div className="space-y-4">
            <div className="info-box info-box-purple">
              <label className="block text-sm font-bold text-gray-700 mb-2">מספר יום</label>
              <input
                type="number"
                value={dayNumber}
                onChange={(e) => setDayNumber(Number(e.target.value))}
                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
              />
            </div>
            <div className="info-box info-box-purple">
              <label className="block text-sm font-bold text-gray-700 mb-2">תאריך</label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="23/09/2026"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
              />
            </div>
            <div className="info-box info-box-purple">
              <label className="block text-sm font-bold text-gray-700 mb-2">כותרת היום</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="תיאור קצר של היום"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
              />
            </div>
            <div className="info-box info-box-blue">
              <label className="block text-sm font-bold text-gray-700 mb-2">תיאור האזור</label>
              <textarea
                value={areaDescription}
                onChange={(e) => setAreaDescription(e.target.value)}
                placeholder="מידע על האזור..."
                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                rows={2}
              />
            </div>
            <div className="info-box info-box-blue">
              <label className="block text-sm font-bold text-gray-700 mb-2">🗺️ קישור למפה</label>
              <input
                type="url"
                value={mapUrl}
                onChange={(e) => setMapUrl(e.target.value)}
                placeholder="https://..."
                dir="ltr"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white text-left"
              />
            </div>
          </div>
        </div>

        {/* Accommodation & Food */}
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-4 text-center">🏕️ לינה ואוכל</h3>
          <div className="space-y-4">
            <div className="info-box info-box-green">
              <label className="block text-sm font-bold text-gray-700 mb-2">לינה</label>
              <input
                type="text"
                value={accommodation}
                onChange={(e) => setAccommodation(e.target.value)}
                placeholder="שם הקמפינג/מלון"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
              />
            </div>
            <div className="info-box info-box-orange">
              <label className="block text-sm font-bold text-gray-700 mb-2">🍽️ אוכל מומלץ</label>
              <textarea
                value={food}
                onChange={(e) => setFood(e.target.value)}
                placeholder="תיאור ארוחות היום"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                rows={2}
              />
            </div>
            <div className="info-box info-box-blue">
              <label className="block text-sm font-bold text-gray-700 mb-2">🌧️ תוכנית גשם</label>
              <textarea
                value={weather}
                onChange={(e) => setWeather(e.target.value)}
                placeholder="מה לעשות במזג אוויר גרוע"
                className="w-full p-3 border border-gray-200 rounded-xl bg-white"
                rows={2}
              />
            </div>
          </div>
        </div>

        {/* Schedule */}
        <div className="card p-5">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-gray-800">📋 לוח זמנים</h3>
            <button
              onClick={addScheduleItem}
              className="badge-blue px-4 py-2 text-sm font-bold"
            >
              + הוסף
            </button>
          </div>
          <div className="space-y-4">
            {schedule.map((item, idx) => (
              <div key={idx} className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-bold">פריט {idx + 1}</span>
                  {schedule.length > 1 && (
                    <button
                      onClick={() => removeScheduleItem(idx)}
                      className="bg-red-100 text-red-600 px-2 py-1 rounded-full text-xs font-bold"
                    >
                      ✕
                    </button>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => updateScheduleItem(idx, 'time', e.target.value)}
                      placeholder="שעה"
                      className="w-20 p-2 border border-gray-200 rounded-lg bg-white text-sm text-center"
                    />
                    <input
                      type="text"
                      value={item.activity}
                      onChange={(e) => updateScheduleItem(idx, 'activity', e.target.value)}
                      placeholder="פעילות"
                      className="flex-1 p-2 border border-gray-200 rounded-lg bg-white text-sm min-w-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.description}
                    onChange={(e) => updateScheduleItem(idx, 'description', e.target.value)}
                    placeholder="תיאור"
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.transport || ''}
                      onChange={(e) => updateScheduleItem(idx, 'transport', e.target.value)}
                      placeholder="🚗 תחבורה"
                      className="flex-1 p-2 border border-gray-200 rounded-lg bg-white text-sm min-w-0"
                    />
                    <input
                      type="text"
                      value={item.food || ''}
                      onChange={(e) => updateScheduleItem(idx, 'food', e.target.value)}
                      placeholder="🍽️ אוכל"
                      className="flex-1 p-2 border border-gray-200 rounded-lg bg-white text-sm min-w-0"
                    />
                  </div>
                  <input
                    type="text"
                    value={item.notes || ''}
                    onChange={(e) => updateScheduleItem(idx, 'notes', e.target.value)}
                    placeholder="📝 הערות"
                    className="w-full p-2 border border-gray-200 rounded-lg bg-white text-sm"
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={item.linkName || ''}
                      onChange={(e) => updateScheduleItem(idx, 'linkName', e.target.value)}
                      placeholder="🔗 לינק"
                      className="w-24 p-2 border border-gray-200 rounded-lg bg-white text-sm"
                    />
                    <input
                      type="url"
                      value={item.linkUrl || ''}
                      onChange={(e) => updateScheduleItem(idx, 'linkUrl', e.target.value)}
                      placeholder="URL"
                      dir="ltr"
                      className="flex-1 p-2 border border-gray-200 rounded-lg bg-white text-sm text-left min-w-0"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 mt-6">
          <button
            onClick={handleSave}
            className="w-full py-4 rounded-xl text-lg font-bold transition-all"
            style={{ backgroundColor: '#22c55e', color: 'white' }}
          >
            💾 שמור
          </button>
          <button
            onClick={onCancel}
            className="w-full py-4 rounded-xl text-lg font-bold transition-all"
            style={{ backgroundColor: '#e5e7eb', color: '#374151' }}
          >
            ביטול
          </button>
          {editDay && onDelete && (
            <button
              onClick={handleDelete}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all mt-4"
              style={{ backgroundColor: '#ef4444', color: 'white' }}
            >
              🗑️ מחק יום
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

interface DayDetailViewProps {
  day: number
  onBack: () => void
  customDays: CustomDay[]
  onEdit: (day: CustomDay) => void
}

function DayDetailView({ day, onBack, customDays, onEdit }: DayDetailViewProps) {
  const dayPlan = dailyPlansData.dailyPlans.find(d => d.day === day)
  const customDay = customDays.find(d => d.day === day)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null)
  
  const toggleAccordion = (id: string) => {
    setOpenAccordion(openAccordion === id ? null : id)
  }
  
  const findLinkForActivity = (activity: string, description: string) => {
    if (!dayPlan?.links) return null
    const text = (activity + ' ' + description).toLowerCase()
    return dayPlan.links.find(link => {
      const linkType = link.type.toLowerCase()
      if (linkType === 'קמפינג' && (text.includes('camping') || text.includes('check-in'))) return true
      if (text.includes(linkType)) return true
      const linkWords = linkType.split(' ')
      return linkWords.some(word => word.length > 3 && text.includes(word.toLowerCase()))
    })
  }
  
  // Show custom day - same layout as regular day
  if (!dayPlan && customDay) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-6">
        {/* Header */}
        <div className="card p-4 mb-4 text-center">
          <span className="badge-green mb-2 inline-block text-xs">יום {customDay.day} (מותאם)</span>
          <h2 className="text-base font-bold text-gray-800 mb-1">{customDay.title}</h2>
          <p className="text-gray-500 text-xs mb-3">{customDay.date}</p>
          {customDay.mapUrl && (
            <a
              href={customDay.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600"
            >
              🗺️ פתח מפה ליום
            </a>
          )}
        </div>
        
        {/* Edit Button */}
        <div className="text-center mb-4">
          <button
            onClick={() => onEdit(customDay)}
            className="badge-orange px-6 py-2 text-sm font-bold"
          >
            ✏️ ערוך יום
          </button>
        </div>

        {/* Accordions - Info */}
        <div className="flex gap-2 mb-4">
          <button 
            onClick={() => toggleAccordion('accommodation')}
            className={`flex-1 card p-3 text-center text-sm font-bold ${openAccordion === 'accommodation' ? 'ring-2 ring-green-500' : ''}`}
          >
            🏕️ לינה
          </button>
          <button 
            onClick={() => toggleAccordion('food')}
            className={`flex-1 card p-3 text-center text-sm font-bold ${openAccordion === 'food' ? 'ring-2 ring-orange-500' : ''}`}
          >
            🍽️ אוכל
          </button>
          <button 
            onClick={() => toggleAccordion('weather')}
            className={`flex-1 card p-3 text-center text-sm font-bold ${openAccordion === 'weather' ? 'ring-2 ring-blue-500' : ''}`}
          >
            🌧️ גשם
          </button>
        </div>
        
        {openAccordion && (
          <div className="card p-4 mb-4 text-gray-600 text-sm">
            {openAccordion === 'accommodation' && (customDay.accommodation || '—')}
            {openAccordion === 'food' && (customDay.recommendedFood || '—')}
            {openAccordion === 'weather' && (customDay.weatherBackup || '—')}
          </div>
        )}

        {/* Area description */}
        {customDay.areaDescription && (
          <div className="info-box info-box-blue mb-5 text-right">
            <p className="text-sm text-gray-700">{customDay.areaDescription}</p>
          </div>
        )}

        {/* Schedule */}
        {customDay.schedule.length > 0 && (
          <div className="card p-5 mb-5">
            <h2 className="font-bold text-gray-800 mb-4 text-center">📋 לוח זמנים</h2>
            <div className="space-y-4">
              {customDay.schedule.map((item, idx) => {
                const transportText = item.transport && item.transport !== '—' 
                  ? item.transport.replace(/🚐/g, '').trim() 
                  : null
                return (
                  <div key={idx} className="info-box info-box-purple">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="badge-blue text-xs">{item.time}</span>
                      {transportText && <span className="text-sm text-gray-500">{transportText}</span>}
                    </div>
                    <h4 className="font-bold text-gray-800 mb-1 text-sm">{item.activity}</h4>
                    <p className="text-gray-600 text-xs">{item.description}</p>
                    {item.food && item.food !== '—' && (
                      <p className="text-emerald-600 text-xs mt-2">🍽️ {item.food}</p>
                    )}
                    {item.notes && (
                      <p className="text-gray-500 text-xs mt-2">📝 {item.notes}</p>
                    )}
                    {item.linkName && item.linkUrl && (
                      <a
                        href={item.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline text-xs mt-2 inline-block"
                      >
                        🔗 {item.linkName}
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>
    )
  }

  if (!dayPlan) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-8 text-center">
        <h1 className="text-xl font-bold text-gray-800 mb-6">פרטים יתווספו בקרוב...</h1>
        <button onClick={onBack} className="btn btn-primary">חזרה</button>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      {/* Header */}
      <div className="card p-4 mb-4 text-center">
        <span className="badge-purple mb-2 inline-block text-xs">יום {dayPlan.day}</span>
        <h2 className="text-base font-bold text-gray-800 mb-1">{dayPlan.title}</h2>
        <p className="text-gray-500 text-xs">{dayPlan.date}</p>
        {dayPlan.links && dayPlan.links.find(l => l.type.includes('מפה')) && (
          <a
            href={dayPlan.links.find(l => l.type.includes('מפה'))?.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-bold hover:bg-blue-600"
          >
            🗺️ פתח מפה ליום
          </a>
        )}
      </div>

      {/* Accordions - Info */}
      <div className="flex gap-2 mb-4">
        <button 
          onClick={() => toggleAccordion('accommodation')}
          className={`flex-1 card p-3 text-center text-sm font-bold ${openAccordion === 'accommodation' ? 'ring-2 ring-green-500' : ''}`}
        >
          🏕️ לינה
        </button>
        <button 
          onClick={() => toggleAccordion('food')}
          className={`flex-1 card p-3 text-center text-sm font-bold ${openAccordion === 'food' ? 'ring-2 ring-orange-500' : ''}`}
        >
          🍽️ אוכל
        </button>
        <button 
          onClick={() => toggleAccordion('weather')}
          className={`flex-1 card p-3 text-center text-sm font-bold ${openAccordion === 'weather' ? 'ring-2 ring-blue-500' : ''}`}
        >
          🌧️ גשם
        </button>
      </div>
      
      {openAccordion && (
        <div className="card p-4 mb-4 text-gray-600 text-sm">
          {openAccordion === 'accommodation' && dayPlan.accommodation}
          {openAccordion === 'food' && dayPlan.recommendedFood}
          {openAccordion === 'weather' && dayPlan.weatherBackup}
        </div>
      )}

      {/* Area description */}
      {dayPlan.area && (
        <div className="info-box info-box-blue mb-5 text-right">
          <p className="text-sm text-gray-700">{dayPlan.area.description}</p>
        </div>
      )}

      {/* Schedule */}
      <div className="card p-5 mb-5">
        <h2 className="font-bold text-gray-800 mb-4 text-center">📋 לוח זמנים</h2>
        <div className="space-y-4">
          {dayPlan.schedule.map((item, idx) => {
            const matchedLink = findLinkForActivity(item.activity, item.description)
            const transportText = item.transport && item.transport !== '—' 
              ? item.transport.replace(/🚐/g, '').trim() 
              : null
            return (
              <div key={idx} className="info-box info-box-purple">
                <div className="flex items-center gap-3 mb-2">
                  <span className="badge-blue text-xs">{item.time}</span>
                  {transportText && <span className="text-sm text-gray-500">{transportText}</span>}
                </div>
                <h4 className="font-bold text-gray-800 mb-1 text-sm">{item.activity}</h4>
                <p className="text-gray-600 text-xs">{item.description}</p>
                {item.food && item.food !== '—' && (
                  <p className="text-emerald-600 text-xs mt-2">🍽️ {item.food}</p>
                )}
                {item.notes && (
                  <p className="text-gray-500 text-xs mt-2">📝 {item.notes}</p>
                )}
                {matchedLink && (
                  <a
                    href={matchedLink.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-xs mt-2 inline-block"
                  >
                    🔗 {matchedLink.type}
                  </a>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default App
