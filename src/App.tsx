import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { DezeWeek } from './pages/DezeWeek';
import { LeadDetail } from './pages/LeadDetail';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DezeWeek />} />
        <Route path="/lead/:id" element={<LeadDetail />} />
      </Routes>
    </BrowserRouter>
  );
}
