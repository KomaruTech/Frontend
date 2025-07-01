export interface UserProfile {
    id: string;
    login: string;
    name: string;
    surname: string;
    email: string;
    telegramUsername:  string | null;
    avatarUrl: string | null | undefined ;
}

export interface UpdateProfilePayload {
    name: string;
    surname: string;
    email: string;
    telegramUsername: string | null | undefined;
}

export interface ChangePasswordPayload {
    oldPassword: string;
    newPassword: string;
}
