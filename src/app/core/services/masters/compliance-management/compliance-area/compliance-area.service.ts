import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {ComplianceAreaMasterStore} from 'src/app/stores/masters/compliance-management/compliance-area-store';
import { ComplianceArea,ComplianceAreaPaginationResponse } from 'src/app/core/models/masters/compliance-management/compliance-area';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Injectable({
  providedIn: 'root'
})
export class ComplianceAreaService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false,additionalParams?:string,status: boolean = false): Observable<ComplianceAreaPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${ComplianceAreaMasterStore.currentPage}`;
        if (ComplianceAreaMasterStore.orderBy) params += `&order_by=${ComplianceAreaMasterStore.orderItem}&order=${ComplianceAreaMasterStore.orderBy}`;

      }
      else{
        this.getAllItems();
      }
     
      if(additionalParams) {
        if(params) params += `&${additionalParams}`;
        else params += `?${additionalParams}`;
      }
      if(status) params += (params ? '&' : '?')+'status=all';
      if(ComplianceAreaMasterStore.searchText) params += (params ? '&q=' : '?q=')+ComplianceAreaMasterStore.searchText;

      return this._http.get<ComplianceAreaPaginationResponse>('/compliance-areas' + (params ? params : '')).pipe(
        map((res: ComplianceAreaPaginationResponse) => {
          ComplianceAreaMasterStore.setComplianceArea(res);
          return res;
        })
      );
   
    }

    getAllItems(): Observable<ComplianceArea[]>{
      return this._http.get<ComplianceArea[]>('/compliance-areas?is_all=true').pipe(
        map((res: ComplianceArea[]) => {
          
          ComplianceAreaMasterStore.setAllComplianceArea(res);
          return res;
        })
      );
    }

    saveItem(item: ComplianceArea) {
      return this._http.post('/compliance-areas', item).pipe(
        map((res:any )=> {
          ComplianceAreaMasterStore.setLastInsertedId(res.id);
          this._utilityService.showSuccessMessage('success', 'compliance_area_added');
          if(this._helperService.checkMasterUrl()) this.getItems(false,null,true).subscribe();
          else this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: ComplianceArea): Observable<any> {
      return this._http.put('/compliance-areas/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'compliance_area_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/compliance-areas/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'compliance_area_deleted');
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              ComplianceAreaMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });

          return res;
        })
      );
    }

    activate(id: number) {
      return this._http.put('/compliance-areas/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'compliance_area_activated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/compliance-areas/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'compliance_area_deactivated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
    generateTemplate() {
      this._http.get('/compliance-areas/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_area_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/compliance-areas/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('compliance_area')+".xlsx");
        }
      )
    }
    shareData(data){
      return this._http.post('/compliance-areas/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/compliance-areas/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','compliance_area_imported');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      )
    }

    searchComplianceArea(params){
      return this.getItems(params ? params : '').pipe(
        map((res: ComplianceAreaPaginationResponse) => {
          ComplianceAreaMasterStore.setComplianceArea(res);
          return res;
        })
      );
    }

    sortComplianceAreaList(type:string, text:string) {
      if (!ComplianceAreaMasterStore.orderBy) {
        ComplianceAreaMasterStore.orderBy = 'asc';
        ComplianceAreaMasterStore.orderItem = type;
      }
      else{
        if (ComplianceAreaMasterStore.orderItem == type) {
          if(ComplianceAreaMasterStore.orderBy == 'asc') ComplianceAreaMasterStore.orderBy = 'desc';
          else ComplianceAreaMasterStore.orderBy = 'asc'
        }
        else{
          ComplianceAreaMasterStore.orderBy = 'asc';
          ComplianceAreaMasterStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }
}





