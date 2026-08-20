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
        return <HomeView onNavigate={setCurrentView} onSelectDay={(day) => { setSelectedDay(day); setCurrentView('day-detail') }} />
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
        return <HomeView onNavigate={setCurrentView} onSelectDay={(day) => { setSelectedDay(day); setCurrentView('day-detail') }} />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {currentView !== 'home' && (
        <nav className="bg-white dark:bg-gray-800 shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setCurrentView('home')}
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold text-lg"
              >
                ← חזרה לבית
              </button>
            </div>
          </div>
        </nav>
      )}
      <main className="pb-8">
        {renderView()}
      </main>
    </div>
  )
}

interface HomeViewProps {
  onNavigate: (view: View) => void
  onSelectDay: (day: number) => void
}

function HomeView({ onNavigate, onSelectDay }: HomeViewProps) {
  const today = new Date()
  const tripStart = new Date('2026-09-13')
  const daysUntilTrip = Math.ceil((tripStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-indigo-900 dark:text-white mb-4">
          {itineraryData.trip.title}
        </h1>
        <p className="text-2xl text-indigo-600 dark:text-indigo-300 mb-2">
          {itineraryData.trip.dates}
        </p>
        {daysUntilTrip > 0 && (
          <p className="text-lg text-gray-600 dark:text-gray-300">
            עוד {daysUntilTrip} ימים לטיול! 🚐
          </p>
        )}
        <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
          {itineraryData.trip.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <MenuCard
          title="מסלול יומי"
          description={`${itineraryData.days.length} ימים מתוכננים`}
          icon="📅"
          onClick={() => onNavigate('itinerary')}
          color="bg-blue-500"
        />
        <MenuCard
          title="הזמנות"
          description={`${bookingsData.bookings.length} הזמנות לביצוע`}
          icon="📋"
          onClick={() => onNavigate('bookings')}
          color="bg-green-500"
        />
        <MenuCard
          title="רשימת קניות"
          description="מוצרים להצטיידות"
          icon="🛒"
          onClick={() => onNavigate('shopping')}
          color="bg-yellow-500"
        />
        <MenuCard
          title="מידע קראוון"
          description="פרטים חשובים ואגרות"
          icon="🚐"
          onClick={() => onNavigate('caravan')}
          color="bg-purple-500"
        />
        <MenuCard
          title="תוכניות גשם"
          description="חלופות למזג אוויר"
          icon="🌧️"
          onClick={() => onNavigate('weather')}
          color="bg-gray-500"
        />
        <MenuCard
          title="מפות"
          description="ניווט וקישורים"
          icon="🗺️"
          onClick={() => window.open(mapsData.maps.overview[0].url, '_blank')}
          color="bg-red-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">תצוגה מהירה - ימי הטיול</h2>
        <div className="space-y-3">
          {itineraryData.days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => onSelectDay(day.dayNumber)}
              className="w-full text-right bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-gray-700 dark:to-gray-600 hover:from-indigo-100 hover:to-blue-100 dark:hover:from-gray-600 dark:hover:to-gray-500 p-4 rounded-lg transition-all"
            >
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-bold text-indigo-600 dark:text-indigo-400">יום {day.dayNumber}</span>
                    <span className="text-gray-600 dark:text-gray-300">{day.date}</span>
                    <span className="text-gray-500 dark:text-gray-400">({day.dayOfWeek})</span>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white">{day.area}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{day.mainActivity}</p>
                </div>
                <div className="text-left">
                  {day.drivingHours > 0 && (
                    <span className="text-sm bg-indigo-600 text-white px-3 py-1 rounded-full">
                      🚗 {day.drivingHours} ש׳
                    </span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

interface MenuCardProps {
  title: string
  description: string
  icon: string
  onClick: () => void
  color: string
}

function MenuCard({ title, description, icon, onClick, color }: MenuCardProps) {
  return (
    <button
      onClick={onClick}
      className={`${color} hover:opacity-90 text-white rounded-xl shadow-lg p-6 transition-all transform hover:scale-105 text-right`}
    >
      <div className="text-5xl mb-3">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-sm opacity-90">{description}</p>
    </button>
  )
}

interface ItineraryViewProps {
  onSelectDay: (day: number) => void
}

function ItineraryView({ onSelectDay }: ItineraryViewProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-indigo-900 dark:text-white mb-8 text-center">מסלול יומי</h1>
      <div className="space-y-4">
        {itineraryData.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => onSelectDay(day.dayNumber)}
            className="w-full bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 text-right"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="inline-block bg-indigo-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  יום {day.dayNumber}
                </span>
              </div>
              <div className="text-left">
                <p className="text-gray-600 dark:text-gray-400">{day.date}</p>
                <p className="text-gray-500 dark:text-gray-500 text-sm">{day.dayOfWeek}</p>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{day.area}</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-3">{day.mainActivity}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 dark:text-gray-500">🏕️ {day.accommodation}</span>
              {day.drivingHours > 0 && (
                <span className="bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full">
                  🚗 {day.drivingHours} שעות נהיגה
                </span>
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
  
  const getPriorityColor = (priority: string) => {
    switch(priority) {
      case 'high': return 'bg-red-100 dark:bg-red-900 border-red-500 text-red-800 dark:text-red-200'
      case 'medium': return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-500 text-yellow-800 dark:text-yellow-200'
      default: return 'bg-gray-100 dark:bg-gray-700 border-gray-500'
    }
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-indigo-900 dark:text-white mb-8 text-center">הזמנות לביצוע</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border-r-4 ${getPriorityColor(booking.priority)} ${
              booking.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={booking.completed}
                onChange={() => toggleCompleted(booking.id)}
                className="mt-1 h-5 w-5 rounded border-gray-300"
              />
              <div className="flex-1 text-right">
                <div className="flex justify-between items-start mb-2">
                  <h3 className={`text-xl font-bold ${booking.completed ? 'line-through' : ''} dark:text-white`}>
                    {booking.item}
                  </h3>
                  <span className="text-gray-600 dark:text-gray-400 text-sm">{booking.dates}</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-2">{booking.description}</p>
                {booking.notes && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">💡 {booking.notes}</p>
                )}
                <a
                  href={booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm mt-2"
                >
                  🔗 פתח קישור
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ShoppingView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-indigo-900 dark:text-white mb-4 text-center">רשימת קניות</h1>
      <div className="bg-blue-100 dark:bg-blue-900 rounded-lg p-4 mb-6 text-center">
        <p className="font-semibold dark:text-white">📍 {shoppingData.shopping.mainStore.name}</p>
        <p className="text-sm text-gray-700 dark:text-gray-300">{shoppingData.shopping.mainStore.when}</p>
        <a
          href={shoppingData.shopping.mainStore.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm mt-2"
        >
          🗺️ פתח מפה
        </a>
      </div>

      <div className="space-y-4 mb-6">
        {shoppingData.shopping.categories.map((category, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">{category.name}</h3>
              {category.rebuy && (
                <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded text-xs">
                  לקנות שוב
                </span>
              )}
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-2">{category.items}</p>
            <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
              <span>📦 כמות: {category.quantity}</span>
              <span>🍽️ שימוש: {category.usage}</span>
            </div>
            {category.store && (
              <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">🏪 {category.store}</p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg p-4 text-center">
        <p className="text-gray-800 dark:text-gray-200">{shoppingData.shopping.mealPlan}</p>
      </div>
    </div>
  )
}

function CaravanView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-indigo-900 dark:text-white mb-8 text-center">מידע על הקראוון</h1>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">פרטי הרכב</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">דגם</p>
            <p className="font-bold text-lg dark:text-white">{caravanData.caravan.model}</p>
          </div>
          <div className="text-center p-4 bg-red-50 dark:bg-red-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">גובה</p>
            <p className="font-bold text-lg text-red-600 dark:text-red-300">{caravanData.caravan.height}</p>
          </div>
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">אורך</p>
            <p className="font-bold text-lg dark:text-white">{caravanData.caravan.length}</p>
          </div>
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">משקל</p>
            <p className="font-bold text-lg dark:text-white">{caravanData.caravan.weight}</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">נקודות חשובות</h2>
        {caravanData.caravan.important.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-lg shadow-md p-5 ${
              item.priority === 'critical'
                ? 'bg-red-50 dark:bg-red-900 border-r-4 border-red-500'
                : 'bg-yellow-50 dark:bg-yellow-900 border-r-4 border-yellow-500'
            }`}
          >
            <h3 className="font-bold text-lg mb-2 dark:text-white">{item.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">אגרות - אוסטריה</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>{caravanData.tolls.austria.name}</strong></p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{caravanData.tolls.austria.type}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            תוקף: {caravanData.tolls.austria.validFrom} - {caravanData.tolls.austria.validUntil}
          </p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-3">{caravanData.tolls.austria.notes}</p>
          <a
            href={caravanData.tolls.austria.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            🔗 קנה וינייטה
          </a>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">דלק</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-2"><strong>{caravanData.fuel.type}</strong></p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">📍 {caravanData.fuel.lastDay.location}</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mb-3">{caravanData.fuel.lastDay.notes}</p>
          <a
            href={caravanData.fuel.lastDay.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm"
          >
            🗺️ מיקום התחנה
          </a>
        </div>
      </div>
    </div>
  )
}

function WeatherView() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-4xl font-bold text-indigo-900 dark:text-white mb-8 text-center">תוכניות גשם וגיבויים</h1>
      <div className="space-y-4">
        {weatherBackupData.weatherBackup.map((plan, idx) => (
          <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">{plan.area}</h3>
            <div className="space-y-3 text-right">
              <div className="flex items-start gap-3">
                <span className="text-2xl">☀️</span>
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">תוכנית ראשית:</p>
                  <p className="text-gray-600 dark:text-gray-400">{plan.mainPlan}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌦️</span>
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Plan B:</p>
                  <p className="text-gray-600 dark:text-gray-400">{plan.planB}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">🌧️</span>
                <div>
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Plan C:</p>
                  <p className="text-gray-600 dark:text-gray-400">{plan.planC}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="font-semibold text-red-600 dark:text-red-400">לא לעשות:</p>
                  <p className="text-gray-600 dark:text-gray-400">{plan.dontDo}</p>
                </div>
              </div>
            </div>
            {plan.url && (
              <a
                href={plan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm mt-4"
              >
                🔗 מידע נוסף
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-white">
          פרטים מלאים יתווספו בקרוב...
        </h1>
        <div className="text-center mt-8">
          <button
            onClick={onBack}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
          >
            חזרה למסלול
          </button>
        </div>
      </div>
    )
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
        >
          ← חזרה למסלול
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="text-center mb-6">
          <span className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-full text-lg font-bold mb-2">
            יום {dayPlan.day}
          </span>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{dayPlan.title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{dayPlan.date}</p>
        </div>

        {dayPlan.area && (
          <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4 mb-6">
            <h3 className="font-bold text-gray-800 dark:text-white mb-2">על האזור</h3>
            <p className="text-gray-700 dark:text-gray-300">{dayPlan.area.description}</p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">לוח זמנים</h2>
        <div className="space-y-4">
          {dayPlan.schedule.map((item, idx) => (
            <div key={idx} className="border-r-4 border-indigo-500 pr-4 py-2">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{item.time}</p>
                {item.transport && <span className="text-2xl">{item.transport}</span>}
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white">{item.activity}</h4>
              <p className="text-gray-600 dark:text-gray-400">{item.description}</p>
              {item.food && item.food !== '—' && (
                <p className="text-sm text-green-600 dark:text-green-400 mt-1">🍽️ {item.food}</p>
              )}
              {item.alternative && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">💡 אפשרות: {item.alternative}</p>
              )}
              {item.notes && (
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">📝 {item.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">🏕️ לינה</h3>
          <p className="text-gray-700 dark:text-gray-300">{dayPlan.accommodation}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">🍽️ המלצות אוכל</h3>
          <p className="text-gray-700 dark:text-gray-300">{dayPlan.recommendedFood}</p>
        </div>
      </div>

      <div className="bg-yellow-50 dark:bg-yellow-900 rounded-lg shadow-lg p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">🌧️ תוכנית גשם</h3>
        <p className="text-gray-700 dark:text-gray-300">{dayPlan.weatherBackup}</p>
      </div>

      {dayPlan.links && dayPlan.links.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4">🔗 קישורים שימושיים</h3>
          <div className="space-y-2">
            {dayPlan.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-center"
              >
                {link.type}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default App
