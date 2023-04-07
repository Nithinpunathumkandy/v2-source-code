import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from "@angular/common/http"
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

/**
 * Prefixes all requests not starting with `http[s]` with `environment.apiBasePath`.
 */
@Injectable()
export class ApiBasePathInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (!/^(http|https):/i.test(req.url)) {
            req = req.clone({ url: environment.apiBasePath + req.url });
        }

        return next.handle(req);
    }
}