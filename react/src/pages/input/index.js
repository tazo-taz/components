import React, { useState } from 'react';
import CheckboxWithLabel from '../../components/input/CheckboxWithLabel';

export default function Index() {
  const [checkbox1, setCheckbox1] = useState(false);
  return (
    <div>
      <CheckboxWithLabel checked={checkbox1} setChecked={setCheckbox1} />
    </div>
  );
}
