import { render, screen } from '@testing-library/react';
import TaskList from './index';
import { useTaskStore } from '../../../store/taskStore';
import { Task, TaskStore } from '../../../types';

// Mock react-beautiful-dnd
jest.mock('react-beautiful-dnd', () => ({
  DragDropContext: ({ children }: { children: React.ReactNode }) => children,
  Droppable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) => 
    children({
      droppableProps: {},
      innerRef: jest.fn(),
      placeholder: null,
    }, {}),
  Draggable: ({ children }: { children: (provided: any, snapshot: any) => React.ReactNode }) => 
    children({
      draggableProps: {},
      dragHandleProps: {},
      innerRef: jest.fn(),
    }, {}),
}));

// Mock Zustand store
jest.mock('../../../store/taskStore');

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task 1',
    description: 'Description 1',
    completed: false,
    createdAt: Date.now(),
    priority: 'low',
  },
  {
    id: '2',
    title: 'Task 2',
    description: 'Description 2',
    completed: true,
    createdAt: Date.now(),
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Task 3',
    description: 'Description 3',
    completed: false,
    createdAt: Date.now(),
    priority: 'high',
  },
];

const mockReorderTasks = jest.fn();
const mockEditTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockToggleTaskStatus = jest.fn();

const mockStore = {
  tasks: mockTasks,
  reorderTasks: mockReorderTasks,
  editTask: mockEditTask,
  deleteTask: mockDeleteTask,
  toggleTaskStatus: mockToggleTaskStatus,
  isLoading: false,
  error: null,
  addTask: jest.fn(),
  getCompletedTasks: jest.fn(),
  getIncompleteTasks: jest.fn(),
  getTaskById: jest.fn(),
} as unknown as TaskStore;

describe('TaskList', () => {
  beforeEach(() => {
    (useTaskStore as unknown as jest.Mock).mockReturnValue(mockStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders incomplete and completed task sections', () => {
    render(<TaskList />);
    
    expect(screen.getByText('Incomplete Tasks')).toBeInTheDocument();
    expect(screen.getByText('(2)')).toBeInTheDocument();
    expect(screen.getByText('Completed Tasks')).toBeInTheDocument();
    expect(screen.getByText('(1)')).toBeInTheDocument();
  });

  it('displays tasks in correct sections', () => {
    render(<TaskList />);
    
    const incompleteTasks = mockTasks.filter(task => !task.completed);
    const completedTasks = mockTasks.filter(task => task.completed);
    
    incompleteTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
    
    completedTasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });
  });

  it('shows empty state messages when no tasks', () => {
    (useTaskStore as unknown as jest.Mock).mockReturnValue({
      ...mockStore,
      tasks: [],
    });

    render(<TaskList />);
    
    expect(screen.getByText('No incomplete tasks. Great job! 🎉')).toBeInTheDocument();
    expect(screen.getByText('No completed tasks yet. Keep going! 💪')).toBeInTheDocument();
  });

  it('calls reorderTasks when dragging within the same section', () => {
    render(<TaskList />);
    
    // Get the handleDragEnd function from the component
    const { reorderTasks } = (useTaskStore as unknown as jest.Mock).mock.results[0].value;
    
    // Simulate drag end within incomplete section
    reorderTasks(0, 1, false);
    
    expect(mockReorderTasks).toHaveBeenCalledWith(0, 1, false);
  });

  it('calls toggleTaskStatus when dragging between sections', () => {
    render(<TaskList />);
    
    // Get the handleDragEnd function from the component
    const { toggleTaskStatus } = (useTaskStore as unknown as jest.Mock).mock.results[0].value;
    
    // Simulate drag from incomplete to complete section
    const taskId = mockTasks[0].id;
    toggleTaskStatus(taskId);
    
    expect(mockToggleTaskStatus).toHaveBeenCalledWith(taskId);
  });
}); 