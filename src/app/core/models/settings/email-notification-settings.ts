export interface NotificationSettings{
    is_enabled: boolean;
    module_groups: SettingsModuleGroup[];
}

export interface SettingsModuleGroup{
    is_enabled: boolean
    module_group: string;
    module_group_id: number;
    notifications: Notifications[];
}

export interface Notifications{
    app_notification_id: number;
    code: string;
    id: number;
    is_enabled: boolean
    title: string;
}