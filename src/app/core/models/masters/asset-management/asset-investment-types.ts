export interface AssetInvestmentTypes {
    id: number;
    status: string;
    status_id :number;
    status_label: string;
    title: string;
}

export interface AssetInvestmentTypesPaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: AssetInvestmentTypes[];
}
