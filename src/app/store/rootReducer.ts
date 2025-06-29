// src/app/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import { authReducer } from "@features/auth/model";
import { profileReducer } from '@features/profile/model/profileSlice';

export const rootReducer = combineReducers({
    auth: authReducer,
    profile: profileReducer,
});