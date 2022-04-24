import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';

export default function CheckboxWithLabel({ checked = false, setChecked = () => {}, label = 'checkbox with label' }) {
  return (
    <FormControlLabel
      control={<Switch checked={checked} onChange={(event) => setChecked(event.target.checked)} />}
      label={label}
    />
  );
}
