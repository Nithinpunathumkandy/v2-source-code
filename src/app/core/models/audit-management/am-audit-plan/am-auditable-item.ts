import { Controls } from "../../bpm/controls/controls";
import { Processes } from "../../bpm/process/processes";
import { StrategicObjectives } from "../../mrm/meeting-plan/mapping";
import { Risk } from "../../risk-management/risks/risks";
import { Department } from '../../masters/organization/department';

export interface AmAuditableItems{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: AuditableItems[];
}


export interface AmAuditableItemProcesses{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Processes[];
}

export interface AmAuditableItemControls{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Controls[];
}

export interface AmAuditableItemRisks{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Risk[];
}

export interface AmAuditableItemObjectives{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: StrategicObjectives[];
}

export interface AmAuditableItemDepartments{
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Department[];
}

export interface AuditableItems{
    process_id:number;
    risk_id:number;
    strategic_objective_id:number;
    department_id:number;
    type: String;
    id:number;
    am_annual_plan_frequency_item:any;
}