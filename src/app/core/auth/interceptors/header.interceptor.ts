import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from "@angular/common/http"
import { Observable } from 'rxjs';
import { JwtService } from '../services/jwt.service';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
    constructor(
        private _jwtService: JwtService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log(req);
        var customHeaderFlag = false;
        if(req.headers.get('custom-header')){
            customHeaderFlag = true;
        }
        // if(req.headers.get('Anonymous') != null){
        //     const newHeaders = req.headers.delete('Anonymous');
        //     newHeaders['Accept'] = 'text/html';                                                
        //     const newRequest = req.clone({ headers: newHeaders });
        //     return next.handle(newRequest);
        // }
        // else{
        let headers = {
            'Accept': 'application/json'
        };

        const token: string = this._jwtService.getToken();
        const tokenType: string = this._jwtService.getTokenType();

        if (token && tokenType) headers['Authorization'] = `${tokenType} ${token}`;
        if(customHeaderFlag) headers['custom-header'] = 'true';
        const request = req.clone({ setHeaders: headers });
        return next.handle(request);
        // }
    }
}