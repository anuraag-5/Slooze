export interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export type Restaurant = {
  id: string;
  name: string,
  country: "INDIA" | "AMERICA"
}