import { Injectable } from '@angular/core';
import { Findings ,FindingsPaginationResponse  } from 'src/app/core/models/external-audit/findings/findings';
import {FindingMasterStore} from 'src/app/stores/external-audit/findings/findings-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { param } from 'jquery';
@Injectable({
  providedIn: 'root'
})
export class FindingsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
    ) { }
    getItems(getAll: boolean = false,additionalParams?:string): Observable<FindingsPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${FindingMasterStore.currentPage}&status=all`;
        if (FindingMasterStore.orderBy) params += `&order_by=${FindingMasterStore.orderItem}&order=${FindingMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(FindingMasterStore.searchText) params += (params ? '&q=' : '?q=')+FindingMasterStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'ea_findings' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<FindingsPaginationResponse>('/external-audit/findings' + (params ? params : '')).pipe(
        map((res: FindingsPaginationResponse) => {
          FindingMasterStore.setFinding(res);
          return res;
        })
      );
   
    }

    getItem(id): Observable<Findings> {
      return this._http.get<Findings>('/external-audit/findings/'+id).pipe((
        map((res:Findings)=>{
          FindingMasterStore.setIndividualExternalAuditFindingItem(res);
          return res;
        })
      ))
    }

    saveAuditFindingId(id:number){
      FindingMasterStore.setAuditFindingId(id);}

    setDocumentDetails(imageDetails,url){
      FindingMasterStore.setDocumentDetails(imageDetails,url);
    }



    saveItem(item: any) {
      return this._http.post('/external-audit/findings', item).pipe(
        map((res:any )=> {
          FindingMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('Success!', 'external_findings_add');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/external-audit/findings/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'external_findings_update');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    addQuickCorrection(id:number,item :any){
      return this._http.post('/findings/'+id+'/corrections', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'external_findings_quick_corrections_added');
          return res;
        })
      );
    }

    updateQuickCorrection(findings_id:number,id:number,item :any){
      return this._http.put('/findings/'+findings_id+'/corrections/'+id, item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'external_findings_quick_corrections_updated');
          return res;
        })
      );
    }

    deleteQuickCorrection(findings_id:number,id:number){
      return this._http.delete('/findings/'+findings_id+'/corrections/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'external_findings_quick_corrections_deleted');
          return res;
        })
      );
    }


    delete(id: number, params?: string) {
      return this._http.delete('/external-audit/findings/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'external_findings_delete');
          if (params) {
            this.getItems(false, params).subscribe();
          }
          else {
            this.getItems().subscribe(resp=>{
              if(resp.from==null){
                FindingMasterStore.setCurrentPage(resp.current_page-1);
                this.getItems().subscribe();
              }
            });
          }
          return res;
        })
      );
    }

    generateTemplate() {
      this._http.get('/external-audit/findings/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('external_audit_finding_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      let params = '';
      if (FindingMasterStore.orderBy) params += `?order=${FindingMasterStore.orderBy}`;
      if (FindingMasterStore.orderItem) params += `&order_by=${FindingMasterStore.orderItem}`;
      if(RightSidebarLayoutStore.filterPageTag == 'ea_findings' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/external-audit/findings/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('external_audit_finding')+".xlsx");
        }
      )
    }

    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/external-audit/findings/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','external_findings_imported');
          this.getItems(false,null).subscribe();
          return res;
        })
      )
    }

    sortFindingslList(type:string, text:string) {
      if (!FindingMasterStore.orderBy) {
        FindingMasterStore.orderBy = 'asc';
        FindingMasterStore.orderItem = type;
      }
      else{
        if (FindingMasterStore.orderItem == type) {
          if(FindingMasterStore.orderBy == 'asc') FindingMasterStore.orderBy = 'desc';
          else FindingMasterStore.orderBy = 'asc'
        }
        else{
          FindingMasterStore.orderBy = 'asc';
          FindingMasterStore.orderItem = type;
        }
      }
    }
    
}

