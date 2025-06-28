// src/app/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from "../../features/auth/model";

export const rootReducer = combineReducers({
    auth: authReducer,
});