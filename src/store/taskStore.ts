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
        // Validate input
        if (!input.title?.trim() || !input.description?.trim()) {
          throw new Error('Title and description are required');
        }

        // Check for duplicate title
        const existingTask = get().tasks.find(
          task => task?.title?.toLowerCase() === input.title.toLowerCase()
        );
        if (existingTask) {
          throw new Error('A task with this title already exists');
        }

        const newTask: Task = {
          id: crypto.randomUUID(),
          title: input.title.trim(),
          description: input.description.trim(),
          priority: input.priority || 'low',
          completed: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        set((state) => ({
          tasks: [...(state.tasks || []), newTask],
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
        set((state) => {
          if (!id || typeof id !== 'string') {
            console.error('Invalid task ID provided');
            return state;
          }

          // Ensure we have tasks to work with
          if (!Array.isArray(state.tasks)) {
            console.error('Tasks array is invalid');
            return state;
          }

          // Find the task first
          const taskToToggle = state.tasks.find(t => t && t.id === id);
          if (!taskToToggle) {
            console.error(`Task with ID ${id} not found`);
            return state;
          }

          // Create new tasks array with the toggled task
          const updatedTasks = state.tasks.map((task) => {
            if (!task || task.id !== id) return task;
            return {
              ...task,
              completed: !task.completed,
              updatedAt: Date.now(),
            };
          });

          return {
            ...state,
            tasks: updatedTasks,
          };
        }),

      deleteTask: (id: string) =>
        set((state) => {
          if (!id || typeof id !== 'string') {
            console.error('Invalid task ID provided for deletion');
            return state;
          }

          // Ensure we have tasks to work with
          if (!Array.isArray(state.tasks)) {
            console.error('Tasks array is invalid');
            return state;
          }

          // Find the task first to ensure it exists
          const taskToDelete = state.tasks.find(t => t && t.id === id);
          if (!taskToDelete) {
            console.error(`Task with ID ${id} not found for deletion`);
            return state;
          }

          return {
            ...state,
            tasks: state.tasks.filter((task) => task && task.id !== id),
          };
        }),

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