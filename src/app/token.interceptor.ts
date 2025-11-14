import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const t = localStorage.getItem('token');
    if (t) {
      req = req.clone({ setHeaders: { Authorization: `Bearer ${t}` } });
    }
    return next.handle(req);
  }
}
