import { CreatedBy } from "../../general/created_by";
import { Languages } from "../../masters/general/label";

export interface AdvancedProcessRecovery{
    accessibility:{
        id:number,
        value:string
    },
    availability_storing_documents:{
        id:number,
        value:string
    },
    backup_offsite:{
        id:number,
        value:string
    },
    backup_storage:{
        id:number,
        value:string
    },
    external_dependencies:{
        id:number,
        value:string
    },
    frequancy_backup:{
        id:number,
        value:string
    },
    high_availabililty_status:{
        id:number,
        value:string
    },
    
    internal_dependencies:{
        id:number,
        value:string
    },
    is_this_single_point_failure:{
        id:number,
        value:string
    },
    mode:{
        id:number,
        value:string
    },
    operation_freq:{
        id:number,
        value:string
    },
    periodic_backup:{
        id:number,
        value:string
    },
    record_retention_policy:{
        id:number,
        value:string
    },
    recovery_verififcarion_process:{
        id:number,
        value:string
    },
    single_point_failure:{
        id:number,
        value:string
    },
    storage_location:{
        id:number,
        value:string
    },
    storage_type:{
        id:number,
        value:string
    },
    type:{
        id:number,
        value:string
    }
    secondary_process_owner:User[]
    primary_process_owner:User[]
    data_backup_owner:User[]
    person_responsible:User[]
    vital_record_name:string,
    total_number_of_staff:string
    rli_remark:string
    recovery_procedure_details:string
    qty_in_use:string
    peak_period:string
    normal_working_hours:string
    is_defined: boolean
    is_monitored: boolean
    is_not_available:boolean
    cpo_description: string
    dependencies_description: string
    describe_reason: string
    details_backup_offsite: string
    location:number
}

// export interface savedDependencies{
//     process_id:number
//     related_processes:RelatedProcess[]
// }

export interface savedDependencies{
    related_process_id:number
    process_activity_ids:[]
}

export interface User{
  id: number,
  first_name: string,
  last_name: string,
  email: string;
  mobile: number;
  designation: string,
  title: string;
  thumbnail_url: string;
  image_ext: string,
  image_size: string,
  image_token: string,
  image_url: string,
}
export interface ProcessWithActivities{
    id:number,
    title:string,
    reference_code:string,
    process_activities:ProcessActivities[]
}

export interface ProcessActivities{
    id: number,
    process_id: number,
    title: string
}

export interface AdvancedProcessDiscovery{
    created_by:CreatedBy,
    title:string,
    critical_operation:CriticalOperation,
    resource_level_information:ResourceLevelInformation,
    process_dependency:Dependencies,
    process_application_tools:ApplicationTools[],
    process_vital_record:VitalRecord[]
    process_assets : assets[]
}

export interface assets {
    title : string,
    id : number,
    description : string
    pivot : {
        description : string  
    }
    asset_category,
    asset_type 
}

export interface VitalRecord{
    backup_at_offsite_status:BackupAtOffsiteStatus
    backup_at_offsite_status_id:number
    backup_freequency:BackupFrequency
    backup_frequency_id:number
    backup_responsible_user:User
    backup_responsible_user_id:number
    backup_storage_location:BackupStorageLocation
    backup_storage_location_id:number
    id:number
    is_fireproof_cabin:number
    is_single_point_of_failure:number
    offsite_backup_details:string
    periodic_backup:PeriodicBackup
    record_retension_policy:RecordRetensionPolicy
    storage_location:StorageLocation
    storage_type:storage_type
    title:string
    is_accordion_active?:boolean
}

export interface storage_type{
    id:number,
    title:String
}

export interface StorageLocation{
    id:number,
    title:String
}

export interface RecordRetensionPolicy{
    id:number,
    title:String
}

export interface PeriodicBackup{
    id:number,
    title:String
}

export interface BackupStorageLocation{
    id:number,
    title:String
}

export interface BackupFrequency{
    id:number,
    title:String
}

export interface BackupAtOffsiteStatus{
    id:number,
    type:String
}

export interface ApplicationTools{
    amc_end:string
    amc_start:string
    business_application_type:BusinessAppType
    business_application_type_id:number
    description:string
    id:number
    is_amc:number
    pivot:{
        business_application_id:number
        description:string
    }
    quantity:number
    supplier_id:number
    title:string,
    is_accordion_active?:boolean
}

export interface BusinessAppType{
    id:number
    title?:string
    language:Language[]
}

export interface Dependencies{
    dependency_description:string,
    departments:InternalDependencies[],
    suppliers:ExternalDependencies[],
    related_processes:RelatedProcesss[]
}

export interface RelatedProcesss{
    id:number,
    related_process_id:number,
    dependancy_related_process_activities:ProcessActivity[]
    related_process:RelatedProcessDetails
    is_accordion_active?: boolean;
}

export interface RelatedProcessDetails{
    id:number,
    reference_code:string,
    title:string
}

export interface ProcessActivity{
    id:number,
    title:string
}

export interface ExternalDependencies{
    id:number,
    title:string,
    pivot:{
        supplier_id:number
    }
}

export interface InternalDependencies{
    id:number,
    title:string,
    code:string,
    pivot:{
        department_id:number
    }
}

export interface CriticalOperation{
    id:number,
    description:string,
    is_single_point_of_failure:number,
    high_availability_status:{
        id,
        language:Language[],
    }
    high_availability_status_id:number,
    location:{
        id:number,
        title:string
    },
    location_id:number,
    normal_working_hour_end_time:string,
    normal_working_hour_start_time: string,
    peak_period_end_time: string,
    peak_period_start_time: string,
    process_id:number,
    process_operation_frequency:{
        id:number,
        title:string
    },
    process_operation_frequency_id:any,
    process_operation_mode:{
        id:number,
        title:string
    },
    process_operation_mode_id:number
}
export interface ResourceLevelInformation{
    data_backup_owner_id: number,
    data_backup_owner:owner,
    id:number,
    primary_process_owner:owner,
    primary_process_owner_id:number,
    process_accessibility:{
        id:number,
        title:string
    },
    process_accessibility_id:number,
    process_id:number,
    recovery_procedure_details:string,
    remarks:string,
    secondary_process_owner:owner,
    secondary_process_owner_id:number,
    sla_status:{
        id:number,
        type:string,
    },
    sla_status_id:number,
    total_number_of_staff:number,
    
}

export interface Language{
    id:number,
    pivot:{
        title:string,
        language_id?:number
        high_availability_status_id?:number
        business_application_type_id?:number
    }
}

export interface owner{
    id: number, 
    first_name: string, 
    last_name: string,
    email: string, 
    designation: string,
    mobile: string,
    image_ext: string,
    image_size: number,
    image_title: string,
    image_token: string,
    image_url:string
    department:string,
    status:{
        id:number;
    }
}