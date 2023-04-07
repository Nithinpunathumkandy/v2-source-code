export interface SpaceType {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface SpaceTypePaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: SpaceType[];
}
export interface SpaceTypeSingle {
    id: number;
    languages: SpaceTypeLanguage[];
    
}
export interface SpaceTypeLanguage{
    id:number;
    space_type:SpaceTypeSingleLanguage[]
}
export interface SpaceTypeSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}