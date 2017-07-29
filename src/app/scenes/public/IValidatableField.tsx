import ValidationStatus from './ValidationStatus';

interface IValidatableField {
  message: string;
  status: ValidationStatus;
  value: any;
};

export default IValidatableField;