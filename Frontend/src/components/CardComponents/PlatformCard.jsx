import React from 'react';

const PlatformCard = ({ name, icon, solved, total, rating, streak }) => {
  const progress = (solved / total) * 100;

  return (
    <div className="card hover:border-blue-100 transition-colors">
      <div className="flex items-center space-x-3 mb-4">
        <div className="platform-icon">
          {icon}
        </div>
        <div>
          <h3 className="font-medium text-blue-900">{name}</h3>
          <p className="text-sm text-blue-600">Rating: {rating}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-1.5 text-sm">
            <span className="text-blue-600">Progress</span>
            <span className="font-medium text-blue-900">{solved}/{total}</span>
          </div>
          <div className="w-full bg-blue-50 rounded-full h-1.5">
            <div
              className="progress-bar h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex justify-between items-center text-sm">
          <span className="text-blue-600">Streak</span>
          <span className="font-medium text-blue-900">{streak} days</span>
        </div>
      </div>
    </div>
  );
};


export default PlatformCard;