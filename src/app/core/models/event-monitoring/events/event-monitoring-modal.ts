export interface EventsResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Events[];
}

export interface Events {
 
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
   event_kpis
}

export interface EventDetails {
    title : string;
    event_contract_type;
    location;
    event_priority;
    event_status;
    event_type;
    start_date;
    target_date;
    description : string
    reference_code;
    milestone_progress;
    event_monitoring_status;
    sub_sections;
    sections;
    departments;
    divisions;
    organizations;
    workflow_items;
    next_review_user_level;
    submitted_by;
    event_manager;
    event_issues;
    event_documents;
    event_budgets;
    event_risks;
    event_scopes;
    event_payments;
    event_stakeholders;
    event_strategic_alignments;
    event_milestones;

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
    event_milestone_title : string,
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
   due;
   title;
   description;
   completion;
}

export interface IndivitualMilestones {
    id;
    due;
    title;
    description;
    completion
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

