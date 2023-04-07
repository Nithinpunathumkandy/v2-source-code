import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http"
import { Observable } from 'rxjs';
import { retryWhen, scan, map } from 'rxjs/operators';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
    private _dontRetryStatusCodes: number[] = [422, 401];

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        let retryCount: number = 0;

        return next.handle(req).pipe(
            retryWhen((error: Observable<HttpErrorResponse>) => error.pipe(
                map((err: HttpErrorResponse) => {
                    const index = this._dontRetryStatusCodes.findIndex(e => e == err.status);
                    if ((index == -1) && retryCount > 0) return retryCount--;
                    else throw err;
                })
            ))
        );
    }
}