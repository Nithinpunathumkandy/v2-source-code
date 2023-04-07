export interface JsoCount {
    total_negative_count: number;
    total_observation_closed_count: number;
    total_observation_count: number;
    total_observation_open_count: number;
    total_positive_count: number;
}

export interface jsoPositiveNegativeCount{
    month: string;
    negative_count: number;
    positive_count: number;
}

export interface jsoOpenClosed{
    closed_count: number;
    closed_percentage: number;
    month: string;
    open_count: number;
    open_percentage: number;
    total_count: number;
    total_percentage: number;
}

export interface jsoNumberOfObservations{
    code: string;
    count: number;
    designation_id: number;
    id: number;
    title: string;
}

export interface jsoParticipationPerDepartment{
    count: number;
    department_id: number;
    department_title: string;
    department_code:string;
    id: number;
    percentage: number;
    total_count: number;
}

export interface jsoObservationCategories{
    category_id: number;
    count: number;
    title: string;
}