import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

interface UIState {
  toasts: Toast[]
  isGlobalLoading: boolean
}

const uiSlice = createSlice({
  name: 'ui',
  initialState: { toasts: [], isGlobalLoading: false } as UIState,
  reducers: {
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({ ...action.payload, id: Date.now().toString() })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.isGlobalLoading = action.payload
    },
  },
})

export const { addToast, removeToast, setGlobalLoading } = uiSlice.actions
export default uiSlice.reducer
