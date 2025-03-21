import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Box,
  Chip,
  Stack,
  Tooltip,
  Checkbox,
  alpha,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import FlagIcon from '@mui/icons-material/Flag';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Task } from '../../../types';

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
      return <ErrorOutlineIcon fontSize="small" />;
    case 'medium':
      return <FlagIcon fontSize="small" />;
    case 'low':
      return <InfoOutlinedIcon fontSize="small" />;
    default:
      return <InfoOutlinedIcon fontSize="small" />;
  }
};

interface TaskItemProps {
  task: Task & { priority: Priority };
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string, completed: boolean) => void;
}

const taskItemAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -100 },
  transition: { duration: 0.2 }
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onEdit,
  onDelete,
  onToggleComplete,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleToggleComplete = (event: React.ChangeEvent<HTMLInputElement>) => {
    onToggleComplete(task.id, event.target.checked);
  };

  return (
    <motion.div
      {...taskItemAnimation}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card
        sx={{
          position: 'relative',
          borderRadius: 2,
          boxShadow: 2,
          transition: 'all 0.2s ease-in-out',
          opacity: task.completed ? 0.7 : 1,
          '&:hover': {
            boxShadow: 4,
          },
          bgcolor: (theme) => 
            task.completed 
              ? alpha(theme.palette.background.paper, 0.7)
              : theme.palette.background.paper,
        }}
      >
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <Checkbox
              checked={task.completed}
              onChange={handleToggleComplete}
              sx={{
                '&.Mui-checked': {
                  color: (theme) => theme.palette[getPriorityColor(task.priority)].main,
                },
              }}
            />
            
            <Box sx={{ flexGrow: 1 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    textDecoration: task.completed ? 'line-through' : 'none',
                    color: task.completed ? 'text.secondary' : 'text.primary',
                  }}
                >
                  {task.title}
                </Typography>
                
                <Chip
                  icon={getPriorityIcon(task.priority)}
                  label={task.priority}
                  size="small"
                  color={getPriorityColor(task.priority)}
                  sx={{
                    textTransform: 'capitalize',
                    ml: 1,
                  }}
                />
              </Stack>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  textDecoration: task.completed ? 'line-through' : 'none',
                  opacity: task.completed ? 0.7 : 1,
                }}
              >
                {task.description}
              </Typography>
            </Box>

            <AnimatePresence>
              {(isHovered || task.completed) && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Stack direction="row" spacing={1}>
                    <Tooltip title="Edit task">
                      <IconButton
                        size="small"
                        onClick={() => onEdit(task)}
                        sx={{
                          color: 'primary.main',
                          '&:hover': { bgcolor: 'primary.lighter' },
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    
                    <Tooltip title="Delete task">
                      <IconButton
                        size="small"
                        onClick={() => onDelete(task.id)}
                        sx={{
                          color: 'error.main',
                          '&:hover': { bgcolor: 'error.lighter' },
                        }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskItem; 