import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('access');
  const refresh = localStorage.getItem('refresh');
  const router = inject(Router);
  const http = inject(HttpClient);

  // Подставляем access токен
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 401 && refresh) {
        // Пробуем обновить access токен
        return http.post<any>('/auth/jwt/refresh/', { refresh }).pipe(
          switchMap((res) => {
            if (res?.access) {
              // новые токены
              localStorage.setItem('access', res.access);
              if (res.refresh) {
                localStorage.setItem('refresh', res.refresh);
              }

              // оригинальный запрос с новым access
              const newReq = req.clone({
                setHeaders: { Authorization: `Bearer ${res.access}` }
              });
              return next(newReq);
            } else {
              localStorage.clear();
              router.navigate(['/login']);
              return throwError(() => err);
            }
          }),
          catchError(() => {
            // refresh тоже невалиден → выкидываем на логин
            localStorage.clear();
            router.navigate(['/login']);
            return throwError(() => err);
          })
        );
      }

      return throwError(() => err);
    })
  );
};
