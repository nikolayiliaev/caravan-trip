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
    <div dir="rtl" className="app-bg">
      {currentView !== 'home' && (
        <nav className="nav-bar sticky top-0 z-50">
          <div className="max-w-2xl mx-auto px-5 py-4">
            <button
              onClick={() => setCurrentView('home')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-bold text-lg"
            >
              <span className="text-xl">→</span>
              <span>חזרה</span>
            </button>
          </div>
        </nav>
      )}
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
        <div className="text-6xl mb-4">🚐</div>
        <h1 className="header-title mb-3">{itineraryData.trip.title}</h1>
        <p className="text-gray-500 text-lg mb-5">{itineraryData.trip.dates}</p>
        {daysUntilTrip > 0 && (
          <div className="badge-blue text-base px-6 py-2">
            🎉 עוד {daysUntilTrip} ימים!
          </div>
        )}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-2 gap-5 mb-12">
        <button onClick={() => onNavigate('itinerary')} className="menu-card menu-card-blue">
          <div className="text-4xl mb-2">📅</div>
          <div className="font-bold text-lg">מסלול</div>
        </button>
        <button onClick={() => onNavigate('bookings')} className="menu-card menu-card-green">
          <div className="text-4xl mb-2">📋</div>
          <div className="font-bold text-lg">הזמנות</div>
        </button>
        <button onClick={() => onNavigate('shopping')} className="menu-card menu-card-orange">
          <div className="text-4xl mb-2">🛒</div>
          <div className="font-bold text-lg">קניות</div>
        </button>
        <button onClick={() => onNavigate('caravan')} className="menu-card menu-card-purple">
          <div className="text-4xl mb-2">🚐</div>
          <div className="font-bold text-lg">קראוון</div>
        </button>
        <button onClick={() => onNavigate('weather')} className="menu-card menu-card-gray">
          <div className="text-4xl mb-2">🌧️</div>
          <div className="font-bold text-lg">גשם</div>
        </button>
        <button onClick={() => window.open(mapsData.maps.overview[0].url, '_blank')} className="menu-card menu-card-pink">
          <div className="text-4xl mb-2">🗺️</div>
          <div className="font-bold text-lg">מפות</div>
        </button>
      </div>

    </div>
  )
}

