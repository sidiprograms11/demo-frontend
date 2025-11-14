// src/app/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  const isAuthCall = req.url.includes('/api/auth/');

  if (token && !isAuthCall) {
    console.log('[INT] attach token ->', req.method, req.url); // <- debug
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
      withCredentials: false,
    });
  } else {
    console.log('[INT] no token for ->', req.method, req.url); // <- debug
  }

  return next(req);
};
