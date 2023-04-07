export interface comments{
    business_continuity_plan_version_content_comment_id: number;
    business_continuity_plan_version_content_id: number;
    comment: string;
    comment_status: commentStatus;
    comment_status_id: number;
    created_at: string;
    created_by: number;
    id: number;
    reply: []
}

export interface commentStatus{
    color_code: string;
    created_at: string;
    created_by: number;
    id: number;
    label: string;
    status_id: number;
    type: string;
}