import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {IUser} from "@/app/(auxiliary)/types/UserTypes/IUser";
import {AuthTokens} from "@/app/(auxiliary)/types/AppTypes/AuthTokens";

interface InitialStateType {
    user: IUser;
    isAuth: boolean;
}

const initialState: InitialStateType = {
    user: {} as IUser,
    isAuth: false,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<IUser>) => {
            state.user = action.payload
        },
        setAuth: (state, action: PayloadAction<boolean>) => {
            state.isAuth = action.payload
        },
    }
})

export const {
    setUser,
    setAuth,
} = userSlice.actions