import { useEffect } from "react";
import {
  useForm,
  type UseFormReturn,
  type DefaultValues,
  type FieldValues,
  type UseFormProps, // Importamos el tipo de las opciones
} from "react-hook-form";

export const useFormDraft = <T extends FieldValues>(
  formName: string,
  defaultValues: T,
  options?: UseFormProps<T> // <-- Tercer argumento opcional
): UseFormReturn<T> => {
  const form = useForm<T>({
    ...options, // <-- Esparcimos las opciones externas (como el mode)
    defaultValues: defaultValues as DefaultValues<T>,
    // Si no pasas un modo en las opciones, usará 'onChange' por defecto
    mode: options?.mode || "onChange",
  });

  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(`form_draft_${formName}`, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, formName]);

  useEffect(() => {
    const savedDraft = localStorage.getItem(`form_draft_${formName}`);
    if (savedDraft) {
      try {
        form.reset(JSON.parse(savedDraft) as T);
      } catch (err) {
        console.error("No se pudo cargar el borrador:", err);
      }
    }
  }, [form, formName]);

  return form;
};

export const clearFormDraft = (formName: string) => {
  localStorage.removeItem(`form_draft_${formName}`);
};

export const clearAllFormDrafts = () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith("form_draft_")) {
      localStorage.removeItem(key);
    }
  });
};
