import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

// Wrap Dialog with motion for animations
const MotionDialog = motion(Dialog);

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  severity?: 'error' | 'warning';
  onConfirm: () => void;
  onCancel: () => void;
}

const modalAnimation = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
  transition: { type: 'spring', duration: 0.5 }
};

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  severity = 'error',
  onConfirm,
  onCancel,
}) => (
  <AnimatePresence>
    {open && (
      <MotionDialog
        open={open}
        onClose={onCancel}
        {...modalAnimation}
        PaperProps={{
          sx: {
            borderRadius: 2,
            p: 1,
            overflow: 'hidden'
          },
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <DialogTitle 
            sx={{ 
              pr: 6,
              color: severity === 'error' ? 'error.main' : 'warning.main'
            }}
          >
            {title}
            <IconButton
              aria-label="close"
              onClick={onCancel}
              sx={{
                position: 'absolute',
                right: 8,
                top: 8,
                color: 'text.secondary',
                '&:hover': {
                  color: severity === 'error' ? 'error.main' : 'warning.main',
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>

          <DialogContent>
            <DialogContentText>{message}</DialogContentText>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button
              onClick={onCancel}
              variant="outlined"
              color="inherit"
              sx={{ 
                borderRadius: 2,
                minWidth: 100,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              variant="contained"
              color={severity}
              sx={{ 
                borderRadius: 2,
                minWidth: 100,
                '&:hover': {
                  backgroundColor: severity === 'error' ? 'error.dark' : 'warning.dark',
                },
              }}
              autoFocus
            >
              {confirmText}
            </Button>
          </DialogActions>
        </Box>
      </MotionDialog>
    )}
  </AnimatePresence>
);

export default ConfirmModal; 