function ItineraryView({ onSelectDay }: { onSelectDay: (day: number) => void }) {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">📅 מסלול הטיול</h1>
      <div className="space-y-6">
        {itineraryData.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => onSelectDay(day.dayNumber)}
            className="card p-5 w-full text-right"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="badge-purple">יום {day.dayNumber}</span>
              <span className="text-gray-400 text-sm">{day.date} • {day.dayOfWeek}</span>
            </div>
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
  const [bookings, setBookings] = useState(bookingsData.bookings)
  
  const toggleCompleted = (id: number) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, completed: !b.completed } : b))
  }
  
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">📋 הזמנות</h1>
      <div className="space-y-6">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className={`card p-5 ${booking.completed ? 'opacity-50' : ''}`}
          >
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className={`font-bold text-gray-800 ${booking.completed ? 'line-through' : ''}`}>
                    {booking.item}
                  </h3>
                  <span className={`${booking.priority === 'high' ? 'badge-red' : 'badge-orange'} text-xs flex-shrink-0`}>
                    {booking.dates}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{booking.description}</p>
                {booking.notes && (
                  <div className="info-box info-box-blue text-sm text-gray-600 mb-4">
                    💡 {booking.notes}
                  </div>
                )}
                <a
                  href={booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary text-sm py-2 px-4"
                >
                  🔗 פתח
                </a>
              </div>
              <input
                type="checkbox"
                checked={booking.completed}
                onChange={() => toggleCompleted(booking.id)}
                className="mt-1 flex-shrink-0"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShoppingView() {
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      <h1 className="header-title text-center mb-8">🛒 קניות</h1>
      
      <div className="card p-6 mb-8 text-center">
        <div className="text-4xl mb-3">📍</div>
        <h3 className="font-bold text-gray-800 text-lg mb-2">{shoppingData.shopping.mainStore.name}</h3>
        <p className="text-gray-500 text-sm mb-5">{shoppingData.shopping.mainStore.when}</p>
        <a
          href={shoppingData.shopping.mainStore.url}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-primary"
        >
          🗺️ פתח מפה
        </a>
      </div>

      <div className="space-y-6">
        {shoppingData.shopping.categories.map((category, idx) => (
          <div key={idx} className="card p-5">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="font-bold text-gray-800 text-lg">{category.name}</h3>
              {category.rebuy && <span className="badge-green text-xs">לקנות שוב</span>}
            </div>
            <p className="text-gray-600 text-sm mb-4">{category.items}</p>
            <div className="flex flex-wrap gap-3 text-xs">
              <span className="badge-light">📦 {category.quantity}</span>
              <span className="badge-light">🍽️ {category.usage}</span>
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
      <div className="card p-6 mb-8">
        <h2 className="font-bold text-gray-800 text-lg mb-5 text-center">פרטי הרכב</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="menu-card-blue rounded-xl p-3 text-center">
            <div className="text-xs opacity-80 mb-1">דגם</div>
            <div className="font-bold">{caravanData.caravan.model}</div>
          </div>
          <div className="menu-card-pink rounded-xl p-3 text-center">
            <div className="text-xs opacity-80 mb-1">גובה</div>
            <div className="font-bold">{caravanData.caravan.height}</div>
          </div>
          <div className="menu-card-green rounded-xl p-3 text-center">
            <div className="text-xs opacity-80 mb-1">אורך</div>
            <div className="font-bold">{caravanData.caravan.length}</div>
          </div>
          <div className="menu-card-orange rounded-xl p-3 text-center">
            <div className="text-xs opacity-80 mb-1">משקל</div>
            <div className="font-bold">{caravanData.caravan.weight}</div>
          </div>
        </div>
      </div>

      {/* Important */}
      <div className="space-y-6 mb-8">
        {caravanData.caravan.important.map((item, idx) => (
          <div
            key={idx}
            className={`card p-5 border-r-4 ${item.priority === 'critical' ? 'border-red-500' : 'border-amber-500'}`}
          >
            <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>

      {/* Tolls & Fuel */}
      <div className="space-y-6">
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-3">🛣️ אגרות</h3>
          <p className="text-gray-600 text-sm mb-4">{caravanData.tolls.austria.notes}</p>
          <a href={caravanData.tolls.austria.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm py-2 px-4">
            קנה וינייטה
          </a>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 mb-3">⛽ דלק</h3>
          <p className="text-gray-600 text-sm mb-4">📍 {caravanData.fuel.lastDay.location}</p>
          <a href={caravanData.fuel.lastDay.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary text-sm py-2 px-4">
            מיקום
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
          <div key={idx} className="card p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-5 text-center">{plan.area}</h3>
            <div className="space-y-4">
              <div className="info-box info-box-orange">
                <span className="font-bold">☀️ ראשית:</span> {plan.mainPlan}
              </div>
              <div className="info-box info-box-blue">
                <span className="font-bold">🌦️ Plan B:</span> {plan.planB}
              </div>
              <div className="info-box info-box-purple">
                <span className="font-bold">🌧️ Plan C:</span> {plan.planC}
              </div>
              <div className="info-box info-box-red">
                <span className="font-bold">⚠️ לא לעשות:</span> {plan.dontDo}
              </div>
            </div>
            {plan.url && (
              <a href={plan.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full mt-5 text-sm">
                מידע נוסף
              </a>
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
  
  if (!dayPlan) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">פרטים יתווספו בקרוב...</h1>
        <button onClick={onBack} className="btn btn-primary">חזרה</button>
      </div>
    )
  }
  
  return (
    <div className="max-w-2xl mx-auto px-5 py-6">
      {/* Header */}
      <div className="card p-6 mb-6 text-center">
        <span className="badge-purple mb-4 inline-block">יום {dayPlan.day}</span>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{dayPlan.title}</h1>
        <p className="text-gray-500">{dayPlan.date}</p>
        {dayPlan.area && (
          <div className="info-box info-box-blue mt-5 text-right">
            <p className="text-sm text-gray-700">{dayPlan.area.description}</p>
          </div>
        )}
      </div>

      {/* Schedule */}
      <div className="card p-6 mb-6">
        <h2 className="font-bold text-gray-800 text-lg mb-5 text-center">📋 לוח זמנים</h2>
        <div className="space-y-5">
          {dayPlan.schedule.map((item, idx) => (
            <div key={idx} className="info-box info-box-purple">
              <div className="flex items-center gap-3 mb-3">
                <span className="badge-blue text-xs">{item.time}</span>
                {item.transport && item.transport !== '—' && <span className="text-sm text-gray-500">{item.transport}</span>}
              </div>
              <h4 className="font-bold text-gray-800 mb-2">{item.activity}</h4>
              <p className="text-gray-600 text-sm">{item.description}</p>
              {item.food && item.food !== '—' && (
                <p className="text-emerald-600 text-sm mt-3">🍽️ {item.food}</p>
              )}
              {item.notes && (
                <p className="text-gray-500 text-xs mt-3">📝 {item.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Info */}
      <div className="grid grid-cols-2 gap-5 mb-6">
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-3">🏕️ לינה</h3>
          <p className="text-gray-600 text-sm">{dayPlan.accommodation}</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-gray-800 text-sm mb-3">🍽️ אוכל</h3>
          <p className="text-gray-600 text-sm">{dayPlan.recommendedFood}</p>
        </div>
      </div>

      {/* Weather */}
      <div className="card p-5 mb-6 border-r-4 border-amber-500">
        <h3 className="font-bold text-gray-800 mb-3">🌧️ גשם</h3>
        <p className="text-gray-600 text-sm">{dayPlan.weatherBackup}</p>
      </div>

      {/* Links */}
      {dayPlan.links && dayPlan.links.length > 0 && (
        <div className="space-y-3">
          {dayPlan.links.map((link, idx) => (
            <a
              key={idx}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary w-full text-sm"
            >
              {link.type}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
