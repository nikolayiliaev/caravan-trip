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
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800">
      {currentView !== 'home' && (
        <nav className="bg-white/80 backdrop-blur-md dark:bg-gray-800/80 shadow-lg sticky top-0 z-50 border-b border-sky-100 dark:border-gray-700">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <button
                onClick={() => setCurrentView('home')}
                className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold text-lg flex items-center gap-2 transition-colors"
              >
                → חזרה לבית
              </button>
            </div>
          </div>
        </nav>
      )}
      <main className="pb-12 px-4">
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
    <div className="max-w-5xl mx-auto py-8">
      <div className="text-center mb-12 px-4">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-l from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {itineraryData.trip.title}
        </h1>
        <p className="text-2xl text-sky-600 dark:text-sky-400 mb-3 font-semibold">
          {itineraryData.trip.dates}
        </p>
        {daysUntilTrip > 0 && (
          <div className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-3 rounded-full text-lg font-semibold shadow-lg">
            עוד {daysUntilTrip} ימים לטיול! 🚐
          </div>
        )}
        <p className="text-gray-600 dark:text-gray-300 mt-6 text-lg max-w-2xl mx-auto leading-relaxed">
          {itineraryData.trip.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 px-4">
        <MenuCard
          title="מסלול יומי"
          description={`${itineraryData.days.length} ימים מתוכננים`}
          icon="📅"
          onClick={() => onNavigate('itinerary')}
          color="from-blue-500 to-blue-600"
        />
        <MenuCard
          title="הזמנות"
          description={`${bookingsData.bookings.length} הזמנות לביצוע`}
          icon="📋"
          onClick={() => onNavigate('bookings')}
          color="from-emerald-500 to-emerald-600"
        />
        <MenuCard
          title="רשימת קניות"
          description="מוצרים להצטיידות"
          icon="🛒"
          onClick={() => onNavigate('shopping')}
          color="from-amber-500 to-amber-600"
        />
        <MenuCard
          title="מידע קראוון"
          description="פרטים חשובים ואגרות"
          icon="🚐"
          onClick={() => onNavigate('caravan')}
          color="from-purple-500 to-purple-600"
        />
        <MenuCard
          title="תוכניות גשם"
          description="חלופות למזג אוויר"
          icon="🌧️"
          onClick={() => onNavigate('weather')}
          color="from-slate-500 to-slate-600"
        />
        <MenuCard
          title="מפות"
          description="ניווט וקישורים"
          icon="🗺️"
          onClick={() => window.open(mapsData.maps.overview[0].url, '_blank')}
          color="from-rose-500 to-rose-600"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-8 border border-sky-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">תצוגה מהירה - ימי הטיול</h2>
        <div className="space-y-4">
          {itineraryData.days.map((day) => (
            <button
              key={day.dayNumber}
              onClick={() => onSelectDay(day.dayNumber)}
              className="w-full text-right bg-gradient-to-l from-sky-50 to-emerald-50 dark:from-gray-700 dark:to-gray-600 hover:from-sky-100 hover:to-emerald-100 dark:hover:from-gray-600 dark:hover:to-gray-500 p-5 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] border border-sky-100 dark:border-gray-600"
            >
              <div className="flex justify-between items-center flex-row-reverse">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-bold text-sky-600 dark:text-sky-400 text-lg">יום {day.dayNumber}</span>
                    <span className="text-gray-700 dark:text-gray-300 font-medium">{day.date}</span>
                    <span className="text-gray-500 dark:text-gray-400">({day.dayOfWeek})</span>
                  </div>
                  <p className="font-semibold text-gray-800 dark:text-white text-lg mb-1">{day.area}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{day.mainActivity}</p>
                </div>
                <div className="mr-4">
                  {day.drivingHours > 0 && (
                    <span className="text-sm bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-4 py-2 rounded-full font-semibold shadow-md">
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
      className={`bg-gradient-to-br ${color} hover:opacity-95 text-white rounded-2xl shadow-lg hover:shadow-2xl p-8 transition-all transform hover:scale-105 text-right group`}
    >
      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">{icon}</div>
      <h3 className="text-2xl font-bold mb-2 drop-shadow-sm">{title}</h3>
      <p className="text-base opacity-95 drop-shadow-sm">{description}</p>
    </button>
  )
}

interface ItineraryViewProps {
  onSelectDay: (day: number) => void
}

function ItineraryView({ onSelectDay }: ItineraryViewProps) {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-5xl font-bold bg-gradient-to-l from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-10 text-center">מסלול יומי</h1>
      <div className="space-y-5">
        {itineraryData.days.map((day) => (
          <button
            key={day.dayNumber}
            onClick={() => onSelectDay(day.dayNumber)}
            className="w-full bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg hover:shadow-2xl transition-all p-8 text-right border border-sky-100 dark:border-gray-700 transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-start mb-4 flex-row-reverse">
              <div>
                <p className="text-gray-700 dark:text-gray-300 font-semibold">{day.date}</p>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{day.dayOfWeek}</p>
              </div>
              <div>
                <span className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-md">
                  יום {day.dayNumber}
                </span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">{day.area}</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">{day.mainActivity}</p>
            <div className="flex justify-between items-center text-sm border-t border-sky-100 dark:border-gray-700 pt-4 flex-row-reverse">
              {day.drivingHours > 0 && (
                <span className="bg-sky-100 dark:bg-gray-700 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full font-semibold">
                  🚗 {day.drivingHours} שעות נהיגה
                </span>
              )}
              <span className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <span className="text-lg">🏕️</span>
                {day.accommodation}
              </span>
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
      case 'high': return 'bg-red-50 dark:bg-red-900/20 border-red-400 text-red-800 dark:text-red-200'
      case 'medium': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-400 text-amber-800 dark:text-amber-200'
      default: return 'bg-gray-50 dark:bg-gray-700 border-gray-400'
    }
  }
  
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-5xl font-bold bg-gradient-to-l from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-10 text-center">הזמנות לביצוע</h1>
      <div className="space-y-5">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className={`bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border-r-4 ${getPriorityColor(booking.priority)} ${
              booking.completed ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-start gap-4">
              <input
                type="checkbox"
                checked={booking.completed}
                onChange={() => toggleCompleted(booking.id)}
                className="mt-1 h-6 w-6 rounded-lg border-gray-300 text-sky-600 focus:ring-sky-500 cursor-pointer"
              />
              <div className="flex-1 text-right">
                <div className="flex justify-between items-start mb-3 flex-row-reverse">
                  <span className="text-gray-600 dark:text-gray-400 text-sm font-semibold bg-sky-100 dark:bg-gray-700 px-3 py-1 rounded-full">{booking.dates}</span>
                  <h3 className={`text-2xl font-bold ${booking.completed ? 'line-through' : ''} dark:text-white`}>
                    {booking.item}
                  </h3>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg">{booking.description}</p>
                {booking.notes && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 bg-sky-50 dark:bg-gray-700/50 p-3 rounded-lg">💡 {booking.notes}</p>
                )}
                <a
                  href={booking.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold mt-2 shadow-md hover:shadow-lg transition-all"
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
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-5xl font-bold bg-gradient-to-l from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-6 text-center">רשימת קניות</h1>
      <div className="bg-gradient-to-r from-sky-500 to-emerald-500 rounded-2xl p-6 mb-8 text-center shadow-xl">
        <p className="font-bold text-white text-xl mb-2">📍 {shoppingData.shopping.mainStore.name}</p>
        <p className="text-sm text-white/90 mb-4">{shoppingData.shopping.mainStore.when}</p>
        <a
          href={shoppingData.shopping.mainStore.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-white text-sky-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-sky-50 transition-all shadow-lg"
        >
          🗺️ פתח מפה
        </a>
      </div>

      <div className="space-y-5 mb-8">
        {shoppingData.shopping.categories.map((category, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg p-6 border border-sky-100 dark:border-gray-700">
            <div className="flex justify-between items-start mb-4 flex-row-reverse">
              {category.rebuy && (
                <span className="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-3 py-1 rounded-full text-sm font-semibold">
                  לקנות שוב
                </span>
              )}
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{category.name}</h3>
            </div>
            <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg">{category.items}</p>
            <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-400 bg-sky-50 dark:bg-gray-700/50 p-3 rounded-lg">
              <span>📦 כמות: {category.quantity}</span>
              <span>🍽️ שימוש: {category.usage}</span>
            </div>
            {category.store && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">🏪 {category.store}</p>
            )}
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 text-center border-2 border-amber-200 dark:border-amber-700 shadow-lg">
        <p className="text-gray-800 dark:text-gray-200 text-lg leading-relaxed">{shoppingData.shopping.mealPlan}</p>
      </div>
    </div>
  )
}

function CaravanView() {
  return (
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-5xl font-bold bg-gradient-to-l from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-10 text-center">מידע על הקראוון</h1>
      
      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-8 mb-8 border border-sky-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">פרטי הרכב</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-5 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30 rounded-xl shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">דגם</p>
            <p className="font-bold text-xl dark:text-white">{caravanData.caravan.model}</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">גובה</p>
            <p className="font-bold text-xl text-red-600 dark:text-red-300">{caravanData.caravan.height}</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30 rounded-xl shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">אורך</p>
            <p className="font-bold text-xl dark:text-white">{caravanData.caravan.length}</p>
          </div>
          <div className="text-center p-5 bg-gradient-to-br from-sky-50 to-sky-100 dark:from-sky-900/30 dark:to-sky-800/30 rounded-xl shadow-md">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">משקל</p>
            <p className="font-bold text-xl dark:text-white">{caravanData.caravan.weight}</p>
          </div>
        </div>
      </div>

      <div className="space-y-5 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white text-center">נקודות חשובות</h2>
        {caravanData.caravan.important.map((item, idx) => (
          <div
            key={idx}
            className={`rounded-2xl shadow-lg p-6 border-r-4 ${
              item.priority === 'critical'
                ? 'bg-red-50 dark:bg-red-900/20 border-red-500'
                : 'bg-amber-50 dark:bg-amber-900/20 border-amber-500'
            }`}
          >
            <h3 className="font-bold text-2xl mb-3 dark:text-white">{item.title}</h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg">{item.description}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-sky-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">אגרות - אוסטריה</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg"><strong>{caravanData.tolls.austria.name}</strong></p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{caravanData.tolls.austria.type}</p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
            תוקף: {caravanData.tolls.austria.validFrom} - {caravanData.tolls.austria.validUntil}
          </p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 bg-sky-50 dark:bg-gray-700/50 p-3 rounded-lg">{caravanData.tolls.austria.notes}</p>
          <a
            href={caravanData.tolls.austria.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
          >
            🔗 קנה וינייטה
          </a>
        </div>

        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-sky-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">דלק</h3>
          <p className="text-gray-700 dark:text-gray-300 mb-3 text-lg"><strong>{caravanData.fuel.type}</strong></p>
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">📍 {caravanData.fuel.lastDay.location}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 bg-sky-50 dark:bg-gray-700/50 p-3 rounded-lg">{caravanData.fuel.lastDay.notes}</p>
          <a
            href={caravanData.fuel.lastDay.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all"
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
    <div className="max-w-5xl mx-auto py-8">
      <h1 className="text-5xl font-bold bg-gradient-to-l from-sky-600 to-emerald-600 bg-clip-text text-transparent mb-10 text-center">תוכניות גשם וגיבויים</h1>
      <div className="space-y-5">
        {weatherBackupData.weatherBackup.map((plan, idx) => (
          <div key={idx} className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-lg p-8 border border-sky-100 dark:border-gray-700">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">{plan.area}</h3>
            <div className="space-y-4 text-right">
              <div className="flex items-start gap-4 bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-xl">
                <span className="text-3xl">☀️</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1">תוכנית ראשית:</p>
                  <p className="text-gray-700 dark:text-gray-300">{plan.mainPlan}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl">
                <span className="text-3xl">🌦️</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1">Plan B:</p>
                  <p className="text-gray-700 dark:text-gray-300">{plan.planB}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl">
                <span className="text-3xl">🌧️</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-1">Plan C:</p>
                  <p className="text-gray-700 dark:text-gray-300">{plan.planC}</p>
                </div>
              </div>
              <div className="flex items-start gap-4 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-2 border-red-200 dark:border-red-800">
                <span className="text-3xl">⚠️</span>
                <div className="flex-1">
                  <p className="font-bold text-red-700 dark:text-red-400 text-lg mb-1">לא לעשות:</p>
                  <p className="text-gray-700 dark:text-gray-300">{plan.dontDo}</p>
                </div>
              </div>
            </div>
            {plan.url && (
              <a
                href={plan.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold mt-6 shadow-md hover:shadow-lg transition-all"
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
      <div className="max-w-5xl mx-auto py-8 px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
          פרטים מלאים יתווספו בקרוב...
        </h1>
        <button
          onClick={onBack}
          className="bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white px-8 py-4 rounded-xl text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
        >
          חזרה למסלול
        </button>
      </div>
    )
  }
  
  return (
    <div className="max-w-5xl mx-auto py-8">
      <div className="mb-6 px-4">
        <button
          onClick={onBack}
          className="text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 font-semibold text-lg flex items-center gap-2 transition-colors"
        >
          → חזרה למסלול
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-8 mb-8 border border-sky-100 dark:border-gray-700">
        <div className="text-center mb-8">
          <span className="inline-block bg-gradient-to-r from-sky-500 to-emerald-500 text-white px-6 py-3 rounded-full text-xl font-bold mb-4 shadow-md">
            יום {dayPlan.day}
          </span>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-3">{dayPlan.title}</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">{dayPlan.date}</p>
        </div>

        {dayPlan.area && (
          <div className="bg-gradient-to-r from-sky-50 to-emerald-50 dark:from-sky-900/20 dark:to-emerald-900/20 rounded-xl p-6 mb-6 border border-sky-200 dark:border-sky-800">
            <h3 className="font-bold text-gray-800 dark:text-white text-xl mb-3">על האזור</h3>
            <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">{dayPlan.area.description}</p>
          </div>
        )}
      </div>

      <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-8 mb-8 border border-sky-100 dark:border-gray-700">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6 text-center">לוח זמנים</h2>
        <div className="space-y-5">
          {dayPlan.schedule.map((item, idx) => (
            <div key={idx} className="border-r-4 border-sky-500 dark:border-emerald-500 pr-6 py-3 bg-sky-50/50 dark:bg-gray-700/30 rounded-xl">
              <div className="flex justify-between items-start mb-3 flex-row-reverse">
                {item.transport && <span className="text-3xl">{item.transport}</span>}
                <p className="font-bold text-xl text-sky-600 dark:text-sky-400">{item.time}</p>
              </div>
              <h4 className="font-bold text-gray-800 dark:text-white text-xl mb-2">{item.activity}</h4>
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">{item.description}</p>
              {item.food && item.food !== '—' && (
                <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2 bg-emerald-50 dark:bg-emerald-900/20 p-2 rounded-lg inline-block">🍽️ {item.food}</p>
              )}
              {item.alternative && (
                <p className="text-sm text-blue-600 dark:text-blue-400 mt-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg inline-block">💡 אפשרות: {item.alternative}</p>
              )}
              {item.notes && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 bg-gray-100 dark:bg-gray-700/50 p-2 rounded-lg inline-block">📝 {item.notes}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-sky-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">🏕️</span>
            לינה
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg">{dayPlan.accommodation}</p>
        </div>
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-sky-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <span className="text-3xl">🍽️</span>
            המלצות אוכל
          </h3>
          <p className="text-gray-700 dark:text-gray-300 text-lg">{dayPlan.recommendedFood}</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl shadow-xl p-6 mb-8 border-2 border-amber-200 dark:border-amber-700">
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-3xl">🌧️</span>
          תוכנית גשם
        </h3>
        <p className="text-gray-700 dark:text-gray-300 text-lg">{dayPlan.weatherBackup}</p>
      </div>

      {dayPlan.links && dayPlan.links.length > 0 && (
        <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-2xl shadow-xl p-6 border border-sky-100 dark:border-gray-700">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-5 text-center">🔗 קישורים שימושיים</h3>
          <div className="grid gap-3">
            {dayPlan.links.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-gradient-to-r from-sky-500 to-emerald-500 hover:from-sky-600 hover:to-emerald-600 text-white px-6 py-4 rounded-xl text-center font-semibold shadow-md hover:shadow-lg transition-all text-lg"
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
