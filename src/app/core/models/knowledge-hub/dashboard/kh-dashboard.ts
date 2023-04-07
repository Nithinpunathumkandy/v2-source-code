export interface DashboardCount {
    archived_document_count: number
    archived_document_percentage: string
    document_count: number
    draft_document_count: number
    draft_document_percentage: string
    in_review_document_count: number
    in_review_document_percentage: string
    published_document_count: number
    published_document_percentage: string
    reject_document_count: number
    reject_document_percentage: string
}

export interface DocumentByStatuses {
    id: number
    title: string
    count: number
}

export interface DocumentByTypes {
    id: number
    title: string
    count: number
}

export interface DocumentByDepartments {
    id: number
    title: string
    count: number
}

export interface DocumentCRByStatuses {
    id: number
    title: string
    count: number
}

export interface DocumentByPriority {
    id: number
    title: string
    count: number
}