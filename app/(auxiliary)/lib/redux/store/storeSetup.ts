import {
    useSelector as useReduxSelector,
    useDispatch as useReduxDispatch,
    type TypedUseSelectorHook,
} from 'react-redux'
import {combineReducers, configureStore} from "@reduxjs/toolkit";
import {userSlice} from "@/app/(auxiliary)/lib/redux/store/slices/userSlice";

import {middleware} from "@/app/(auxiliary)/lib/redux/store/middleware";
import {thunk} from "redux-thunk";
import {trafficSlice} from "@/app/(auxiliary)/lib/redux/store/slices/trafficSlice";
import {filesSlice} from "@/app/(auxiliary)/lib/redux/store/slices/filesSlice";

const rootReducer = combineReducers({
    user: userSlice.reducer,
    traffic: trafficSlice.reducer,
    files: filesSlice.reducer,
})

export const storeSetup = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false})
})

export const useDispatch = () => useReduxDispatch<ReduxDispatch>()
export const useSelector: TypedUseSelectorHook<ReduxState> = useReduxSelector

// export type ReduxStore = typeof storeSetup
export type ReduxState = ReturnType<typeof storeSetup.getState>
export type ReduxDispatch = typeof storeSetup.dispatch