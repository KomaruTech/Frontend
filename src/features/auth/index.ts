// src/features/auth/index.ts
import LoginForm from './ui/LoginForm';
import * as authApi from './api/authApi';
import * as authModel from './model'; // Экспортируем все из модели

export { LoginForm, authApi, authModel };