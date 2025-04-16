// useInput.ts - a custom hook
import { useState } from 'react';

function useInput<T extends string | number | boolean | readonly string[] | undefined>(
  initialValue: T
) {
  const [value, setValue] = useState<T>(initialValue);
  
  // Handle input changes
  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const target = event.target;
    const value = target.type === 'checkbox' 
      ? (target as HTMLInputElement).checked 
      : target.value;
    
    setValue(value as T);
  };
  
  // Reset input to initial value
  const reset = () => {
    setValue(initialValue);
  };
  
  // Return everything needed by components
  return {
    value,
    onChange: handleChange,
    reset,
  };
}

export default useInput;