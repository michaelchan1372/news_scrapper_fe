import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type UserState = {
  email: string
  username: string
}

const initialState: UserState = {
  email: '',
  username: '',
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      state.email = action.payload.email
      state.username = action.payload.username
    },
    clearUser: (state) => {
      state.email = ''
      state.username = ''
    },
  },
})

export const { setUser, clearUser } = userSlice.actions
export default userSlice.reducer
