import { HttpInterceptorFn } from '@angular/common/http';
import { baseString } from '../urls/basestring.url';

export const AdminInterceptor: HttpInterceptorFn = (request, next) => {
  let adminUrls: string[] = [`${baseString}/register/admin`, `${baseString}/validate`]
    if (adminUrls.some(url => request.url == url))
    {
      const clonedRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
      return next(clonedRequest)
    }
    return next(request)
};
