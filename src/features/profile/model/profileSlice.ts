// src/features/profile/model/profileSlice.ts
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
    isUploadingAvatar: boolean;
    uploadAvatarError: string | null;
    isDeletingAvatar: boolean;
    deleteAvatarError: string | null;
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
    isUploadingAvatar: false,
    uploadAvatarError: null,
    isDeletingAvatar: false,
    deleteAvatarError: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        // Fetching profile
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
        // Updating profile
        updateProfilePending: (state) => {
            state.isUpdatingProfile = true;
            state.updateProfileError = null;
        },
        updateProfileSuccess: (state, action: PayloadAction<UserProfile>) => {
            state.isUpdatingProfile = false;
            state.profile = action.payload;
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
        // Reset statuses
        clearUpdateProfileStatus: (state) => {
            state.updateProfileError = null;
        },
        clearChangePasswordStatus: (state) => {
            state.changePasswordError = null;
            state.changePasswordSuccess = false;
        },
        // Avatar Reducers
        uploadAvatarPending: (state) => {
            state.isUploadingAvatar = true;
            state.uploadAvatarError = null;
        },
        uploadAvatarSuccess: (state, action: PayloadAction<string>) => {
            state.isUploadingAvatar = false;
            if (state.profile) {
                state.profile.avatarUrl = action.payload;
            }
        },
        uploadAvatarFailure: (state, action: PayloadAction<string>) => {
            state.isUploadingAvatar = false;
            state.uploadAvatarError = action.payload;
        },
        deleteAvatarPending: (state) => {
            state.isDeletingAvatar = true;
            state.deleteAvatarError = null;
        },
        deleteAvatarSuccess: (state) => {
            state.isDeletingAvatar = false;
            if (state.profile) {
                state.profile.avatarUrl = undefined;
            }
        },
        deleteAvatarFailure: (state, action: PayloadAction<string>) => {
            state.isDeletingAvatar = false;
            state.deleteAvatarError = action.payload;
        },
        clearAvatarStatus: (state) => {
            state.uploadAvatarError = null;
            state.deleteAvatarError = null;
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
    uploadAvatarPending,
    uploadAvatarSuccess,
    uploadAvatarFailure,
    deleteAvatarPending,
    deleteAvatarSuccess,
    deleteAvatarFailure,
    clearAvatarStatus,
} = profileSlice.actions;

export const profileReducer = profileSlice.reducer;