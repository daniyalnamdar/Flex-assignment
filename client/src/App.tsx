import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import PropertyPublic from "./pages/PropertyPublic";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/property/:name" element={<PropertyPublic />} />
      </Routes>
    </BrowserRouter>
  );
}
