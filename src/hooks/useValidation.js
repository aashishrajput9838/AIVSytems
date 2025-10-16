import { useState, useCallback } from 'react';
import { validateResponse, extractEntities } from '@/features/validation/algorithms';
import { addLog } from '@/services/api/logs';
import { askModel } from '@/services/ai/models';
import { useAuth } from '@/features/auth/AuthProvider';

export const useValidation = () => {
  const { user } = useAuth();
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateAndLog = useCallback(async (userQuery, modelResponse, source = 'manual') => {
    if (!userQuery?.trim() || !modelResponse?.trim()) {
      setError('Both user query and model response are required');
      return null;
    }

    try {
      setIsValidating(true);
      setError('');

      // Validate the response
      const validation = await validateResponse(userQuery, modelResponse);
      const entityInfo = extractEntities(userQuery);

      // Create log entry with validation results
      const logEntry = {
        user_query: userQuery.trim(),
        model_response: modelResponse.trim(),
        validation_score: validation.validationScore,
        external_verification_required: validation.externalVerificationRequired,
        notes: validation.notes,
        validators: validation.validators,
        status: 'validated',
        created_by: user?.email || 'unknown',
        timestamp: new Date().toISOString(),
        source,
        entity_info: entityInfo
      };

      await addLog(logEntry);
      return logEntry;

    } catch (err) {
      setError(err?.message || 'Validation failed');
      return null;
    } finally {
      setIsValidating(false);
    }
  }, [user]);

  const askModelAndValidate = useCallback(async (userQuery) => {
    if (!userQuery?.trim()) {
      setError('User query is required');
      return null;
    }

    try {
      setIsValidating(true);
      setError('');

      // Ask the model for a response
      const modelResponse = await askModel(userQuery.trim());
      
      // Validate and log the response
      const logEntry = await validateAndLog(userQuery, modelResponse, 'api');
      return { modelResponse, logEntry };

    } catch (err) {
      console.error('Ask model error:', err)
      // Provide more specific error messages for different error types
      let errorMessage = err?.message || 'Model request failed'
      if (errorMessage.includes('Invalid API Key')) {
        errorMessage += '. Please check your API key in the .env file.'
      } else if (errorMessage.includes('quota')) {
        errorMessage += '. Check your API provider\'s billing details'
      }
      setError(errorMessage)
      return null
    } finally {
      setIsValidating(false)
    }
  }, [validateAndLog]);

  const checkDuplicate = useCallback((userQuery, modelResponse, logs) => {
    const now = new Date();
    const oneMinuteAgo = new Date(now.getTime() - 60 * 1000);
    
    return logs.some(log => {
      const logTime = log.timestamp?.seconds ? new Date(log.timestamp.seconds * 1000) : new Date(log.timestamp);
      const isRecent = logTime > oneMinuteAgo;
      const isSameContent = log.user_query === userQuery && log.model_response === modelResponse;
      
      return isRecent && isSameContent;
    });
  }, []);

  return {
    validateAndLog,
    askModelAndValidate,
    checkDuplicate,
    isValidating,
    error,
    clearError: () => setError('')
  };
};
