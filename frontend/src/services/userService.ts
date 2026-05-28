import api from './api';

export interface UpdateProfileData {
  firstName: string;
  lastName: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: UpdateProfileData) => api.put('/user/profile', data),
  changePassword: (data: ChangePasswordData) => api.put('/user/change-password', data),
};
