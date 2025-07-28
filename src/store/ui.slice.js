import { createSlice } from '@reduxjs/toolkit'

const uiSlice = createSlice({
  name: 'ui',
  initialState: { openAddCard: false },
  reducers: {
    triggerOpenAddCard: state => { state.openAddCard = true },
    clearOpenAddCard: state => { state.openAddCard = false }
  }
})

export const { triggerOpenAddCard, clearOpenAddCard } = uiSlice.actions
export default uiSlice.reducer
