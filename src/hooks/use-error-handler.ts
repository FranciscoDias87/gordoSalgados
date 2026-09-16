'use client';

import { useState, useCallback } from 'react';

export interface AppError {
  id: string;
  message: string;
  type: 'error' | 'warning' | 'info';
  timestamp: Date;
}

export function useErrorHandler() {
  const [errors, setErrors] = useState<AppError[]>([]);

  const addError = useCallback((message: string, type: AppError['type'] = 'error') => {
    const error: AppError = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: new Date(),
    };

    setErrors(prev => [...prev, error]);

    // Auto-remove after 5 seconds for non-error types
    if (type !== 'error') {
      setTimeout(() => {
        removeError(error.id);
      }, 5000);
    }

    return error.id;
  }, []);

  const removeError = useCallback((id: string) => {
    setErrors(prev => prev.filter(error => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
  }, []);

  const handleAsyncError = useCallback(async <T,>(
    asyncFn: () => Promise<T>,
    errorMessage = 'Ocorreu um erro inesperado'
  ): Promise<T | null> => {
    try {
      return await asyncFn();
    } catch (error) {
      const message = error instanceof Error ? error.message : errorMessage;
      addError(message);
      return null;
    }
  }, [addError]);

  return {
    errors,
    addError,
    removeError,
    clearErrors,
    handleAsyncError,
  };
}