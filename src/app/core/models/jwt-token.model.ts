export interface JwtToken {
    access_token: string,
    token_type: string,
    expires_at: string,
    is_two_factor_auth_enabled: boolean,
    user_id?: number,
    is_password_validity_expired?:boolean
}

export interface TwoWayAuthentication {
    is_two_factor_auth_enabled: boolean,
    message: string,
    user_id: number,
    otp_token: string,
}

export interface SsoAuth{
    is_two_factor_auth_enabled: boolean,
    message: string,
    otp_token: string,
    error: boolean,
    access_token: string,
    token_type: string,
    expires_at: string,
}