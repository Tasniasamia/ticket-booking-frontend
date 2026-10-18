"use client";

import { get, useController, useFormContext } from "react-hook-form";
import { FormField } from "./form-field";
import {
  ImageUploader,
  type ImageUploaderProps,
  type ImageUploaderValue,
} from "./image-uploader"; // ← এখানে change
import type { MediaModelName } from "@/features/media/types";

type FormImageUploaderProps = Omit<
  ImageUploaderProps,
  "value" | "onChange" | "onBlur" | "error" | "id"
> & {
  name: string;
  label: string;
  modelName?: MediaModelName;
};

export function FormImageUploader({
  name,
  label,
  modelName,
  ...rest
}: FormImageUploaderProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const {
    field: { value, onChange, onBlur },
  } = useController({ name, control });

  const error = get(errors, name)?.message as string | undefined;

  return (
    <FormField label={label} htmlFor={name} error={error}>
      <ImageUploader
      
        id={name}
        name={name}
        value={(value as ImageUploaderValue) ?? null}
        onChange={onChange}
        onBlur={onBlur}
        modelName={modelName}
        {...rest}
      />
    </FormField>
  );
}

export { FormImageUploader as ImageUploader };