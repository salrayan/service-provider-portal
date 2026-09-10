import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProviderDashboard from "./pages/ProviderDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProviderDetails from "./pages/ProviderDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/provider"
          element={<ProviderDashboard />}
        />

        <Route
          path="/admin"
          element={<AdminDashboard />}
        />

        <Route
  path="/admin/providers/:id"
  element={<ProviderDetails />}
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;