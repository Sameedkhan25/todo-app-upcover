import { saveToLocalStorage, loadFromLocalStorage } from '../utils/localStorage';
import { Task } from '../types';

describe('localStorage Utils', () => {
  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task 1',
      description: 'Description 1',
      completed: false,
      createdAt: Date.now(),
    },
    {
      id: '2',
      title: 'Test Task 2',
      description: 'Description 2',
      completed: true,
      createdAt: Date.now(),
    },
  ];

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('saves tasks to localStorage', () => {
    saveToLocalStorage('tasks', mockTasks);
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'tasks',
      JSON.stringify(mockTasks)
    );
  });

  it('loads tasks from localStorage', () => {
    localStorage.getItem = jest.fn().mockReturnValue(JSON.stringify(mockTasks));
    const loadedTasks = loadFromLocalStorage<Task[]>('tasks', []);
    expect(loadedTasks).toEqual(mockTasks);
    expect(localStorage.getItem).toHaveBeenCalledWith('tasks');
  });

  it('returns default value when localStorage is empty', () => {
    localStorage.getItem = jest.fn().mockReturnValue(null);
    const defaultValue: Task[] = [];
    const result = loadFromLocalStorage<Task[]>('tasks', defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it('handles invalid JSON in localStorage', () => {
    localStorage.getItem = jest.fn().mockReturnValue('invalid json');
    const defaultValue: Task[] = [];
    const result = loadFromLocalStorage<Task[]>('tasks', defaultValue);
    expect(result).toEqual(defaultValue);
  });

  it('handles localStorage errors gracefully', () => {
    const error = new Error('localStorage error');
    localStorage.setItem = jest.fn().mockImplementation(() => {
      throw error;
    });

    expect(() => saveToLocalStorage('tasks', mockTasks)).not.toThrow();
  });
}); 