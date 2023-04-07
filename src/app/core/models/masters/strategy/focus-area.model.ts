export interface FocusArea {
    id : number;
    status_id : number;
    title : string;
    description;
    image_ext;
    image_size;
    image_title;
    image_token;
    image_url;

}

export interface FocusAreaPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: FocusArea[];
}