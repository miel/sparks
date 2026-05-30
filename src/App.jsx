import { HashRouter, Routes, Route } from 'react-router-dom'
import TabBar from './components/TabBar'
import IOSInstallBanner from './components/IOSInstallBanner'
import SparkPage from './pages/Spark/SparkPage'
import CreatePage from './pages/Create/CreatePage'
import HockeyPage from './pages/Hockey/HockeyPage'
import RookiePage from './pages/Rookie/RookiePage'
import SchoolPage from './pages/School/SchoolPage'

export default function App() {
  return (
    <HashRouter>
      <div className="flex flex-col h-full safe-top">
        <main className="flex-1 overflow-y-auto no-scrollbar page-scroll pb-24">
          <Routes>
            <Route path="/"        element={<SparkPage />} />
            <Route path="/create"  element={<CreatePage />} />
            <Route path="/hockey"  element={<HockeyPage />} />
            <Route path="/rookie"  element={<RookiePage />} />
            <Route path="/school"  element={<SchoolPage />} />
          </Routes>
        </main>
        <TabBar />
        <IOSInstallBanner />
      </div>
    </HashRouter>
  )
}
