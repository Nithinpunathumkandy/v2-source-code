import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {Label,LabelPaginationResponse} from 'src/app/core/models/masters/general/label';
import{LabelMasterStore} from 'src/app/stores/masters/general/label-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppStore } from 'src/app/stores/app.store';

@Injectable({
  providedIn: 'root'
})

export class LabelService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string, status: boolean = false): Observable<LabelPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${LabelMasterStore.currentPage}`;
        if (LabelMasterStore.orderBy) params += `&order_by=${LabelMasterStore.orderItem}&order=${LabelMasterStore.orderBy}`;
        if(LabelMasterStore.searchTerm) params += `&q=${LabelMasterStore.searchTerm}`;
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(additionalParams) params += additionalParams;
      return this._http.get<LabelPaginationResponse>('/labels' + (params ? params : '')).pipe(
        map((res: LabelPaginationResponse) => {
          for(let i of res.data){
            for(var j = 0; j < i.languages.length; j++){
              if(i.languages[j].status_id == AppStore.inActiveStatusId){
                i.languages.splice(j,1);
                j--;
              }
            }
          }
          LabelMasterStore.setLabel(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<Label[]>{
      return this._http.get<Label[]>('/labels?is_all=true').pipe(
        map((res: Label[]) => {
          
          LabelMasterStore.setAllLabels(res);
          return res;
        })
      );
    }

    getInitialLabels(params?:string):Observable<any>{
      return this._http.get<any>('/labels'+params).pipe(
        map((res: any) => {
          LabelMasterStore.setLabelsToTranslate(res);
          return res;
        })
      );
    }

    saveItem(item: any) {
      return this._http.post('/labels', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'create_success');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/labels/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/labels/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_success');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              LabelMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/labels/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'activate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/labels/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'deactivate_success');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/labels/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('label_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/labels/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('label')+".xlsx");
        }
      )
    }
    importData(data){
      // console.log(data);
      // let importDetails = {file: data};
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/labels/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','import_success');
          return res;
        })
      )
    }
    sortGenerallList(type:string, text:string) {
      if (!LabelMasterStore.orderBy) {
        LabelMasterStore.orderBy = 'asc';
        LabelMasterStore.orderItem = type;
      }
      else{
        if (LabelMasterStore.orderItem == type) {
          if(LabelMasterStore.orderBy == 'asc') LabelMasterStore.orderBy = 'desc';
          else LabelMasterStore.orderBy = 'asc'
        }
        else{
          LabelMasterStore.orderBy = 'asc';
          LabelMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
    
    

}



