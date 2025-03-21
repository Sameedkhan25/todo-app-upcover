import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Task, TaskStore, TaskInput, TaskEditInput } from '../types';

export const useTaskStore = create<TaskStore>()(
  persist(
    (set, get) => ({
      // State
      tasks: [],
      isLoading: false,
      error: null,

      // Actions
      addTask: (input: TaskInput) => {
        const newTask: Task = {
          id: crypto.randomUUID(),
          title: input.title,
          description: input.description,
          priority: input.priority,
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          tasks: [...state.tasks, newTask],
        }));

        return newTask;
      },

      editTask: (id: string, updates: TaskEditInput) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  ...updates,
                  updatedAt: Date.now(),
                }
              : task
          ),
        })),

      toggleTaskStatus: (id: string) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id
              ? {
                  ...task,
                  completed: !task.completed,
                  updatedAt: Date.now(),
                }
              : task
          ),
        })),

      deleteTask: (id: string) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        })),

      reorderTasks: (sourceIndex: number, destinationIndex: number, isCompleted: boolean) =>
        set((state) => {
          // Get the tasks in the current section
          const sectionTasks = state.tasks.filter((task) => task.completed === isCompleted);
          const otherTasks = state.tasks.filter((task) => task.completed !== isCompleted);
          
          // Remove the task from its current position
          const [movedTask] = sectionTasks.splice(sourceIndex, 1);
          
          // Insert the task at its new position
          sectionTasks.splice(destinationIndex, 0, movedTask);
          
          // Combine the reordered section with the other tasks
          return {
            tasks: isCompleted 
              ? [...otherTasks, ...sectionTasks] 
              : [...sectionTasks, ...otherTasks],
          };
        }),

      // Selectors
      getCompletedTasks: () => get().tasks.filter((task) => task.completed),
      getIncompleteTasks: () => get().tasks.filter((task) => !task.completed),
      getTaskById: (id: string) => get().tasks.find((task) => task.id === id),
    }),
    {
      name: 'task-storage',
    }
  )
); 