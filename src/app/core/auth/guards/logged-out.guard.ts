import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { JwtService } from '../services/jwt.service';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class LoggedOutGuard implements CanActivate {

    constructor(
        private _jwtService: JwtService,
        private _authService: AuthService,
        private _router: Router,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (!this._jwtService.getToken() || !this._jwtService.getTokenType() || !this._jwtService.getTokenExpiresAt()) {
            this._jwtService.setObservableToken(null);
            this._authService.purgeAuth();
            return of(true);
        }

        this._router.navigateByUrl('/dashboard');
        return of(false);
    }
}