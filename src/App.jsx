import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Toast from './components/Toast';
import { Plus } from 'lucide-react';
import './App.css';

// Default categories
const DEFAULT_CATEGORIES = [
  { id: 'personal', name: 'Personal', color: '#6366f1' }, // Indigo
  { id: 'work', name: 'Work', color: '#f59e0b' },       // Amber
  { id: 'shopping', name: 'Shopping', color: '#ec4899' }, // Pink
  { id: 'health', name: 'Health', color: '#10b981' }      // Emerald
];

export default function App() {
  // --- STATE ---
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem('zenflow_tasks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [categories, setCategories] = useState(() => {
    try {
      const saved = localStorage.getItem('zenflow_categories');
      return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
    } catch {
      return DEFAULT_CATEGORIES;
    }
  });

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('zenflow_theme');
      if (saved) return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  const [toast, setToast] = useState(null);

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('zenflow_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('zenflow_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('zenflow_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // --- ACTIONS ---
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleToggleComplete = (taskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const nextCompleted = !task.completed;
          showToast(
            nextCompleted ? 'Task completed! Keep it up! 🎉' : 'Task marked as active.',
            nextCompleted ? 'success' : 'info'
          );
          return { ...task, completed: nextCompleted };
        }
        return task;
      })
    );
  };

  const handleToggleSubtask = (taskId, subtaskId) => {
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map(sub => {
            if (sub.id === subtaskId) {
              return { ...sub, completed: !sub.completed };
            }
            return sub;
          });

          // Check if all subtasks are now completed
          const allCompleted = updatedSubtasks.length > 0 && updatedSubtasks.every(s => s.completed);
          
          return { 
            ...task, 
            subtasks: updatedSubtasks,
            // Optionally auto-complete the parent task if all subtasks are finished
            completed: allCompleted ? true : task.completed
          };
        }
        return task;
      })
    );
  };

  const handleDelete = (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      setTasks(prevTasks => prevTasks.filter(t => t.id !== taskId));
      showToast('Task deleted successfully.', 'error');
    }
  };

  const handleEditClick = (task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleOpenAddTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleAddOrEditTask = (taskData) => {
    if (editingTask) {
      // Editing
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === editingTask.id) {
            return {
              ...task,
              ...taskData,
              updatedAt: new Date().toISOString()
            };
          }
          return task;
        })
      );
      showToast('Task updated successfully!', 'success');
    } else {
      // Adding
      const newTask = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString()
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
      showToast('Task created successfully! 🚀', 'success');
    }
    setEditingTask(null);
  };

  const handleAddCategory = (newCat) => {
    setCategories(prev => [...prev, newCat]);
    showToast(`Category "${newCat.name}" created!`, 'success');
  };

  const handleDeleteCategory = (catId) => {
    setCategories(prev => prev.filter(c => c.id !== catId));
    // Re-assign tasks in this category to default 'personal'
    setTasks(prev => prev.map(t => {
      if (t.category === catId) {
        return { ...t, category: 'personal' };
      }
      return t;
    }));
    // If selectedCategory was the deleted one, reset filter to 'all'
    if (selectedCategory === catId) {
      setSelectedCategory('all');
    }
    showToast('Category deleted. Tasks moved to Personal.', 'warning');
  };

  // --- DATA TRANSFER ---
  const handleExportBackup = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      tasks,
      categories
    };

    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `zenflow_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Backup file exported! 📥', 'info');
  };

  const handleImportBackup = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        if (Array.isArray(data.tasks) && Array.isArray(data.categories)) {
          setTasks(data.tasks);
          setCategories(data.categories);
          showToast('Data imported successfully! 🎉', 'success');
        } else {
          showToast('Invalid backup file structure.', 'error');
        }
      } catch {
        showToast('Failed to parse backup JSON.', 'error');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-layout">
      {/* Sidebar Navigation */}
      <Sidebar
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        onAddCategory={handleAddCategory}
        onDeleteCategory={handleDeleteCategory}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
        theme={theme}
        toggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
      />

      {/* Main Panel */}
      <main className="app-main-panel">
        <div className="main-panel-content custom-scroll">
          {/* Dashboard Summary Stats */}
          <Dashboard tasks={tasks} />

          {/* Filtering, Search & List Area */}
          <TaskList
            tasks={tasks}
            categories={categories}
            selectedCategory={selectedCategory}
            onToggleComplete={handleToggleComplete}
            onDelete={handleDelete}
            onEdit={handleEditClick}
            onToggleSubtask={handleToggleSubtask}
            onOpenAddTaskModal={handleOpenAddTaskModal}
          />
        </div>

        {/* Global floating Quick Action button */}
        <button 
          className="global-fab-btn"
          onClick={handleOpenAddTaskModal}
          aria-label="Add new task"
          title="Add New Task"
        >
          <Plus size={24} />
        </button>
      </main>

      {/* Task Creation & Editing Dialog */}
      <TaskForm
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleAddOrEditTask}
        categories={categories}
        editingTask={editingTask}
      />

      {/* Action alerts notifications */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
