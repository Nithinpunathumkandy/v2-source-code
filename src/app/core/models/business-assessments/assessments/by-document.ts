// export interface ExcellentByDocument {
//     id: number;
//     title:string;
// }

// export interface GoodByDocument {
//     id: number;
//     title:string;
// }

// export interface AverageByDocument {
//     id: number;
//     title:string;
// }

// export interface BelowAverageByDocument {
//     id: number;
//     title:string;
// }


export interface ByDocumentSummary{
    first:performanceSummary;
    second:performanceSummary;
    third:performanceSummary;
}

export interface performanceSummary{
   avg_score:string;
   document_id:number;
   document_title:string;
}