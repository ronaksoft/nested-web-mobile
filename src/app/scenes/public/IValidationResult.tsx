import ValidationStatus from './ValidationStatus';

interface IValidationResult {
  message: string;
  status: ValidationStatus;
};

export default IValidationResult;