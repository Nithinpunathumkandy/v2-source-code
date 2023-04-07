export interface ProjectsResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Projects[];
}

export interface Projects {
    id : number;
}

export interface ObjectiveResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ThemeObjective[];
}

export interface ThemeObjective {
   id : number,
   project_kpis
}

export interface ProjectDetails {
    title : string;
    project_contract_type;
    location;
    project_priority;
    project_status;
    project_type;
    start_date;
    target_date;
    description : string
    reference_code;
    milestone_progress;
    project_monitoring_status;
    sub_sections;
    sections;
    departments;
    divisions;
    organizations;
    workflow_items;
    next_review_user_level;
    submitted_by;
    project_manager;
    project_issues;
    project_documents;
    project_budgets;
    project_risks;
    project_scopes;
    project_payments;
    project_stakeholders;
    project_strategic_alignments;
    project_milestones;

}

export interface MilestonHistoryResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Milestone[];
}

export interface MilestoneHistory {
    milestone_progress :string,
    project_milestone_title : string,
    completion :string
}

export interface MilestonResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Milestone[];
}

export interface Milestone {
   id:number;
   due:string
   completion:string;
   milestone;
}

export interface InduvalMilestone {
   
}

export interface ScopeOfWorkResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ScopeOfWork[];
}

export interface ScopeOfWork {
   type;
   title;
   id;
}

export interface ExpectedOutcomeResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: ExpectedOutcome[];
}

export interface ExpectedOutcome {
    
}

export interface DeliverableResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Deliverable[];
}

export interface Deliverable {
    title :string;
    id : number;
}
export interface StrategicAlignmentResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategicAlignment[];
}
export interface StakeholderPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Stakeholder[];
}

export interface Stakeholder {
    id:number;
    title:string;
    data: StrategicAlignment[];
}

export interface StrategicAlignment {
    
}

