import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Stack,
  SelectChangeEvent,
  Typography,
  useTheme,
  useMediaQuery,
  Paper,
  IconButton,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskInput, Task } from '../../../types';
import FlagIcon from '@mui/icons-material/Flag';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AddTaskIcon from '@mui/icons-material/AddTask';
import EditNoteIcon from '@mui/icons-material/EditNote';
import CloseIcon from '@mui/icons-material/Close';
import { alpha } from '@mui/material/styles';
import { useTaskStore } from '../../../store/taskStore';

type Priority = 'low' | 'medium' | 'high';

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return 'error';
    case 'medium':
      return 'warning';
    case 'low':
      return 'info';
    default:
      return 'info';
  }
};

const getPriorityIcon = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return <ErrorOutlineIcon />;
    case 'medium':
      return <FlagIcon />;
    case 'low':
      return <InfoOutlinedIcon />;
    default:
      return <InfoOutlinedIcon />;
  }
};

interface TaskFormProps {
  onSubmit: (task: TaskInput) => Task;
  onCancel?: () => void;
  initialValues?: TaskInput;
  isEdit?: boolean;
}

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      staggerChildren: 0.1,
    }
  }
};

const itemAnimation = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    }
  }
};

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  onCancel,
  initialValues = { title: '', description: '', priority: 'low' as const },
  isEdit = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [formData, setFormData] = useState<TaskInput>(initialValues);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const { tasks } = useTaskStore();

  useEffect(() => {
    // Focus the title input when the form opens
    if (titleInputRef.current) {
      titleInputRef.current.focus();
      // If editing, move cursor to the end of the text
      if (isEdit) {
        const length = titleInputRef.current.value.length;
        titleInputRef.current.setSelectionRange(length, length);
      }
    }
  }, [isEdit]);

  const validateInput = (input: TaskInput): string | null => {
    // Title validations
    if (!input.title.trim()) {
      return 'Title is required';
    }
    if (input.title.length > 100) {
      return 'Title must be 100 characters or less';
    }

    // Check for duplicate title only when adding new tasks
    if (!isEdit) {
      const duplicateTask = tasks.find(
        task => task.title.toLowerCase() === input.title.toLowerCase()
      );
      if (duplicateTask) {
        return 'A task with this title already exists';
      }
    }

    // Description validations
    if (!input.description.trim()) {
      return 'Description is required';
    }
    const wordCount = input.description.trim().split(/\s+/).length;
    if (wordCount > 100) {
      return 'Description must be 100 words or less';
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateInput(formData);
    if (validationError) {
      setError(validationError);
      if (validationError.includes('Title')) {
        titleInputRef.current?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    try {
      onSubmit({
        ...formData,
        priority: formData.priority || 'low',
      });
      if (!isEdit) {
        // Reset form only if it's not in edit mode
        setFormData({ title: '', description: '', priority: 'low' });
        titleInputRef.current?.focus();
      }
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handlePriorityChange = (e: SelectChangeEvent<string>) => {
    setFormData((prev) => ({
      ...prev,
      priority: (e.target.value as 'low' | 'medium' | 'high') || 'low',
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Close on Escape
    if (e.key === 'Escape' && onCancel) {
      onCancel();
    }
  };

  const getHelperText = (field: 'title' | 'description') => {
    if (error && error.toLowerCase().includes(field)) {
      return error;
    }
    if (field === 'title') {
      return `${formData.title.length}/100 characters`;
    }
    const wordCount = formData.description.trim().split(/\s+/).length;
    return `${wordCount}/100 words`;
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formAnimation}
      onKeyDown={handleKeyDown}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 3 },
          borderRadius: { xs: 2, sm: 3 },
          bgcolor: 'background.paper',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: 6,
          },
          position: 'relative',
        }}
      >
        {isEdit && onCancel && (
          <IconButton
            onClick={onCancel}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ width: '100%' }}
        >
          <Stack spacing={3}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              {isEdit ? (
                <EditNoteIcon color="primary" sx={{ fontSize: { xs: 24, sm: 32 } }} />
              ) : (
                <AddTaskIcon color="primary" sx={{ fontSize: { xs: 24, sm: 32 } }} />
              )}
              <Typography
                variant="h5"
                component="h2"
                sx={{
                  fontWeight: 600,
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                  color: 'primary.main',
                }}
              >
                {isEdit ? 'Edit Task' : 'Add New Task'}
              </Typography>
            </Stack>

            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <Alert 
                    severity="error" 
                    onClose={() => setError(null)}
                    sx={{
                      borderRadius: 2,
                      '& .MuiAlert-icon': {
                        fontSize: { xs: 20, sm: 24 },
                      },
                    }}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemAnimation}>
              <TextField
                fullWidth
                inputRef={titleInputRef}
                label="Task Title"
                name="title"
                value={formData.title}
                onChange={handleTextChange}
                error={!!error && error.includes('Title')}
                variant="outlined"
                placeholder="Enter task title..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                      },
                    },
                  },
                }}
                helperText={getHelperText('title')}
              />
            </motion.div>

            <motion.div variants={itemAnimation}>
              <TextField
                fullWidth
                label="Task Description"
                name="description"
                value={formData.description}
                onChange={handleTextChange}
                error={!!error && error.includes('Description')}
                multiline
                rows={3}
                variant="outlined"
                placeholder="Enter task description..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                      },
                    },
                  },
                }}
                helperText={getHelperText('description')}
              />
            </motion.div>

            <motion.div variants={itemAnimation}>
              <FormControl fullWidth>
                <InputLabel id="priority-label">Priority</InputLabel>
                <Select
                  labelId="priority-label"
                  name="priority"
                  value={formData.priority || 'low'}
                  onChange={handlePriorityChange}
                  label="Priority"
                  sx={{
                    borderRadius: 2,
                    '& .MuiSelect-select': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    },
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderWidth: 2,
                      },
                    },
                  }}
                >
                  {(['low', 'medium', 'high'] as const).map((priority) => (
                    <MenuItem
                      key={priority}
                      value={priority}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        color: `${getPriorityColor(priority)}.main`,
                        py: 1.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: (theme) => alpha(theme.palette[getPriorityColor(priority)].main, 0.08),
                        },
                        '&.Mui-selected': {
                          bgcolor: (theme) => alpha(theme.palette[getPriorityColor(priority)].main, 0.12),
                          '&:hover': {
                            bgcolor: (theme) => alpha(theme.palette[getPriorityColor(priority)].main, 0.16),
                          },
                        },
                      }}
                    >
                      {getPriorityIcon(priority)}
                      <Typography 
                        sx={{ 
                          textTransform: 'capitalize',
                          fontWeight: 500,
                        }}
                      >
                        {priority}
                      </Typography>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </motion.div>

            <motion.div variants={itemAnimation}>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                {isEdit && onCancel && (
                  <Button
                    variant="outlined"
                    onClick={onCancel}
                    sx={{
                      borderRadius: 2,
                      py: { xs: 0.75, sm: 1.25 },
                      px: { xs: 2, sm: 3 },
                      textTransform: 'none',
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                      fontWeight: 600,
                      minHeight: { xs: 36, sm: 44 },
                      minWidth: { xs: 'auto', sm: 100 },
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    Cancel
                  </Button>
                )}
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={isEdit ? <EditNoteIcon /> : <AddTaskIcon />}
                  sx={{
                    borderRadius: 2,
                    py: { xs: 0.75, sm: 1.25 },
                    px: { xs: 2, sm: 3 },
                    textTransform: 'none',
                    fontSize: { xs: '0.875rem', sm: '1rem' },
                    fontWeight: 600,
                    minHeight: { xs: 36, sm: 44 },
                    minWidth: { xs: 'auto', sm: 120 },
                    boxShadow: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      boxShadow: 4,
                      transform: 'translateY(-2px)',
                    },
                    '&:active': {
                      boxShadow: 1,
                      transform: 'translateY(0)',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'action.disabledBackground',
                    },
                  }}
                >
                  {isSubmitting ? 'Processing...' : (
                    isMobile ? (
                      isEdit ? 'Update' : 'Add'
                    ) : (
                      isEdit ? 'Update Task' : 'Add Task'
                    )
                  )}
                </Button>
              </Stack>
            </motion.div>
          </Stack>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default TaskForm; 