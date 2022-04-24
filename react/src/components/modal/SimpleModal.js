import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

export default function FormDialog({
  open,
  setOpen,
  children,
  onSave = () => '',
  maxWidth = 'sm',
  color = '',
  header = 'Modal',
}) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth={maxWidth}>
        <DialogTitle style={{ color: color }}>{header}</DialogTitle>
        <DialogContent style={{ paddingTop: 6, paddingBottom: 12 }}>{children}</DialogContent>
        <DialogActions style={{ padding: '1px 24px 14px' }}>
          <Button style={color ? { color: 'rgb(161 161 161)' } : { color: 'rgb(25, 118, 210)' }} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            style={color ? { backgroundColor: color, color: 'white' } : { color: 'rgb(25, 118, 210)' }}
            onClick={onSave}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
