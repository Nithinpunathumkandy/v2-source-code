import { NgModule } from '@angular/core';
import { LoginPage } from './page/login.page';
import { LoginRoutingModule } from './login.routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { TwoFactorAuthenticationComponent } from "./two-factor-authentication/two-factor-authentication.component";
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { LoginPageLoaderComponent } from './loader/login-page-loader/login-page-loader.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
    declarations: [
        LoginPage,
        ForgotPasswordComponent,
        TwoFactorAuthenticationComponent,
        ResetPasswordComponent,
        LoginPageLoaderComponent,
        ChangePasswordComponent
    ],
    imports: [
        SharedModule,
        LoginRoutingModule,
        NgOtpInputModule,
    ],
    providers: [],
})
export class LoginModule { }
