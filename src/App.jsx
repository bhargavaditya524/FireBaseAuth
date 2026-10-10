// src/App.jsx
// ─────────────────────────────────────────────────────────────
// Root app with React Router v6 + Protected Route
// ─────────────────────────────────────────────────────────────

import { BrowserRouter, Routes, Route } from "react-router-dom";
import FirebaseAuth from "./FirebaseAuth";
import Home from "./Home";
import ProtectedRoute from "./ProtectedRoute"; // import guard

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login / Register page */}
        <Route path="/" element={<FirebaseAuth />} />

        {/* Protected Home Page */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}