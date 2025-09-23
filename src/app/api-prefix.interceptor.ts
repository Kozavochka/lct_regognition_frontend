import { HttpInterceptorFn } from '@angular/common/http';

export const apiPrefixInterceptor: HttpInterceptorFn = (req, next) => {
  // Если URL относительный (не начинается с http), добавляем /api
  if (!/^https?:\/\//i.test(req.url)) {
    const apiReq = req.clone({ url: `/api${req.url.startsWith('/') ? '' : '/'}${req.url}` });
    return next(apiReq);
  }
  return next(req);
};
