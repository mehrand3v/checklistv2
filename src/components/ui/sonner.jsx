import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      toastOptions={{
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
          border: '1px solid var(--border)',
        },
        success: {
          style: {
            background: 'rgb(34 197 94 / 0.1)',
            color: 'rgb(34 197 94)',
            border: '1px solid rgb(34 197 94 / 0.2)',
          },
        },
        error: {
          style: {
            background: 'rgb(239 68 68 / 0.1)',
            color: 'rgb(239 68 68)',
            border: '1px solid rgb(239 68 68 / 0.2)',
          },
        },
        warning: {
          style: {
            background: 'rgb(234 179 8 / 0.1)',
            color: 'rgb(234 179 8)',
            border: '1px solid rgb(234 179 8 / 0.2)',
          },
        },
        info: {
          style: {
            background: 'rgb(59 130 246 / 0.1)',
            color: 'rgb(59 130 246)',
            border: '1px solid rgb(59 130 246 / 0.2)',
          },
        },
      }}
      {...props} />
  );
}

export { Toaster }
