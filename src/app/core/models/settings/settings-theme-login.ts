export interface ThemeLogin{
    app_login_setting_images:ThemeLoginImages[];
    id: number;
    is_google_login: boolean;
    is_isorobot: boolean;
    is_isorobot_logo: boolean;
    is_linked_login:boolean;
    solution_name: string;
}

export interface ThemeLoginImages{
    app_login_setting_id: 1
    name:string;
    ext: string;
    id: number;
    size: number;
    thumbnail_url: string;
    title: string;
    token: string;
    type:string;
    mime_type:string;
    url:string;
    is_new:boolean;
    is_deleted:boolean;
    length:number;
    preview_url:string;
}