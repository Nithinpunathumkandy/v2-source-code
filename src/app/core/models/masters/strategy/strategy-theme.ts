export interface StrategyThemes {
    id : number;
    status_id : number;
    title : string;
    description:string;
    image_ext:string;
    image_size:string;
    image_title:string;
    image_token:string;
    image_url:string;

}

export interface StrategyThemesPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategyThemes[];
}