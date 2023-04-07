export interface Image{
    is_new: any;
    name: string;
    ext: string;
    mime_type: string;
    size: number;
    url: string;
    preview_url: string;
    token: string;
    title: string;
    thumbnail_url?:string;
    is_deleted:boolean;
    id?: number;
    preview: any;
}