import { useState } from 'react';

type FormErrors = {
  [key: string]: string;
};

type FormData = {
  [key: string]: string;
};

export function useFormValidation() {
  const [errors, setErrors] = useState<FormErrors>({});
  
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };
  
  const validateField = (name: string, value: string): boolean => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!value.trim()) {
          error = 'Name is required';
        }
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!validateEmail(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'message':
        if (!value.trim()) {
          error = 'Message is required';
        } else if (value.trim().length < 10) {
          error = 'Message must be at least 10 characters';
        }
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  };
  
  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;
    
    // Check name
    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }
    
    // Check email
    if (!formData.email?.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
      isValid = false;
    }
    
    // Check message
    if (!formData.message?.trim()) {
      newErrors.message = 'Message is required';
      isValid = false;
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  return { errors, validateField, validateForm };
}
