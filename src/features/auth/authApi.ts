import api from '../../services/api';

interface LoginPayload {
  username: string;
  password: string;
}

interface LoginResponse {
  user: string;
  token: string;
}

export const login = async (payload: LoginPayload): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/auth/login', payload);
  return response.data;
};
