export interface LoginSettings{
    id: number;
    is_password_validity_enabled: number;
    is_user_account_block_enabled: number;
    password_history_count: number;
    password_validity_days: number;
    password_validity_reminder_days: number;
    user_account_block_duration: number;
    is_active_directory_enabled: number;
}