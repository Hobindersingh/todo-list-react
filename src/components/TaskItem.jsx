import React, { useState } from 'react';
import { 
  Calendar, Trash2, Edit2, ChevronDown, ChevronUp, 
  CheckCircle2, Circle 
} from 'lucide-react';

export default function TaskItem({ 
  task, 
  categories, 
  onToggleComplete, 
  onDelete, 
  onEdit,
  onToggleSubtask 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  const categoryObj = categories.find(c => c.id === task.category) || { name: 'Personal', color: '#6366f1' };
  
  // Calculate subtasks info
  const totalSubtasks = task.subtasks?.length || 0;
  const completedSubtasks = task.subtasks?.filter(sub => sub.completed).length || 0;
  const subtaskPercentage = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  // Format due date indicator
  const getDueDateLabel = () => {
    if (!task.dueDate) return null;
    
    const now = new Date();
    const due = new Date(task.dueDate);
    const diffTime = due - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const formattedTime = due.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const formattedDate = due.toLocaleDateString([], { month: 'short', day: 'numeric' });

    if (diffTime < 0) {
      // Overdue
      const daysOverdue = Math.abs(Math.floor(diffTime / (1000 * 60 * 60 * 24)));
      if (daysOverdue === 0) return { text: `Overdue (today at ${formattedTime})`, class: 'overdue' };
      return { text: `Overdue by ${daysOverdue} day${daysOverdue > 1 ? 's' : ''}`, class: 'overdue' };
    }

    if (diffDays === 0) {
      return { text: `Due today at ${formattedTime}`, class: 'due-today' };
    }
    if (diffDays === 1) {
      return { text: `Due tomorrow at ${formattedTime}`, class: 'due-tomorrow' };
    }
    if (diffDays <= 7) {
      return { text: `Due ${formattedDate} (${due.toLocaleDateString([], { weekday: 'short' })} at ${formattedTime})`, class: 'due-soon' };
    }
    return { text: `Due ${formattedDate} at ${formattedTime}`, class: 'due-future' };
  };

  const dueInfo = getDueDateLabel();

  return (
    <div className={`task-card ${task.completed ? 'completed' : ''} priority-${task.priority}`}>
      <div className="task-card-main">
        <button 
          className="task-toggle-btn"
          onClick={() => onToggleComplete(task.id)}
          aria-label={task.completed ? 'Mark task incomplete' : 'Mark task completed'}
        >
          {task.completed ? (
            <CheckCircle2 className="icon-completed" size={22} />
          ) : (
            <Circle className="icon-incomplete" size={22} />
          )}
        </button>

        <div className="task-details-summary">
          <div className="task-badges">
            <span 
              className="badge-category" 
              style={{ backgroundColor: `${categoryObj.color}15`, color: categoryObj.color }}
            >
              {categoryObj.name}
            </span>
            <span className={`badge-priority ${task.priority}`}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
            </span>
          </div>

          <h3 className="task-card-title">{task.title}</h3>
          
          {dueInfo && !task.completed && (
            <div className={`due-date-indicator ${dueInfo.class}`}>
              <Calendar size={12} />
              <span>{dueInfo.text}</span>
            </div>
          )}
        </div>

        <div className="task-card-actions">
          <button 
            className="action-btn edit"
            onClick={() => onEdit(task)}
            aria-label="Edit task"
            title="Edit Task"
          >
            <Edit2 size={15} />
          </button>
          
          <button 
            className="action-btn delete"
            onClick={() => onDelete(task.id)}
            aria-label="Delete task"
            title="Delete Task"
          >
            <Trash2 size={15} />
          </button>

          {(task.description || totalSubtasks > 0) && (
            <button
              className="action-btn expand"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              title={isExpanded ? 'Collapse Details' : 'Expand Details'}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </div>
      </div>

      {/* Subtask Mini Progress Bar (Only show if subtasks exist, visible when collapsed as well) */}
      {totalSubtasks > 0 && (
        <div className="task-card-progress-bar-container">
          <div className="progress-info">
            <span>Progress</span>
            <span>{completedSubtasks}/{totalSubtasks} subtasks</span>
          </div>
          <div className="progress-bar-track">
            <div 
              className="progress-bar-fill" 
              style={{ 
                width: `${subtaskPercentage}%`,
                background: task.completed ? 'var(--success)' : `var(--accent)`
              }}
            />
          </div>
        </div>
      )}

      {/* Expanded details: description and subtask list */}
      {isExpanded && (task.description || totalSubtasks > 0) && (
        <div className="task-card-expanded-content">
          {task.description && (
            <div className="task-expanded-description">
              <h4>Description</h4>
              <p>{task.description}</p>
            </div>
          )}

          {totalSubtasks > 0 && (
            <div className="task-expanded-subtasks">
              <h4>Subtasks Checklist</h4>
              <ul className="subtasks-checklist">
                {task.subtasks.map(sub => (
                  <li 
                    key={sub.id} 
                    className={`subtask-checklist-item ${sub.completed ? 'completed' : ''}`}
                    onClick={() => onToggleSubtask(task.id, sub.id)}
                  >
                    <button 
                      className="subtask-checkbox" 
                      aria-label={sub.completed ? 'Mark subtask incomplete' : 'Mark subtask completed'}
                    >
                      {sub.completed ? (
                        <CheckCircle2 size={16} className="subtask-checked" />
                      ) : (
                        <Circle size={16} className="subtask-unchecked" />
                      )}
                    </button>
                    <span className="subtask-text">{sub.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
