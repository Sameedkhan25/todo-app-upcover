import { SxProps, Theme } from '@mui/material';
import FlagIcon from '@mui/icons-material/Flag';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export type Priority = 'low' | 'medium' | 'high';

export const getPriorityColor = (priority?: Priority) => {
  switch (priority) {
    case 'high':
      return 'error.main';
    case 'medium':
      return 'warning.main';
    case 'low':
      return 'info.main';
    default:
      return 'text.secondary';
  }
};

export const getPriorityIcon = (priority?: Priority) => {
  switch (priority) {
    case 'high':
      return ErrorOutlineIcon;
    case 'medium':
      return FlagIcon;
    case 'low':
      return InfoOutlinedIcon;
    default:
      return InfoOutlinedIcon;
  }
};

export const getPriorityStyles = (priority?: Priority): SxProps<Theme> => ({
  backgroundColor: `${getPriorityColor(priority)}15`,
  color: getPriorityColor(priority),
  borderRadius: 1,
  px: 1,
  py: 0.5,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 0.5,
  fontSize: '0.875rem',
});

// Animation variants for Framer Motion
export const taskItemAnimations = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, x: -20 },
  transition: { duration: 0.2 },
};

export const taskListAnimations = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { staggerChildren: 0.1 },
};

export const editHighlightAnimation = {
  initial: { backgroundColor: 'transparent' },
  animate: { backgroundColor: ['rgba(144, 202, 249, 0.2)', 'transparent'] },
  transition: { duration: 0.5 },
}; 