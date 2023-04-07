import { Analysis } from './swot';

export interface ExternalIssuesList{
    issue_category_id: number;
    issue_category_title: string;
    issues: Analysis[];
    total_items: number;
}

export interface ExternalIssue {
    data: Analysis[];
    current_page: number;
    per_page: number;
    total: number;
}