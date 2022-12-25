export type TextField = {
  type: "text";
  defaultValue?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
};

export type TextareaField = {
  type: "textarea";
  rows?: number;
  defaultValue?: string;
  placeholder?: string;
  minLength?: number;
  maxLength?: number;
};

export type CheckboxField = {
  type: "checkbox";
  defaultValue?: boolean;
};

export type InputField = (TextField | TextareaField | CheckboxField) & {
  id: string;
  isRequired: boolean;
  label: string;
};
