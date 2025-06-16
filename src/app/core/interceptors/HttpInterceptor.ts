import { HttpEvent, HttpRequest } from '@angular/common/module.d-CnjH8Dlt';
import { Observable } from 'rxjs';
import { HttpHandler } from '@angular/common/http';

//TODO: DELETE?
interface HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>>
}
