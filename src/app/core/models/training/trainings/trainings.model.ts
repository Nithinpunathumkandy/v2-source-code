
import { Division } from "../../division.model"
import { CompetencyGroup } from "../../human-capital/assessment/assessment"
import { Competency } from "../../human-capital/competency-matrix/competency-matrix"
import { User } from "../../knowledge-hub/documents/documentDetails"
import { Organization } from "../../organization.model"
import { Section } from "../../section.model"
import { SubSection } from "../../sub-section.model"

export interface Trainings {
    id: number,
    title: string,
    description: string,
    start_date: string,
    end_date: string,
    venue: string,
    web_url: string,
    training_category_id: number,
    competency_group_id: number,
    competency_ids: number,
    trainer: string,
    trainer_description: string,
    training_participants: TrainingParticipants[];
    organization_ids: number,
    division_id: number;
    department_id: number;
    section_ids: number,
    sub_section_ids: number,
    training_category_title:string;
    training_status_id: number;
    training_status_label: string;
    training_status_title: string;
    training_status_type: string;
    training_category:{
        title:string;
    }
    training_status:{
        label:string;
        language:language
    }
}

export interface TrainingsPaginationResponse {
    current_page: number;
    total: number;
    per_page: number;
    last_page: number;
    from: number;
    data: Trainings[];
}

export interface TrainingParticipants {
    user_id: number;
}

export interface IndividualTrainings {
    competencies: Competency[];
    competency_group: CompetencyGroup[];
    created_at: string,
    created_by: CreatedBy;
    departments: Department;
    description: string;
    divisions: Division
    end_date: string,
    id: number;
    organizations: Organization[];
    participants: Participants;
    reference_code: string,
    sections: Section;
    start_date: string,
    sub_sections: SubSection
    title: string,
    trainer: string,
    trainer_description: string,
    training_category: {
        description: string,
        id: number;
        status_id: number;
        title: string,
    }
    training_status_update:TrainingUpdates[]
    training_status: {
        id: number;
        type: string;
        language: language[];
    },
    venue: string,
    web_url: string,
}

export interface TrainingUpdates{
    id:number;
    training_status:{
        id: number;
        type: string;
        language: language[];
    },
    user:User,
    created_at:string
}

export interface Department {
    id: number;
    title: string;
}

export interface Participants {
    absent:CommonParticipants[];
    participants:CommonParticipants[];
    present:CommonParticipants[];
}
export interface language{
    id:number,
    pivot:{
      title:string
    }
  }

export interface CommonParticipants{
    id: 1
    is_accepted: any;
    is_rejected: any;
    status: any;
    user: User;
}
export interface CreatedBy{
    designation: string;
    email: string;
    first_name: string;
    last_name: string;
    mobile: number;
    image: Image;
    id:number;
}
export interface Image{
    title: string;
    thumbnail_url: string;
    token:string;
    }