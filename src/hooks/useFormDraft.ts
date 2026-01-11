import { useEffect } from "react";
import {
  useForm,
  type UseFormReturn,
  type DefaultValues,
  type FieldValues,
} from "react-hook-form";

// Hook para no perder lo que escribimos en los inputs si se recarga la página
export const useFormDraft = <T extends FieldValues>(
  formName: string,
  defaultValues: T
): UseFormReturn<T> => {
  const form = useForm<T>({
    defaultValues: defaultValues as DefaultValues<T>,
    mode: "onSubmit",
  });

  // Cada vez que el usuario escribe, guardamos el "borrador" en el localStorage
  useEffect(() => {
    const subscription = form.watch((value) => {
      localStorage.setItem(`form_draft_${formName}`, JSON.stringify(value));
    });
    return () => subscription.unsubscribe();
  }, [form, formName]);

  // Al cargar el componente, miramos si hay algo guardado para rellenar el form
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

// Funciones para limpiar los borradores manualmente
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
