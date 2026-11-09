"use client";

import { get, useController, useFormContext } from "react-hook-form";
import { FormField } from "./form-field";
import {
  ImageUploader,
  type ImageUploaderProps,
  type ImageUploaderValue,
  type DeferredImageValue,
} from "./image-uploader";
import type { MediaModelName } from "@/features/media/types";

type FormImageUploaderProps = Omit<
  ImageUploaderProps,
  "value" | "onChange" | "onBlur" | "error" | "id"
> & {
  name: string;
  label: string;
  modelName?: MediaModelName;
};

/**
 * react-hook-form এর সাথে বাঁধা।
 * - deferred=false (default): আগের মতো select করলেই upload হয়
 * - deferred=true: field এর value তে ImageItem ({ id, url, file? }) থাকে,
 *   upload হয় form submit এর সময়
 */
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
        value={(value as ImageUploaderValue | DeferredImageValue) ?? null}
        onChange={onChange}
        onBlur={onBlur}
        modelName={modelName}
        {...rest}
      />
    </FormField>
  );
}

export { FormImageUploader as ImageUploader };
