import { Injectable } from "@angular/core";
import { Subject, Observable } from 'rxjs';

@Injectable()
export class JwtService {
    private _jwtToken: string = null;
    private _jwtTokenType: string = null;
    private _jwtExpiresAt: string = null;
    private _observableJwtToken = new Subject<any>();

    getToken(): string {
        return this._jwtToken || window.localStorage.jwtToken;
    }

    saveToken(token: string) {
        this._jwtToken = token;
        window.localStorage.jwtToken = token;
        this.setObservableToken(token);
    }

    destroyToken() {
        this._jwtToken = null;
        window.localStorage.removeItem('jwtToken');
        this.setObservableToken(null);
    }

    getTokenType(): string {
        return this._jwtTokenType || window.localStorage.jwtTokenType;
    }

    saveTokenType(tokenType: string) {
        this._jwtTokenType = tokenType;
        window.localStorage.jwtTokenType = tokenType;
    }

    destroyTokenType() {
        this._jwtTokenType = null;
        window.localStorage.removeItem('jwtTokenType');
    }

    getTokenExpiresAt(): string {
        return this._jwtExpiresAt || window.localStorage.jwtTokenExpiresAt;
    }

    saveTokenExpiresAt(tokenExpiresAt: string) {
        this._jwtExpiresAt = tokenExpiresAt;
        window.localStorage.jwtTokenExpiresAt = tokenExpiresAt;
    }

    destroyTokenExpiresAt() {
        this._jwtExpiresAt = null;
        window.localStorage.removeItem('jwtTokenExpiresAt');
    }

    clear() {
        this.destroyToken();
        this.destroyTokenType();
        this.destroyTokenExpiresAt();
    }

    setObservableToken(token){
        this._observableJwtToken.next(token);
    }

    isLoggedIn():Observable<any>{
        return this._observableJwtToken.asObservable();
    }
}