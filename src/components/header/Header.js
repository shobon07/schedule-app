// src/components/Header/Header.js
import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gray-900 shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold flex gap-2 text-white">
            <Calendar className="w-8 h-8 text-white" />
            スケジュール管理
            </h1>
          <div className="flex gap-4">
            <Link
              to="/"
              className="text-gray-300 hover:text-gray-400"
            >
              スケジュール生成
            </Link>
            <Link
              to="/tasks"
              className="text-gray-300 hover:text-gray-400"
            >
              やりたいことリスト
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;