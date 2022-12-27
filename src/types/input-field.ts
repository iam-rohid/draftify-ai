export type TextField = {
  type: "text";
  default_value?: string;
  placeholder?: string;
  min_length?: number;
  max_length?: number;
};

export type TextareaField = {
  type: "textarea";
  rows?: number;
  default_value?: string;
  placeholder?: string;
  min_length?: number;
  max_length?: number;
};

export type CheckboxField = {
  type: "checkbox";
  default_value?: boolean;
};

export type InputField = (TextField | TextareaField | CheckboxField) & {
  id: string;
  is_required: boolean;
  label: string;
};
