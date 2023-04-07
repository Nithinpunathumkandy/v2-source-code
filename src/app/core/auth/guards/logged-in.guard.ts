import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, RouterStateSnapshot, CanActivateChild, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { AuthService } from '../services/auth.service';
import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthStore } from 'src/app/stores/auth.store';

@Injectable({
    providedIn: 'root'
})
export class LoggedInGuard implements CanActivateChild {

    constructor(
        private _jwtService: JwtService,
        private _authService: AuthService,
        private _router: Router,
    ) { }

    canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        if (this._jwtService.getToken() && this._jwtService.getTokenType() && this._jwtService.getTokenExpiresAt()) {
            this._jwtService.setObservableToken(this._jwtService.getToken());
            if (AuthStore.isAuthenticated) return of(true);
            else {
                return this._authService.populate().pipe(
                    map((res: User) => true),
                    catchError(err => {
                        this._authService.purgeAuth();
                        AuthStore.setRedirectUrl(state.url);
                        this._router.navigateByUrl('/login');
                        return of(err);
                    })
                );
            }
        } else {
            this._authService.purgeAuth();
            AuthStore.setRedirectUrl(state.url);
            this._router.navigateByUrl('/login');
            return of(false);
        }
    }
}