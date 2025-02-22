// src/pages/SchedulePage.js
import DailyScheduler from '../components/scheduleGenerator/DailyScheduler';

const SchedulePage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <DailyScheduler />
    </div>
  );
};

export default SchedulePage;