
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import PolicyRegistration from "./pages/PolicyRegistration";
import Recommendations from "./pages/Recommendations";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/policies/register"
          element={<PolicyRegistration />}
        />
        <Route
          path="/recommendations"
          element={<Recommendations />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
