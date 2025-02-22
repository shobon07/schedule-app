import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/header/Header';
import SchedulePage from './pages/SchedulePage';
import TaskListPage from './pages/taskListPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<SchedulePage />} />
          <Route path="/tasks" element={<TaskListPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;