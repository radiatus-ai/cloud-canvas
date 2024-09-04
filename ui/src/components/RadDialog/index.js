import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material';
import React, { forwardRef } from 'react';
import PaperComponent from './PaperComponent';

const RadDialog = forwardRef(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      actions,
      fullWidth = true,
      maxWidth = 'sm',
      showCloseButton = true,
      ...dialogProps
    },
    ref
  ) => {
    return (
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        PaperComponent={PaperComponent}
        ref={ref}
        {...dialogProps}
      >
        {title && (
          <DialogTitle>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Typography variant="h6">{title}</Typography>
              {showCloseButton && (
                <IconButton
                  edge="end"
                  color="inherit"
                  onClick={onClose}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </DialogTitle>
        )}
        <DialogContent>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </Dialog>
    );
  }
);

export default RadDialog;
