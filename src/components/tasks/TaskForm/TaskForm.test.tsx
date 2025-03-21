import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TaskForm from '.';
import { useTaskStore } from '../../../store/taskStore';
import { ThemeProvider } from '@mui/material';
import { createAppTheme } from '../../../theme';

// Mock the Zustand store
const mockUseTaskStore = useTaskStore as jest.MockedFunction<typeof useTaskStore>;
jest.mock('../../../store/taskStore', () => ({
  useTaskStore: jest.fn()
}));

const mockTheme = createAppTheme('light');

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <ThemeProvider theme={mockTheme}>
      {ui}
    </ThemeProvider>
  );
};

describe('TaskForm Component', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();
  const mockTasks = [
    { id: '1', title: 'Existing Task', description: 'Description', completed: false, createdAt: Date.now() }
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseTaskStore.mockReturnValue({ tasks: mockTasks });
  });

  it('renders form elements correctly', () => {
    renderWithProviders(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} isEdit={true} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /update task/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    renderWithProviders(<TaskForm onSubmit={mockOnSubmit} onCancel={mockOnCancel} />);

    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
    });

    expect(screen.queryAllByText(/title is required/i)[0]).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('prevents duplicate task names when adding new task', async () => {
    renderWithProviders(<TaskForm onSubmit={mockOnSubmit} />);

    const titleInput = screen.getByLabelText(/title/i);
    const descriptionInput = screen.getByLabelText(/description/i);
    
    await act(async () => {
      await userEvent.type(titleInput, 'Existing Task');
      await userEvent.type(descriptionInput, 'New Description');
    });

    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /add task/i });
      fireEvent.click(submitButton);
    });

    expect(screen.queryAllByText(/a task with this title already exists/i)[0]).toBeInTheDocument();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('allows editing task without duplicate name validation', async () => {
    renderWithProviders(
      <TaskForm
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
        isEdit={true}
        initialValues={{
          title: 'Existing Task',
          description: 'Updated Description',
          priority: 'low'
        }}
      />
    );

    await act(async () => {
      const submitButton = screen.getByRole('button', { name: /update task/i });
      fireEvent.click(submitButton);
    });

    expect(mockOnSubmit).toHaveBeenCalled();
    const duplicateErrors = screen.queryAllByText(/a task with this title already exists/i);
    expect(duplicateErrors.length).toBe(0);
  });
}); 