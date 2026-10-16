/** Label + error message wrapper। error থাকলে role="alert" দিয়ে screen reader কে জানায়। */
export function FormField({
  label, htmlFor, error, children,
}: { label: string; htmlFor: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-semibold">{label}</label>
      {children}
      {error && <p id={`${htmlFor}-error`} role="alert" className="mt-1.5 text-sm text-red-500">{error}</p>}
    </div>
  );
}
