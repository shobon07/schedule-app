import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header/Header";
import SchedulePage from "./pages/SchedulePage";
import TodoListPage from "./pages/TodoListPage";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/todo" element={<TodoListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;