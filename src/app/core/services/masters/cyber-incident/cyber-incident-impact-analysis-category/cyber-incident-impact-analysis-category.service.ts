import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CyberIncidentImpactAnalysisCategory, CyberIncidentImpactAnalysisCategoryResponse, CyberIncidentImpactAnalysisCategorySingle } from 'src/app/core/models/masters/cyber-incident/cyber-incident-impact-analysis-category';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberIncidentImpactAnalysisCategoryMasterStore } from 'src/app/stores/masters/cyber-incident/cyber-incident-impact-analysis-category-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentImpactAnalysisCategoryService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<CyberIncidentImpactAnalysisCategoryResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CyberIncidentImpactAnalysisCategoryMasterStore.currentPage}`;
      if (CyberIncidentImpactAnalysisCategoryMasterStore.orderBy) params += `&order_by=${CyberIncidentImpactAnalysisCategoryMasterStore.orderItem}&order=${CyberIncidentImpactAnalysisCategoryMasterStore.orderBy}`;
    }
    else{
      this.getAllItems();
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(CyberIncidentImpactAnalysisCategoryMasterStore.searchText) params += (params ? '&q=' : '?q=')+CyberIncidentImpactAnalysisCategoryMasterStore.searchText;
    return this._http.get<CyberIncidentImpactAnalysisCategoryResponse>('/cyber-incident-impact-analysis-categories' + (params ? params : '')).pipe(
      map((res: CyberIncidentImpactAnalysisCategoryResponse) => {
        CyberIncidentImpactAnalysisCategoryMasterStore.setCyberIncidentImpactAnalysisCategory(res);
        return res;
      })
    );
 
  }

  getAllItems(): Observable<CyberIncidentImpactAnalysisCategory[]>{
    return this._http.get<CyberIncidentImpactAnalysisCategory[]>('/cyber-incident-impact-analysis-categories?is_all=true').pipe(
      map((res: CyberIncidentImpactAnalysisCategory[]) => {
        
        CyberIncidentImpactAnalysisCategoryMasterStore.setAllCyberIncidentImpactAnalysisCategory(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<CyberIncidentImpactAnalysisCategorySingle> {
    return this._http.get<CyberIncidentImpactAnalysisCategorySingle>('/cyber-incident-impact-analysis-categories/' + id).pipe(
      map((res: CyberIncidentImpactAnalysisCategorySingle) => {
        CyberIncidentImpactAnalysisCategoryMasterStore.setIndividualCyberIncidentImpactAnalysisCategory(res)
        return res;
      })
    );
  }


  updateItem(id,item:any):Observable<any>{
    return this._http.put('/cyber-incident-impact-analysis-categories/'+id,item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','update_success');
      this.getItems(false,null,true).subscribe()
      return res;
    }))
  }

  saveItem(item:any){
    return this._http.post('/cyber-incident-impact-analysis-categories', item).pipe(map(res => {
      CyberIncidentImpactAnalysisCategoryMasterStore.setLastInsertedCICategory(res['id']);
      this._utilityService.showSuccessMessage('success','create_success');
      if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
      else this.getItems().subscribe();
      return res;
    }))

  }
  
  delete(id:number){
    return this._http.delete('/cyber-incident-impact-analysis-categories/'+id).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','delete_success');
      this.getItems(false,null,true).subscribe(resp=>{
        if (resp.from==null){
          CyberIncidentImpactAnalysisCategoryMasterStore.setCurrentPage(resp.current_page-1);
          this.getItems(false,null,true).subscribe();
        }
      })
      return res;
    }))
  }

  activate(id:number){
    return this._http.put('/cyber-incident-impact-analysis-categories/' + id + '/activate',null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
    }))
  }

  deactivate(id:number){
    return this._http.put('/cyber-incident-impact-analysis-categories/' + id + '/deactivate',null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','deactivate_success');
      this.getItems(false,null,true).subscribe();
      return res;
    }))
  }

  generateTemplate() {
    this._http.get('/cyber-incident-impact-analysis-categories/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('cyber_incident_impact_analysis_category_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/cyber-incident-impact-analysis-categories/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('cyber_incident_impact_analysis_category')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/cyber-incident-impact-analysis-categories/share',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','share_success');
        return res;
      })
    )
  }
  importData(data){
    // console.log(data);
    // let importDetails = {file: data};
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/cyber-incident-impact-analysis-categories/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortCyberIncidentImpactAnalysisCategoryList(type:string, text:string) {
    if (!CyberIncidentImpactAnalysisCategoryMasterStore.orderBy) {
      CyberIncidentImpactAnalysisCategoryMasterStore.orderBy = 'asc';
      CyberIncidentImpactAnalysisCategoryMasterStore.orderItem = type;
    }
    else{
      if (CyberIncidentImpactAnalysisCategoryMasterStore.orderItem == type) {
        if(CyberIncidentImpactAnalysisCategoryMasterStore.orderBy == 'asc') CyberIncidentImpactAnalysisCategoryMasterStore.orderBy = 'desc';
        else CyberIncidentImpactAnalysisCategoryMasterStore.orderBy = 'asc'
      }
      else{
        CyberIncidentImpactAnalysisCategoryMasterStore.orderBy = 'asc';
        CyberIncidentImpactAnalysisCategoryMasterStore.orderItem = type;
      }CyberIncidentImpactAnalysisCategoryMasterStore
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
