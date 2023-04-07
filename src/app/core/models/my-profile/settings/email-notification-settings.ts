export interface EmailNotificationSettings{
    is_enabled:boolean;
    module_groups:ModuleGroup[];
}

export interface ModuleGroup{
    module_group:string;
    module_group_id:number;
    is_enabled:boolean;
    notifications:Notification[];
}

export interface Notification{
    id:number;
    app_notification_id:number;
    title:string;
    code:string;
    is_enabled:boolean;
}
