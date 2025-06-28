import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import "./FormWizard.css";

interface Field {
  name: string;
  type: string;
  label: string;
  required?: boolean;
}

interface Step {
  title: string;
  fields: Field[];
}

interface FormWizardProps {
  schema: Step[];
  onSubmit: (data: any) => void;
}

const fieldSchemaMap = (fields: Field[]) => {
  const shape: Record<string, z.ZodTypeAny> = {};
  fields.forEach((field) => {
    let validator = z.string();
    if (field.type === "email") validator = z.string().email();
    if (field.required) validator = validator.min(1, `${field.label} is required`);
    shape[field.name] = validator;
  });
  return z.object(shape);
};

export const FormWizard: React.FC<FormWizardProps> = ({ schema, onSubmit }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const step = schema[stepIndex];

  const methods = useForm({
    mode: "onBlur",
    resolver: zodResolver(fieldSchemaMap(step.fields))
  });

  const { register, handleSubmit, formState: { errors } } = methods;

  const nextStep = () => {
    if (stepIndex < schema.length - 1) {
      setStepIndex(stepIndex + 1);
    }
  };

  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  const onStepSubmit = (data: any) => {
    if (stepIndex === schema.length - 1) {
      onSubmit(data);
    } else {
      nextStep();
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onStepSubmit)} className="form-wizard">
        <h2 className="form-title">{step.title}</h2>
        {step.fields.map((field) => (
          <div key={field.name} className="form-field">
            <label className="form-label">{field.label}</label>
            <input
              {...register(field.name)}
              type={field.type}
              className="form-input"
            />
            {errors[field.name] && (
              <p className="form-error">{errors[field.name]?.message as string}</p>
            )}
          </div>
        ))}
        <div className="form-actions">
          {stepIndex > 0 && (
            <button type="button" onClick={prevStep} className="btn-secondary">
              Назад
            </button>
          )}
          <button type="submit" className="btn-primary">
            {stepIndex === schema.length - 1 ? "Отправить" : "Далее"}
          </button>
        </div>
      </form>
    </FormProvider>
  );
};
