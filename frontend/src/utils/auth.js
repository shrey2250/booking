const AUTH_CHANGE_EVENT = 'auth-change';

const readAuthState = () => ({
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
});

let authSnapshot = readAuthState();

export const getAuthSnapshot = () => {
  const nextSnapshot = readAuthState();

  if (
    nextSnapshot.token !== authSnapshot.token ||
    nextSnapshot.role !== authSnapshot.role
  ) {
    authSnapshot = nextSnapshot;
  }

  return authSnapshot;
};

const emitAuthChange = () => {
  authSnapshot = readAuthState();
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const subscribeToAuth = (callback) => {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);

  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
};

export const setAuthSession = (token, role) => {
  localStorage.setItem('token', token);
  localStorage.setItem('role', role);
  emitAuthChange();
};

export const clearAuthSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
  emitAuthChange();
};
