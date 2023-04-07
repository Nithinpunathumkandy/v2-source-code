export interface ThemeStructure{
    style:string;
    app_theme_setting_images:ThemeStructureImages[];
    charts_theme: string;
    bar_chart_color: string;
}

export interface ThemeStructureImages{
    app_theme_setting_id: 1
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