import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { JwtService } from './jwt.service';
import { User } from '../../models/user.model';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { AuthStore } from '../../../stores/auth.store'
import { JwtToken, TwoWayAuthentication, SsoAuth } from '../../models/jwt-token.model';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable()
export class AuthService {

    constructor(
        private _jwtService: JwtService,
        private _http: HttpClient,
        private _utilityService: UtilityService
    ) { }

    // Verify JWT in localstorage with server & load user's info.
    // This runs once on application startup.
    populate(): Observable<User | HttpErrorResponse | false> {
        if (this._jwtService.getToken()) {
            return this._http.get('/users/me').pipe(
                map((res: User) => {
                    AuthStore.setUser(res);
                    return res;
                }),
                catchError((err: HttpErrorResponse) => {
                    this.purgeAuth();
                    throw err;
                })
            );
        } else {
            // Remove any potential remnants of previous auth states
            this.purgeAuth();
            of(false);
        }
    }

    setToken(jwtToken: JwtToken) {
        // Save JWT sent from server in localstorage
        this._jwtService.saveToken(jwtToken.access_token);
        this._jwtService.saveTokenType(jwtToken.token_type);
        this._jwtService.saveTokenExpiresAt(jwtToken.expires_at);
    }

    purgeAuth() {
        // Remove JWT from localstorage
        this._jwtService.clear();

        // Set current user to null
        AuthStore.setUser(null);

        // Clear User Permission
        AuthStore.userPermissions = [];
    }

    attemptAuth(email: string, password: string, type?: string): Observable<JwtToken> {
        var authData = { email: email, password: password };
        if(type){
            authData['type'] = 'system_lock';
        }
        return this._http.post('/login', authData)
            .pipe(map(
                (res: JwtToken) => {
                    if(!res.is_two_factor_auth_enabled && !res.hasOwnProperty('is_password_validity_expired'))
                        this.setToken(res);
                    // else 
                    //     AuthStore.setTwoFactorAuthenticationDetails(res);
                    return res;
                }
            ));
    }

    // Update the user on the server (email, pass, etc)
    update(user): Observable<User> {
        // TODO: Update User
        return this._http
            .put('/user', { user })
            .pipe(map((data: any) => {
                // Update the currentUser observable
                AuthStore.setUser(data.user);
                return data.user;
            }));
    }

    verifyGoogleLogin(authString: string): Observable<SsoAuth>{
        return this._http.get('https://v2-dev-api.isorobot.io/integrations/google-sso/authenticate?'+authString)
        .pipe(map((data: SsoAuth) => {
           return data;
        }));
    }

    verifyLinkedInLogin(authString: string): Observable<SsoAuth>{
        return this._http.get('https://v2-dev-api.isorobot.io/integrations/linkedin-sso/authenticate?'+authString)
        .pipe(map((data: SsoAuth) => {
           return data;
        }));
    }

    verifyOtp(otpData):Observable<JwtToken>{
        return this._http.post('/two-factor/verification', otpData)
            .pipe(map(
                (res: JwtToken) => {
                    this.setToken(res);
                    return res;
                }
            ));
    }

    resendOtp(otpData){
        return this._http.post('/two-factor/resend-otp', otpData)
            .pipe(map(
                (res: any) => {
                    return res;
                }
            ));
    }


    forgotPassword(email){
        return this._http.post('/password/forget',email)
        .pipe(map((data: any) => {
            // this._utilityService.showSuccessMessage('',data.message);
           return data;
        }));
    }

    resetPassword(data){
        return this._http.post('/password/reset',data)
        .pipe(map((data: any) => {
            this._utilityService.showSuccessMessage('Success!', data.message);
           return data;
        }));
    }
     
}