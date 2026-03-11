import api from './api';

// ─── Auth ──────────────────────────────────────────────────
export const sendOtp = (phoneNumber) =>
  api.post('/auth/otp/send', { phoneNumber });

export const verifyOtp = (phoneNumber, otpCode) =>
  api.post('/auth/otp/verify', { phoneNumber, otpCode });

export const adminLogin = (email, password) =>
  api.post('/auth/admin/login', { email, password });

export const refreshToken = (refreshToken) =>
  api.post('/auth/token/refresh', { refreshToken });

export const logout = () => api.post('/auth/logout');

// ─── Menu ──────────────────────────────────────────────────
export const getMenuItems = (category) =>
  api.get('/menu/items', { params: category ? { category } : {} });

export const getMenuItem = (id) => api.get(`/menu/items/${id}`);

export const getCategories = () => api.get('/menu/categories');

export const searchMenu = (q) => api.get('/menu/search', { params: { q } });

// ─── Orders (Customer) ────────────────────────────────────
export const placeOrder = (data) => api.post('/orders', data);

export const getMyOrders = (page = 0, size = 10) =>
  api.get('/orders/my', { params: { page, size } });

export const getMyOrder = (orderId) => api.get(`/orders/my/${orderId}`);

// ─── Customer Profile ──────────────────────────────────────
export const getProfile = () => api.get('/customer/profile');

export const updateProfile = (data) => api.put('/customer/profile', data);

// ─── Admin: Orders ─────────────────────────────────────────
export const adminGetOrders = (params) =>
  api.get('/admin/orders', { params });

export const adminGetOrder = (orderId) =>
  api.get(`/admin/orders/${orderId}`);

export const adminUpdateStatus = (orderId, data) =>
  api.patch(`/admin/orders/${orderId}/status`, data);

export const adminCancelOrder = (orderId, reason) =>
  api.patch(`/admin/orders/${orderId}/cancel`, { reason });

export const adminQuickEntry = (data) =>
  api.post('/admin/orders/quick-entry', data);

export const adminResendNotification = (orderId) =>
  api.post(`/admin/orders/${orderId}/notify/resend`);

export const adminGetSummary = () => api.get('/admin/orders/summary');

// ─── Admin: Menu ───────────────────────────────────────────
export const adminCreateMenuItem = (data) =>
  api.post('/admin/menu/items', data);

export const adminUpdateMenuItem = (id, data) =>
  api.put(`/admin/menu/items/${id}`, data);

export const adminToggleAvailability = (id) =>
  api.put(`/admin/menu/items/${id}/availability`);

export const adminDeleteMenuItem = (id) =>
  api.delete(`/admin/menu/items/${id}`);
