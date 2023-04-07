import { Language } from "../../project-monitoring/project-issue-ca";

export type listStyleType = 'grid' | 'table' ;

export interface ProjectListResponse {
    current_page:   number;
    data:           ProjectListDatum[];
    first_page_url: string;
    from:           number;
    last_page:      number;
    last_page_url:  string;
    next_page_url:  string;
    path:           string;
    per_page:       number;
    prev_page_url:  null;
    to:             number;
    total:          number;
}

export interface ProjectListDatum {
    id:                            number;
    title:                         string;
    description:                   null | string;
    is_system_project:             number;
    start_date:                    null | string;
    target_date:                   null | string;
    member_count:                  number | null;
    image_url:                     null | string;
    image_title:                   null | string;
    image_ext:                     null | string;
    image_size:                    number | null;
    image_token:                   null | string;
    project_type_id:               number | null;
    project_type_title:            ProjectTypeTitle | null;
    location_id:                   number | null;
    location_title:                null | string;
    project_manager_id:            number | null;
    project_manager_first_name:    null | string;
    project_manager_last_name:     null | string;
    project_manager_image_token:   null;
    designation_id:                number | null;
    project_manager_designation:   null | string;
    project_category_id:           number | null;
    project_category_title:        ProjectCategoryTitle | null;
    customer_id:                   number | null;
    customer_title:                CustomerTitle | null;
    customer_image_token:          null | string;
    project_status_icon_class:     string;
    language_id:                   number;
    project_status_language_title: string;
    total_task:                    number;
    sub_project_count: number;
    task_opened:                   string;
    task_closed:                   string;
    created_by:                    number;
    created_by_first_name:         AtedByFirstName;
    created_by_last_name:          CreatedByDesignation;
    created_by_image_token:        null | string;
    created_by_designation:        CreatedByDesignation;
    created_by_department:         AtedByDepartment;
    created_by_status:             AtedByStatus;
    created_at:                    string;
    updated_by:                    number | null;
    updated_by_first_name:         AtedByFirstName | null;
    updated_by_last_name:          CreatedByDesignation | null;
    updated_by_image_token:        null | string;
    updated_by_designation:        CreatedByDesignation | null;
    updated_by_department:         AtedByDepartment | null;
    updated_by_status:             AtedByStatus | null;
    updated_at:                    string;
    projects:                      SubProject[];
    projected_man_days: number;
    project_time_tracker_activity_id: number;
    project_time_tracker_activity:ProjectTimeTrackerActivity;
}

export interface ProjectTimeTrackerActivity{
    id:number;
    type:string;
    language:Language[];
}

export enum AtedByDepartment {
    DigitalMarketing = "Digital Marketing",
}

export enum CreatedByDesignation {
    Admin = "Admin",
}

export enum AtedByFirstName {
    Super = "Super",
}

export enum AtedByStatus {
    Active = "Active",
}

export enum CustomerTitle {
    Dafm = "DAFM",
    Dewa = "DEWA",
    Test = "test",
}

export enum ProjectCategoryTitle {
    Management = "Management ",
    Manufacturing = "Manufacturing",
    Research = "Research",
}

export enum ProjectTypeTitle {
    External = "External",
}

export interface SubProjectArray{
    data: SubProject[];
}
export interface SubProject {
    id:                            number;
    title:                         string;
    description:                   string;
    is_system_project:             number;
    start_date:                    string;
    target_date:                   string;
    member_count:                  number;
    image_url:                     string;
    image_title:                   string;
    image_ext:                     string;
    image_size:                    number;
    image_token:                   string;
    project_type_id:               number;
    project_type_title:            string;
    location_id:                   number;
    location_title:                string;
    project_manager_id:            number;
    project_manager_first_name:    string;
    project_manager_last_name:     string;
    project_manager_image_token:   null | string;
    designation_id:                number;
    project_manager_designation:   string;
    project_category_id:           number;
    project_category_title:        string;
    customer_id:                   number;
    customer_title:                string;
    customer_image_token:          string;
    project_status_icon_class:     string;
    language_id:                   number;
    project_status_language_title: string;
    sub_project_count:             number;
    total_task:                    number;
    task_opened:                   string;
    task_closed:                   string;
    created_by:                    number;
    created_by_first_name:         string;
    created_by_last_name:          string;
    created_by_image_token:        null | string;
    created_by_designation:        string;
    created_by_department:         string;
    created_by_status:             string;
    created_at:                    string;
    updated_by:                    null | string;
    updated_by_first_name:         null | string;
    updated_by_last_name:          null | string;
    updated_by_image_token:        null | string;
    updated_by_designation:        null | string;
    updated_by_department:         null | string;
    updated_by_status:             null | string;
    updated_at:                    string;
}
