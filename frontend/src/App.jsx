import React, { useEffect,Suspense, lazy } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import Spinner from './components/Spinner/Spinner';
import NotFound from './components/pages/NotFound';
import Support from './components/pages/SupportPage';
import RegisterPage from './components/pages/RegisterPage';
import DashboardHomePage from './components/pages/DashboardHomePage';

import './components/Spinner/Spinner.css';
// 導入你的頁面組件 (你需要先建立這些檔案)
const HomePage = lazy(() => import('./components/pages/HomePage'));
const LoginPage = lazy(() => import('./components/pages/LoginPage'));
const MyProfilePage = lazy(() => import('./components/pages/MyProfilePage'));
const MyBookingsPage = lazy(() => import('./components/pages/MyBookingsPage'));
const InfoPage = lazy(() => import('./components/pages/InfoPage'));
const DashboardPage = lazy(() => import('./components/pages/DashboardPage'));

function App() {
  useEffect(() => {
    // 每次應用程式完全重新載入（例如 F5 刷新）時，
    // 清除指定的 localStorage 項目。
      console.log("App loaded, clearing airport cache from localStorage.");
      localStorage.removeItem('airportsData');
    }, []);
  return (
      <Router>
        <ScrollToTop/>
        <div className="app-container">
          <Navbar />
          <main className='main-content'>
            <Suspense fallback={<div className="spinner-container"><Spinner /></div>}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/info" element={<InfoPage />} />
                <Route path="/support" element={<Support />} />
                <Route path="/*" element={<NotFound />} />
                {/* 將使用者相關頁面群組到 Dashboard 佈局下 */}
                <Route path=":username/dashboard" element={<DashboardPage />}>
                  <Route index element={<DashboardHomePage />} /> {/* 預設顯示 Dashboard 首頁 */}
                  <Route path="profile" element={<MyProfilePage />} />
                  <Route path="bookings" element={<MyBookingsPage />} />
                  <Route path="support" element={<Support />} />
                </Route>
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
  );
}

export default App;