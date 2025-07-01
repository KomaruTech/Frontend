import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { UserProfile } from '@entities/user/model/types.ts';

interface ProfileState {
    profile: UserProfile | null;
    isLoading: boolean;
    error: string | null;
    isUpdatingProfile: boolean;
    updateProfileError: string | null;
    isChangingPassword: boolean;
    changePasswordError: string | null;
    changePasswordSuccess: boolean;
}

const initialState: ProfileState = {
    profile: null,
    isLoading: false,
    error: null,
    isUpdatingProfile: false,
    updateProfileError: null,
    isChangingPassword: false,
    changePasswordError: null,
    changePasswordSuccess: false,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // Fetching profile (for initial display)
        fetchProfilePending: (state) => {
            state.isLoading = true;
            state.error = null;
        },
        fetchProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
            state.isLoading = false;
            state.profile = action.payload;
        },
        fetchProfileFailure: (state, action: PayloadAction<string>) => {
            state.isLoading = false;
            state.error = action.payload;
            state.profile = null;
        },
        // Updating basic profile data
        updateProfilePending: (state) => {
            state.isUpdatingProfile = true;
            state.updateProfileError = null;
        },
        updateProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
            state.isUpdatingProfile = false;
            state.profile = action.payload; // Update profile in state
        },
        updateProfileFailure: (state, action: PayloadAction<string>) => {
            state.isUpdatingProfile = false;
            state.updateProfileError = action.payload;
        },
        // Changing password
        changePasswordPending: (state) => {
            state.isChangingPassword = true;
            state.changePasswordError = null;
            state.changePasswordSuccess = false;
        },
        changePasswordSuccesss: (state) => {
            state.isChangingPassword = false;
            state.changePasswordSuccess = true;
        },
        changePasswordFailure: (state, action: PayloadAction<string>) => {
            state.isChangingPassword = false;
            state.changePasswordError = action.payload;
            state.changePasswordSuccess = false;
        },
        // Reset success/error messages (for UI)
        clearUpdateProfileStatus: (state) => {
            state.updateProfileError = null;
        },
        clearChangePasswordStatus: (state) => {
            state.changePasswordError = null;
            state.changePasswordSuccess = false;
        },
    },
});

export const {
    fetchProfilePending,
    fetchProfileSuccess,
    fetchProfileFailure,
    updateProfilePending,
    updateProfileSuccess,
    updateProfileFailure,
    changePasswordPending,
    changePasswordSuccesss,
    changePasswordFailure,
    clearUpdateProfileStatus,
    clearChangePasswordStatus,
} = profileSlice.actions;

export const profileReducer = profileSlice.reducer;