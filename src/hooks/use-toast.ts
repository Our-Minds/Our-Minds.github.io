
import * as React from "react"
import { toast as sonnerToast, type ToastT } from "sonner"

const TOAST_LIMIT = 5
const TOAST_REMOVE_DELAY = 1000000

type ToasterToast = ToastT & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  variant?: "default" | "destructive" | "success"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast>
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"]
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action

      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((t) => {
          addToRemoveQueue(t.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) => {
          if (t.id === toastId || toastId === undefined) {
            return {
              ...t,
            }
          }
          return t
        }),
      }
    }

    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

export function useToast() {
  const [state, setState] = React.useState<State>(memoryState)
  
  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({
      type: actionTypes.DISMISS_TOAST,
      toastId,
    }),
  }
}

type ToastProps = Omit<ToasterToast, "id"> & {
  id?: string
}

// Map our toast variants to sonner's built-in types
const variantToType = (variant?: "default" | "destructive" | "success") => {
  switch (variant) {
    case "destructive": return "error";
    case "success": return "success";
    default: return "default";
  }
}

export function toast(props: ToastProps) {
  const id = props.id || genId()
  const variant = props.variant || "default";
  
  // Use sonner's toast with our mapped type
  const type = variantToType(variant);
  
  // Call sonner toast with compatible props
  sonnerToast(props.title as string, {
    id,
    description: props.description,
  })

  // Also dispatch to our local state for compatibility
  dispatch({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      variant,
    },
  })

  return id
}

// Export Toaster from sonner
export { Toaster } from "sonner"
