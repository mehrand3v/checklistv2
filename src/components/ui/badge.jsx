import * as React from "react"
import { cn } from "@/lib/utils"

const styles = {
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '9999px',
    padding: '2px 12px',
    fontSize: '12px',
    fontWeight: '600',
    lineHeight: '1.5',
    whiteSpace: 'nowrap',
    border: '1px solid transparent',
    transition: 'all 150ms ease',
    minWidth: '40px',
    maxWidth: '100%',
    overflow: 'hidden',
    cursor: 'pointer'
  },
  default: {
    backgroundColor: 'rgb(14 165 233)', // sky-500
    color: 'white'
  },
  secondary: {
    backgroundColor: 'rgb(100 116 139)', // slate-500
    color: 'white'
  },
  destructive: {
    backgroundColor: 'rgb(239 68 68)', // red-500
    color: 'white'
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: 'rgb(226 232 240)', // slate-200
    color: 'rgb(51 65 85)' // slate-700
  },
  success: {
    backgroundColor: 'rgb(16 185 129)', // emerald-500
    color: 'white'
  }
};

function Badge({ variant = "default", children, style, ...props }) {
  return (
    <span
      style={{
        ...styles.badge,
        ...styles[variant],
        ...style
      }}
      {...props}
    >
      {children}
    </span>
  );
}

export { Badge };
