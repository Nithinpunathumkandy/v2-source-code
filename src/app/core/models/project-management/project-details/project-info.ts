
export interface ProjectManagementInfo {
    id:                    number;
    project:               null | any;
    project_type:          ProjectType;
    customer:              Customer;
    project_manager:       CreatedBy;
    location:              Location;
    project_category:      ProjectCategory;
    project_status:        ProjectStatus;
    project_contract_type: any[];
    project_priority:      any[];
    is_system_project:     number;
    title:                 string;
    description:           string;
    start_date:            string;
    target_date:           string;
    completed_score: string;
    task_completed: string;
    total_tasks: string;
    image_title:           string;
    image_url:             string;
    image_token:           string;
    image_size:            number;
    image_ext:             string;
    member_count:          null | any;
    organizations:         Organization[];
    divisions:             Department[];
    departments:           Department[];
    sections:              Department[];
    sub_sections:          any[];
    created_at:            string;
    updated_at:            string;
    created_by:            CreatedBy;
    updated_by:            any[];
}

export interface CreatedBy {
    id:          number;
    first_name:  string;
    last_name:   string;
    email:       string;
    mobile:      null | any;
    image:       Image;
    designation: string;
    department:  string;
    status:      Status;
}

export interface Image {
    title:         null | string;
    url:           null | string;
    token:         null | string;
    size:          number | null;
    ext:           null | string;
    thumbnail_url: null | any;
}

export interface Status {
    id:    number;
    title: Title[];
    label: string;
}

export interface Title {
    id:         number;
    type:       string;
    code:       string;
    title:      string;
    is_primary: number;
    is_rtl:     number;
    created_at: string;
    updated_at: string;
    created_by: null | any;
    updated_by: null | any;
    status_id:  number;
    pivot:      TitlePivot;
}

export interface TitlePivot {
    status_id:   number;
    language_id: number;
    title:       string;
}

export interface Customer {
    id:                    number;
    title:                 string;
    image_title:           string;
    image_url:             string;
    image_size:            number;
    image_ext:             string;
    image_token:           string;
    mobile:                string;
    email:                 string;
    contact_person_number: string;
    address:               string;
    status:                Status;
}

export interface Department {
    id:    number;
    title: string;
}

export interface Location {
    id:         number;
    title:      string;
    created_at: string;
    updated_at: string;
    created_by: CreatedBy;
    updated_by: any[];
    status:     Status;
}

export interface Organization {
    id:             number;
    title:          string;
    description:    string;
    logo_url:       null | any;
    is_primary:     number;
    establish_date: string;
    phone:          null | string;
    address:        null | string;
    website:        null | any;
}

export interface ProjectCategory {
    id:          number;
    title:       string;
    description: null | any;
    created_at:  string;
    updated_at:  string;
    created_by:  number;
    updated_by:  null | any;
    status_id:   number;
}

export interface ProjectStatus {
    id:           number;
    icon_class:   string;
    is_proposed:  number;
    is_hold:      number;
    is_active:    number;
    is_completed: number;
    is_cancelled: number;
    is_archived:  number;
    created_at:   string;
    updated_at:   string;
    created_by:   number;
    updated_by:   null | any;
    status_id:    number;
    language:     ProjectStatusLanguage[];
}

export interface ProjectStatusLanguage {
    id:         number;
    type:       string;
    code:       string;
    title:      string;
    is_primary: number;
    is_rtl:     number;
    created_at: string;
    updated_at: string;
    created_by: null | any;
    updated_by: null | any;
    status_id:  number;
    pivot:      PurplePivot;
}

export interface PurplePivot {
    project_status_id: number;
    language_id:       number;
    title:             string;
}

export interface ProjectType {
    id:          number;
    is_internal: number;
    is_external: number;
    created_at:  string;
    updated_at:  string;
    created_by:  number;
    updated_by:  null | any;
    status_id:   number;
    language:    ProjectTypeLanguage[];
}

export interface ProjectTypeLanguage {
    id:         number;
    type:       string;
    code:       string;
    title:      string;
    is_primary: number;
    is_rtl:     number;
    created_at: string;
    updated_at: string;
    created_by: null | any;
    updated_by: null | any;
    status_id:  number;
    pivot:      FluffyPivot;
}

export interface FluffyPivot {
    project_type_id: number;
    language_id:     number;
    title:           string;
}
