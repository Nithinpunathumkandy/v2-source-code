import { Users } from "../../human-capital/users/users";
import { User } from "../../user.model";

export interface MsAuditTeam {
    id: number;
    status: string;
    team_members: string;
    team_lead_first_name: string;
    team_lead_last_name: string;
    team_lead_designation_title: string;
    image_token: string;
    status_id: number;
    status_label: string;
    title: string;
}
export interface MsAuditTeamPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: MsAuditTeam[];
}

export interface IndividualTeam {
    id: number;
    created_at:string;
    created_by:User;
    title: string;
    is_audit_team: boolean;
    image_ext: string;
    image_size: number;
    image_title: string;
    image_token: string;
    image_url: string;
    team_user: Users;
    ms_audit_category:any;
    team_lead: {
        id: number;
        first_name: string
        last_name: string
        designation: string
        department: string;
        email: string;
        mobile: number;
        status: {
            id: number;
        }
        image: {
            token: string
        }
    }
    team_members: {
        id: number;
        first_name: string;
        last_name: string;
        image_token: string;
        email: string;
        mobile: number;
        status_id: number;
        designation: {
            title: string;
        }

    }[]
    status: {
        id: number;
        title: AuditTeamStatus[]
        label: string;
    }
}
export interface AuditTeamStatus {
    pivot: {
        title: string;
    }
}
export interface Designation {
    id: number;
    title: string;
    is_super_admin: boolean;
}