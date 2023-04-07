import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CyberIncidentClassification, CyberIncidentClassificationResponse, CyberIncidentClassificationSingle } from 'src/app/core/models/masters/cyber-incident/cyber-incident-classification';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberIncidentClassificationMasterStore } from 'src/app/stores/masters/cyber-incident/cyber-incident-classification-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentClassificationService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<CyberIncidentClassificationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CyberIncidentClassificationMasterStore.currentPage}`;
      if (CyberIncidentClassificationMasterStore.orderBy) params += `&order_by=${CyberIncidentClassificationMasterStore.orderItem}&order=${CyberIncidentClassificationMasterStore.orderBy}`;
    }
    if(additionalParams) params += additionalParams;
    if(is_all) params += '&status=all';
    if(CyberIncidentClassificationMasterStore.searchText) params += (params ? '&q=' : '?q=')+CyberIncidentClassificationMasterStore.searchText;
    return this._http.get<CyberIncidentClassificationResponse>('/cyber-incident-classification' + (params ? params : '')).pipe(
      map((res: CyberIncidentClassificationResponse) => {
        CyberIncidentClassificationMasterStore.setCyberIncidentClassification(res);
        return res;
      })
    );
 
  }

  // getAllItems(): Observable<CyberIncidentClassification[]>{
  //   return this._http.get<CyberIncidentClassification[]>('/cyber-incident-classification?is_all=true').pipe(
  //     map((res: CyberIncidentClassification[]) => {
        
  //       CyberIncidentClassificationMasterStore.setAllCyberIncidentClassification(res);
  //       return res;
  //     })
  //   );
  // }

  getItem(id: number): Observable<CyberIncidentClassificationSingle> {
    return this._http.get<CyberIncidentClassificationSingle>('/cyber-incident-classification/' + id).pipe(
      map((res: CyberIncidentClassificationSingle) => {
        CyberIncidentClassificationMasterStore.setindividualCyberIncidentClassificationSingle(res)
        return res;
      })
    );
  }


  updateItem(id,item:any):Observable<any>{
    return this._http.put('/cyber-incident-classification/'+id,item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','update_success');
      this.getItems(false,null,true).subscribe()
      return res;
    }))
  }

  saveItem(item:any){
    return this._http.post('/cyber-incident-classification', item).pipe(map(res => {
      CyberIncidentClassificationMasterStore.setLastInsertedCIClassification(res['id']);
      this._utilityService.showSuccessMessage('success','create_success');
      if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
      else this.getItems().subscribe();
      return res;
    }))

  }
  
  delete(id:number){
    return this._http.delete('/cyber-incident-classification/'+id).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','delete_success');
      this.getItems(false,null,true).subscribe(resp=>{
        if (resp.from==null){
          CyberIncidentClassificationMasterStore.setCurrentPage(resp.current_page-1);
          this.getItems(false,null,true).subscribe();
        }
      })
      return res;
    }))
  }

  activate(id:number){
    return this._http.put('/cyber-incident-classification/' + id + '/activate',null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','activate_success');
        this.getItems(false,null,true).subscribe();
        return res;
    }))
  }

  deactivate(id:number){
    return this._http.put('/cyber-incident-classification/' + id + '/deactivate',null).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success','deactivate_success');
      this.getItems(false,null,true).subscribe();
      return res;
    }))
  }

  generateTemplate() {
    this._http.get('/cyber-incident-classification/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('cyber_incident_classification_template')+".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/cyber-incident-classification/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('cyber_incident_classification')+".xlsx");
      }
    )
  }
  shareData(data){
    return this._http.post('/cyber-incident-classification/share',data).pipe(
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
    return this._http.post('/cyber-incident-classification/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','import_success');
        this.getItems(false,null,true).subscribe();
        return res;
      })
    )
  }

  sortCyberIncidentClassificationList(type:string, text:string) {
    if (!CyberIncidentClassificationMasterStore.orderBy) {
      CyberIncidentClassificationMasterStore.orderBy = 'asc';
      CyberIncidentClassificationMasterStore.orderItem = type;
    }
    else{
      if (CyberIncidentClassificationMasterStore.orderItem == type) {
        if(CyberIncidentClassificationMasterStore.orderBy == 'asc') CyberIncidentClassificationMasterStore.orderBy = 'desc';
        else CyberIncidentClassificationMasterStore.orderBy = 'asc'
      }
      else{
        CyberIncidentClassificationMasterStore.orderBy = 'asc';
        CyberIncidentClassificationMasterStore.orderItem = type;
      }CyberIncidentClassificationMasterStore
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }
}
