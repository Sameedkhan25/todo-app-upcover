// Task-related types
export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
  updatedAt?: number;  // Track when a task was last modified
  priority?: 'low' | 'medium' | 'high';  // Optional priority field for future use
}

// Separate input types for cleaner function signatures
export interface TaskInput {
  title: string;
  description: string;
  priority?: 'low' | 'medium' | 'high';
}

export interface TaskEditInput {
  title?: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
}

// Improved TaskStore interface
export interface TaskStore {
  // State
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  addTask: (input: TaskInput) => Task;
  editTask: (id: string, updates: TaskEditInput) => void;
  toggleTaskStatus: (id: string) => void;
  deleteTask: (id: string) => void;
  
  // Task ordering
  reorderTasks: (sourceIndex: number, destinationIndex: number, isCompleted: boolean) => void;
  
  // Selectors (derived state)
  getCompletedTasks: () => Task[];
  getIncompleteTasks: () => Task[];
  getTaskById: (id: string) => Task | undefined;
} 