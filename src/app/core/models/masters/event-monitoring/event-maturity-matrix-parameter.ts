export interface EventMaturityMatrixParameter {
    id: number;
    title: string;
    status: string;
    status_id: number;
    status_label: string;
}

export interface EventMaturityMatrixParameterPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: EventMaturityMatrixParameter[];
}

export interface EventMaturityMatrixParameterSingle {
    id: number;
    event_maturity_matrix_range:null;
    event_maturity_matrix_type:null;
    languages: EventMaturityMatrixParameterLanguage[];
}

export interface EventMaturityMatrixType{
    id:number;
    client_side_url:string;
}

export interface EventMaturityMatrixRange{
    id:number;
    client_side_url:string;
}

export interface EventMaturityMatrixParameterLanguage{
    id:number;
    event_maturity_matrix_Parameter:EventMaturityMatrixParameterSingleLanguage[]
}

export interface EventMaturityMatrixParameterSingleLanguage{
    description: string;
    language_id: number;
    title: string;
}