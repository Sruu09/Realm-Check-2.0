import Toast from './components/Toast';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import RealmReady from './pages/RealmReady';
import RealmDashboard from './pages/RealmDashboard';
import Castle from './pages/Castle';
import Library from './pages/Library';
import Pond from './pages/Pond';
import Treasure from './pages/Treasure';
import Garden from './pages/Garden';
import Arena from './pages/Arena';
import WizardHouse from './pages/WizardHouse';
import PetCompanion from './pages/PetCompanion';

function App() {
  return (
    <Router>
      <div className="min-h-screen font-body text-realm-brown">
        <Toast />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/realm-ready" element={<RealmReady />} />
          <Route path="/realm" element={<RealmDashboard />} />
          <Route path="/castle" element={<Castle />} />
          <Route path="/library" element={<Library />} />
          <Route path="/pond" element={<Pond />} />
          <Route path="/treasure" element={<Treasure />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/arena" element={<Arena />} />
          <Route path="/wizard" element={<WizardHouse />} />
          <Route path="/pet" element={<PetCompanion />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
