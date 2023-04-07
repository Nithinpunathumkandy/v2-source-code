export interface MeetingType {
    id: number;
    meeting_type_language_title: string;
    type:string;
    status: string;
    status_id :number;
    status_label: string;

}

export interface MeetingTypePaginationResponse {
    current_page: number;
    from:number;
    total: number;
    per_page: number;
    last_page: number;
    data: MeetingType[];
}
