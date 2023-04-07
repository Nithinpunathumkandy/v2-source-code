import { Analysis } from './swot';

export interface InternalIssuesList{
    issue_category_id: number;
    issue_category_title: string;
    issues: Analysis[];
    total_items: number;
}

export interface InternalIssue {
    data: Analysis[];
    current_page: number;
    per_page: number;
    total: number;
}