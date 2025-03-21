import React, { createContext, useContext, ReactNode } from 'react';
import { create } from 'zustand';
import { Task } from '../types/task';
import { loadFromLocalStorage, saveToLocalStorage } from '../utils/localStorage';

interface TodoState {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  toggleTask: (id: string) => void;
}

const useTodoStore = create<TodoState>((set) => ({
  tasks: loadFromLocalStorage('tasks', []),
  addTask: (task) => {
    set((state) => {
      const newTask: Task = {
        ...task,
        id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
      };
      const newTasks = [...state.tasks, newTask];
      saveToLocalStorage('tasks', newTasks);
      return { tasks: newTasks };
    });
  },
  updateTask: (task) => {
    set((state) => {
      const newTasks = state.tasks.map((t) => (t.id === task.id ? task : t));
      saveToLocalStorage('tasks', newTasks);
      return { tasks: newTasks };
    });
  },
  deleteTask: (id) => {
    set((state) => {
      const newTasks = state.tasks.filter((t) => t.id !== id);
      saveToLocalStorage('tasks', newTasks);
      return { tasks: newTasks };
    });
  },
  toggleTask: (id) => {
    set((state) => {
      const newTasks = state.tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveToLocalStorage('tasks', newTasks);
      return { tasks: newTasks };
    });
  },
}));

const TodoContext = createContext<ReturnType<typeof useTodoStore> | null>(null);

export const TodoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <TodoContext.Provider value={useTodoStore()}>
      {children}
    </TodoContext.Provider>
  );
};

export const useTodo = () => {
  const store = useContext(TodoContext);
  if (!store) throw new Error('useTodo must be used within TodoProvider');
  return store;
}; 