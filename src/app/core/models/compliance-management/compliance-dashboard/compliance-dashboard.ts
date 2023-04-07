export interface ComplianceCount{
    external_compliance_percentage: any;
    fully_compliance: number;
    fully_compliance_percentage: any;
    internal_compliance_percentage: any;
    partialy_compliance: number;
    partialy_compliance_percentage: number;
    total_compliance: number;
    exception_granted: number;
    exception_granted_percentage: number;
}

export interface ComplianceStatusCountByStatus{
count: number;
id: number;
percentage: number;
status: string;
total_compliance: number;
}

export interface SlaContractByCategory{
    count: number;
    id: number;
    percentage: number;
    title: string;
    total_sla: number;
}

export interface SlaContractDocumentStatus{
    count: number;
    id: number;
    percentage: number;
    title: string;
    total_sla: number;
    }

    export interface ComplianceRequirementType{
        external: number;
        external_percentage: number;
        internal: number;
        internal_percentage: number;
        month: string;
    }

    export interface ComplianceChartDetails{
        count: number;
        id: number;
        percentage: number;
        title: string;
        code:string;
        total_compliance: number;
    }

    export interface SlaContractChartDetails{
        count: number;
        id: number;
        percentage: number;
        title: string
        code:string;
        total_sla: number;
    }

    export interface LevelOfCompliance{
        Weight: number;
        descriptions: ComplianceDescription[]
        rating: string;
        title: string;
        color: string;
    }

    export interface ComplianceDescription{
        id:number;
    }

    export interface ComplianceByProducts{
        count: number;
        id: number;
        title: string;
    }

    export interface SlaByProducts{
        count: number;
        id: number;
        title: string;
    }