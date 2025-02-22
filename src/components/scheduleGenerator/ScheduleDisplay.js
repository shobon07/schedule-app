import React from 'react';
import { Clock, AlertCircle } from 'lucide-react';

const ScheduleDisplay = ({ schedule }) => {
  // 時間枠ごとの背景色を設定
  const getEventColor = (type) => {
    switch (type) {
      case 'fixed':
        return 'bg-blue-100 border-blue-200';
      case 'task':
        return 'bg-green-100 border-green-200';
      case 'break':
        return 'bg-gray-100 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-100';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-blue-500" />
        生成されたスケジュール
      </h2>

      <div className="space-y-2">
        {schedule.map((event, index) => (
          <div
            key={index}
            className={`p-3 rounded border ${getEventColor(event.type)} flex items-center justify-between`}
          >
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                {event.startTime} - {event.endTime}
              </div>
              <div className="font-medium">{event.title}</div>
              {event.type === 'task' && event.warning && (
                <AlertCircle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            {event.notes && (
              <div className="text-sm text-gray-500">{event.notes}</div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 text-sm text-gray-500">
        ※ 青色: 固定スケジュール / 緑色: タスク / グレー: 休憩
      </div>
    </div>
  );
};

export default ScheduleDisplay;