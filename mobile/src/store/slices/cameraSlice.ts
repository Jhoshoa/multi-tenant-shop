import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface CapturedImage {
  uri: string
  productId?: string
}

const cameraSlice = createSlice({
  name: 'camera',
  initialState: { queue: [] as CapturedImage[] },
  reducers: {
    addImage(state, action: PayloadAction<CapturedImage>) {
      state.queue.push(action.payload)
    },
    removeImage(state, action: PayloadAction<string>) {
      state.queue = state.queue.filter((img) => img.uri !== action.payload)
    },
    clearQueue(state) {
      state.queue = []
    },
  },
})

export const { addImage, removeImage, clearQueue } = cameraSlice.actions
export default cameraSlice.reducer
