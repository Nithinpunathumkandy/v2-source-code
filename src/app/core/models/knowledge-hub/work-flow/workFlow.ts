import { Organization } from '../../organization.model';
import { Section } from '../../section.model';
import { SubSection } from '../../sub-section.model';
import { Status } from '../../status.model';
import { UpdatedBy } from '../../general/updated_by';
import { Department } from '../../department.model';
import { Division } from '../../division.model';
import { User } from '../documents/documentDetails';
import { Departments, Divisions, organizations, Sections, SubSections } from '../../internal-audit/audit-workflow/audit-workflow';

export interface workFlow{
    title: string,
    description: string,
    document_type_ids: number,
    organization_ids: number,
    section_ids: number,
    sub_section_ids: number,
    division_ids: number,
    department_ids: number,
}

export interface WorkFlowList{

    created_at: string;
    created_by: CreatedBy;
    description: string;
    id: number;
    reference_code: string;
    title: string;
    document_types: DocumentsType;
    review_users: CommonUsers[];
    approval_users: CommonUsers[];
}

// export interface WorkFlowDetails{
   
//     created_at: string;
//     created_by: CreatedBy;
//     description: string;
//     id: number;
//     reference_code: string;
//     title: string;
//     document_types: DocumentsType;
//     review_users: CommonUsers[];
//     approval_users: CommonUsers[];
//     organizations: Organization;
//     sections: Section;
//     module: {
//         id: number;
//         title: string;
//     }
//     sub_sections: SubSection;
//     status: Status;
//     departments: Department;
//     divisions: Division;
//     updated_by: UpdatedBy;
//     updated_at: string;

// }
export interface WorkFlowDetails {
    id: number;
    title: string;
    created_at: string;
    created_by: CreatedBy;
    document_types: DocumentsType;
    created_by_image_token: string;
    created_by_first_name :string;
    module: {
        id:number;
    };
    departments:Departments;
    divisions:Divisions;
    sub_sections:SubSections;
    organizations:organizations;
    sections:Sections;
    workflow_items:WorkflowItems[];
    description:string;
}
export interface WorkflowItems {
    created_at:string
    id:number
    level:number
    type: string;
    users:UserDetails[]
}

export interface UserDetails{
    id: number;
}



export interface CommonUsers{

    created_by: CreatedBy;
    id: number;
    level: number;
    status: {
        id: number;
        title: string;
        label: string;
    };
    updated_at: string;
    updated_by: string;
    user: CreatedBy;
    document_workflow:DocumentWorkFlow

}

export interface DocumentWorkFlow{
    created_at: string;
    created_by: string;
    description: string,
    id: number;
    reference_code: string;
    status_id: number;
    title: string;
    updated_at: string;
    updated_by: string;
}

export interface DocumentsType{
    id: number,
    title: string,
    description: string,
    
}

export interface CreatedBy{
    id: number, 
    first_name: string, 
    last_name: string, 
    email: string, 
    image_url: string, 
    designation: string,
    image: Image
}


export interface Image{
    name?: string;
    ext: string;
    mime_type?: string;
    size: number;
    url: string;
    preview: string;
    token: string;
    title?: string;
    thumbnail_url?:string;
    is_deleted?:boolean;
    id?: number;
    is_new?: boolean;
}

export interface ReviewUsersList{
    created_at: string;
    created_by: string;
    created_by_first_name: string;
    created_by_last_name: string;
    designation_id: number;
    designation_title: string;
    id: number;
    level: number;
    review_user_first_name: string;
    review_user_image_ext: string;
    review_user_image_size: number;
    review_user_image_title: string;
    review_user_image_token: string;
    review_user_image_url: string;
    review_user_last_name: string;
    status: string;
    status_id: number;
    
}

export interface CurrentUsersList{
    created_at: string;
    created_by: CreatedBy;
    department: Department;
    id: number;
    level: number;
    status: {
        id: number;
        label: string;
        title: string;
    };
    updated_at: string;
    updated_by: UpdatedBy;
    user:User
}

export interface ApprovalUsersList{
    created_at: string;
    created_by: string;
    created_by_first_name: string;
    created_by_last_name: string;
    designation_id: number;
    designation_title: string;
    id: number;
    level: number;
    status: string;
    status_id: number;
    approval_user_first_name: string;
    approval_user_image_ext: string;
    approval_user_image_size: number;
    approval_user_image_title: string;
    approval_user_image_token: string;
    approval_user_image_url: string;
    approval_user_last_name: string;
}

export interface ReviewUsersPaginationResponse{
    current_page:number;
    total:number;
    per_page:number;
    data:ReviewUsersList[];

}


export interface ApprovalUsersPaginationResponse{
    current_page:number;
    total:number;
    per_page:number;
    data:ApprovalUsersList[];

}

export interface Users{
    user_ids: [number];
    department_ids: [number];
}

export interface WorkFlowPaginationResponse{

    // meta: {
    //     current_page: number;
    //     from: number;
    //     last_page: number;
    //     path: string;
    //     to: number;
    //     total: number;
    //     per_page: number;
    // },
    // links: {
    //     first: string;
    //     last: string;
    //     next: string;
    //     prev: string;
    // }
    current_page: number;
    per_page: number;
    total: number;
    from: number;
    last_page: number;
    to: number;
    data:WorkFlowList[];


}
