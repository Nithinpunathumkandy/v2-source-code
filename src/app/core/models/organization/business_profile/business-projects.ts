import { Department } from '../../department.model';
import { Division } from '../../division.model';
import { Subsection } from '../../human-capital/users/users';
import { Section } from '../../section.model';
import { Subsidiary } from './subsidiary/subsidiary';

export interface BusinessProjects{
    id: number;
    title: string;
    description: string;
    member_count: number;
    location_id: number;
    location_title: string;
    project_manager_id: number;
    project_manager_first_name: string;
    project_manager_last_name: string;
    project_status_icon_class: string;
    project_status_language_title: string;
    customer_id: number;
    customer_title: string;
    status_id: number;
    status: string
    created_by: number;
    image_title: string;
    image_url: string;
    image_token: string;
    image_size: number;
    image_ext : string;
}

export interface BusinessProjectsResponse{
    current_page: number;
    data: BusinessProjects[];
    per_page: number;
    total: number;
    from: number;
}

export interface BusinessProjectDetails{
    id: number,
    customer: {
        id: number,
        title: string,
        mobile: string,
        email: string,
        contact_person_number: string,
        address: string,
        status:{
            id: number,
            title: string,
            label: string,
        }
    },
    project_manager: {
        id: number,
        name: string,
        email: string,
        image_url: string,
        designation: string
    },
    location: {
        id: number,
        title: string,
        created_at: string,
        updated_at: string,
        created_by: {
            id: number, 
            name: string, 
            email: string, 
            image_url: string, 
            designation: string
        },
        updated_by: []
        status: {
            id: number, 
            title: string, 
            label: string
        }
    },
    project_status: {
        id: number,
        is_proposed: number,
        is_active: number,
        is_hold: number,
        is_completed: number,
        is_cancelled: number,
        is_archived: number,
        created_at: string,
        updated_at: string,
        created_by: {
            id: number,
            name: string, 
            email: string, 
            image_url: string, 
            designation: string
        },
        updated_by: []
        status: {
            id: number, 
            title: string, 
            label: string
        }
    },
    title: string,
    description: string,
    image_title: string;
    image_url: string;
    image_token: string;
    image_size: number;
    image_ext : string;
    member_count: number,
    start_date:string,
    target_date:string;
    created_at: string,
    updated_at: string,
    created_by: {
        id: number, 
        name: string, 
        email: string, 
        image_url: string, 
        designation: string
    },
    updated_by: {
        id: number, 
        name: string, 
        email: string, 
        image_url: string, 
        designation: string
    }
    status: {
        id: number, 
        title: string, 
        label: string
    }
    organizations: Subsidiary[]
    departments: Department[]
    divisions: Division[]
    sections: Section[]
    sub_sections: Subsection[]
}