import React from 'react';
import { CheckCircle2, Clock, AlertOctagon, Layers } from 'lucide-react';

export default function Dashboard({ tasks }) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Dynamic greeting based on current local time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getGreetingEmoji = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅';
    if (hour < 18) return '☀️';
    return '🌙';
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">
            {getGreeting()} <span className="greeting-emoji">{getGreetingEmoji()}</span>
          </h1>
          <p className="dashboard-subtitle">
            {totalTasks === 0 
              ? "Welcome! Let's start by creating a new task today." 
              : completionRate === 100 
                ? "Incredible job! All tasks are fully completed. 🎉" 
                : `You've completed ${completionRate}% of your tasks. Keep going!`
            }
          </p>
        </div>
        
        {totalTasks > 0 && (
          <div className="completion-ring-container">
            <svg className="progress-ring" width="60" height="60">
              <circle
                className="progress-ring-circle-bg"
                stroke="var(--border-color)"
                strokeWidth="5"
                fill="transparent"
                r="24"
                cx="30"
                cy="30"
              />
              <circle
                className="progress-ring-circle"
                stroke="var(--accent)"
                strokeWidth="5"
                fill="transparent"
                r="24"
                cx="30"
                cy="30"
                style={{
                  strokeDasharray: `${2 * Math.PI * 24}`,
                  strokeDashoffset: `${2 * Math.PI * 24 * (1 - completionRate / 100)}`
                }}
              />
            </svg>
            <span className="progress-ring-text">{completionRate}%</span>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card total">
          <div className="stat-icon-wrapper">
            <Layers size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{totalTasks}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-progress-bar">
            <div className="stat-progress-fill" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="stat-card completed">
          <div className="stat-icon-wrapper">
            <CheckCircle2 size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{completedTasks}</span>
            <span className="stat-label">Completed</span>
          </div>
          <div className="stat-progress-bar">
            <div className="stat-progress-fill" style={{ width: `${completionRate}%` }}></div>
          </div>
        </div>

        <div className="stat-card pending">
          <div className="stat-icon-wrapper">
            <Clock size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{pendingTasks}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-progress-bar">
            <div 
              className="stat-progress-fill" 
              style={{ width: `${totalTasks > 0 ? (pendingTasks / totalTasks) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="stat-card urgent">
          <div className="stat-icon-wrapper">
            <AlertOctagon size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{highPriorityTasks}</span>
            <span className="stat-label">Urgent Pending</span>
          </div>
          <div className="stat-progress-bar">
            <div 
              className="stat-progress-fill" 
              style={{ width: `${totalTasks > 0 ? (highPriorityTasks / totalTasks) * 100 : 0}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
