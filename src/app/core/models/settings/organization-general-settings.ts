import { Timezone } from '../masters/general/timezone';

export interface OrganizationGeneralSettings {
    currency: string;
    date_format: string;
    date_time_format: string;
    id: number;
    logo_allowed_types: string [];
    max_logo_upload_size: number;
    max_support_file_upload_size: number;
    organization_id: number;
    support_file_allowed_types: string [];
    timezone_id: number;
    autolock_seconds: number;
    is_autolock: number;
    timezone: Timezone;
    is_chatbot: boolean;
    is_user_reward : boolean;
    is_faq: boolean;
    is_feedback: boolean;
    is_ms_type:boolean;
    is_user_license_activation: number;
    clock_format:string;
}