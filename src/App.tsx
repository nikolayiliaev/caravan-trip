import { useState } from 'react'
import itineraryData from './data/itinerary.json'
import bookingsData from './data/bookings.json'
import caravanData from './data/caravan.json'
import shoppingData from './data/shopping.json'
import weatherBackupData from './data/weather-backup.json'
import mapsData from './data/maps.json'
import dailyPlansData from './data/daily-plans.json'

type View = 'home' | 'itinerary' | 'bookings' | 'shopping' | 'caravan' | 'weather' | 'day-detail'

function App() {
  const [currentView, setCurrentView] = useState<View>('home')
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  
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
        return <ItineraryView onSelectDay={(day) => { setSelectedDay(day); setCurrentView('day-detail') }} />
      case 'bookings':
        return <BookingsView />
      case 'shopping':
        return <ShoppingView />
      case 'caravan':
        return <CaravanView />
      case 'weather':
        return <WeatherView />
      case 'day-detail':
        return <DayDetailView day={selectedDay} onBack={() => setCurrentView('itinerary')} />
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
        <button onClick={() => window.open(mapsData.maps.overview[0].url, '_blank')} className="menu-card menu-card-pink">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="font-bold text-xl">מפות</div>
        </button>
      </div>

    </div>
  )
}

function ItineraryView({ onSelectDay }: { onSelectDay: (day: number) => void }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">📅 מסלול הטיול</h1>
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

interface DayDetailViewProps {
  day: number
  onBack: () => void
}

function DayDetailView({ day, onBack }: DayDetailViewProps) {
  const dayPlan = dailyPlansData.dailyPlans.find(d => d.day === day)
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
