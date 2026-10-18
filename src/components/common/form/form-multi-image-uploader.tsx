"use client";
import { get, useController, useFormContext } from "react-hook-form";
import { FormField } from "./form-field";
import {
  MultiImageUploader,
  type GalleryImage,
  type MultiImageUploaderProps,
} from "./multi-image-uploader";

type Props = Omit<MultiImageUploaderProps, "value" | "onChange" | "error"> & {
  name: string;
  label: string;
};

/** react-hook-form এর সাথে বাঁধা। বাকি সব prop সরাসরি MultiImageUploader এ যায়। */
export function FormMultiImageUploader({ name, label, ...rest }: Props) {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const error = get(errors, name)?.message as string | undefined;

  return (
    <FormField label={label} htmlFor={name}>
      <MultiImageUploader
        value={(value as GalleryImage[]) ?? []}
        onChange={onChange}
        error={error}
        {...rest}
      />
    </FormField>
  );
}
