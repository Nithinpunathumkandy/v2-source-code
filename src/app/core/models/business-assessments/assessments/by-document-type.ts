export interface ExcellentByDocumentType {
    id: number;
    title:string;
}

export interface GoodByDocumentType {
    id: number;
    title:string;
}

export interface AverageByDocumentType {
    id: number;
    title:string;
}

export interface BelowAverageByDocumentType {
    id: number;
    title:string;
}


export interface ByDocumentTypeSummary{
    first:performanceSummary;
    second:performanceSummary;
    third:performanceSummary;
}

export interface performanceSummary{
   avg_score:string;
   document_type_id:number;
   document_type_title:string;
}