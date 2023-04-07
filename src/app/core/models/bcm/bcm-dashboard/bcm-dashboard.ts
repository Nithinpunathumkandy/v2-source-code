export interface BCMCounts{
    bc_strategy_count
    bcm_team_count
    bcp_count
    bia_count
    change_request_count
    process_count
    residual_risk_count
    risk_treatment_count
    solutions_count
    test_and_exercise_count
}

export interface SolutionCountByScores{
    count
    score
}

export interface CriticalProcessCounts{
    color_code
    count
    id
    title
}

export interface RiskCounts{
    color
    count
    id
    label
    risk_ratings
}

export interface BCPCountByStatuses{
    business_continuity_plan_status
    label
    color_code
    count
    id
    percentage
    type
}

export interface StrategyCountByStatuses{
    business_continuity_strategy_status
    count
    label
    color_code
    id
    percentage
    type
}

export interface StrategyCountByTypes{
    count
    id
    percentage
    type
}

export interface ChangeRequestCountByYears{
    total_count
    year
}

export interface TestAndExercisePerformedCounts{
    test_performed_count
    total_count
}

export interface BIAPerformedCounts{
    bia_count
    process_count
    total
}

export interface BIAByYear{
    count
    year
}