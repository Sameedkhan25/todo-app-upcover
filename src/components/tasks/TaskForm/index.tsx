import React, { useState } from 'react';
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
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskInput } from '../../../types';
import FlagIcon from '@mui/icons-material/Flag';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

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
  onSubmit: (task: TaskInput) => void;
  initialValues?: TaskInput;
  isEdit?: boolean;
}

const formAnimation = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const TaskForm: React.FC<TaskFormProps> = ({
  onSubmit,
  initialValues = { title: '', description: '', priority: 'low' },
  isEdit = false,
}) => {
  const [formData, setFormData] = useState<TaskInput>(initialValues);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.description.trim()) {
      setError('Description is required');
      return;
    }

    onSubmit(formData);

    if (!isEdit) {
      // Reset form only if it's not in edit mode
      setFormData({ title: '', description: '', priority: 'low' });
    }
    setError(null);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const handlePriorityChange = (e: SelectChangeEvent<Priority>) => {
    setFormData((prev) => ({
      ...prev,
      priority: e.target.value as Priority,
    }));
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={formAnimation}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ width: '100%' }}
      >
        <Stack spacing={2}>
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Alert 
                  severity="error" 
                  onClose={() => setError(null)}
                  sx={{ mb: 2 }}
                >
                  {error}
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <TextField
            fullWidth
            label="Task Title"
            name="title"
            value={formData.title}
            onChange={handleTextChange}
            error={!!error && error.includes('Title')}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

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
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              },
            }}
          />

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
              }}
            >
              {(['low', 'medium', 'high'] as Priority[]).map((priority) => (
                <MenuItem
                  key={priority}
                  value={priority}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: `${getPriorityColor(priority)}.main`,
                  }}
                >
                  {getPriorityIcon(priority)}
                  <Typography sx={{ textTransform: 'capitalize' }}>
                    {priority}
                  </Typography>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Button
            type="submit"
            variant="contained"
            size="large"
            sx={{
              borderRadius: 2,
              py: 1.5,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 500,
              boxShadow: 2,
              '&:hover': {
                boxShadow: 4,
              },
            }}
          >
            {isEdit ? 'Update Task' : 'Add Task'}
          </Button>
        </Stack>
      </Box>
    </motion.div>
  );
};

export default TaskForm; 