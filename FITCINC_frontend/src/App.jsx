import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import TrainerClientLayout from "./pages/TrainerClientLayout";
import TrainerSearch from "./pages/TrainerSearch";
import TrainerProfile from "./pages/TrainerProfile";
import WorkoutProgress from "./pages/WorkoutProgress";
import ClientList from "./pages/ClientList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<TrainerClientLayout />}>
          <Route path="/trainers" element={<TrainerSearch />} />
          <Route path="/trainers/:id" element={<TrainerProfile />} />
          <Route path="/progress" element={<WorkoutProgress />} />
          <Route path="/clients" element={<ClientList />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;