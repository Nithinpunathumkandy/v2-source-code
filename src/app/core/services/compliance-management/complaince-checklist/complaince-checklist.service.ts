import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { ComplainceChecklistStore } from 'src/app/stores/compliance-management/complaince-checklist/complaince-checklist-store';
import { Checklist, ChecklistPaginationResponse, IndividualChecklist
} from "src/app/core/models/compliance-management/complaince-checklist/complaince-checklist-model";



@Injectable({
  providedIn: 'root'
})
export class ComplainceChecklistService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,

    private _helperService: HelperServiceService) { }

  getAllItems(getAll: boolean = false, additionalParams?: string): Observable<ChecklistPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplainceChecklistStore.currentPage}`;
      if (ComplainceChecklistStore.orderBy) params += `&order=${ComplainceChecklistStore.orderBy}`;
      if (ComplainceChecklistStore.orderItem) params += `&order_by=${ComplainceChecklistStore.orderItem}`;
      if (ComplainceChecklistStore.searchText) params += `&q=${ComplainceChecklistStore.searchText}`;
    }
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'complaince_checklist' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ChecklistPaginationResponse>('/sla-and-contract-checklists' + (params ? params : '')).pipe(
      map((res: ChecklistPaginationResponse) => {
        ComplainceChecklistStore.setAllComplainceChecklist(res);
        return res;
      })
    );
  }

  updateItem(id:number, item): Observable<any> {
    return this._http.put('/sla-and-contract-checklists/'+ id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','checklist_updated');
        this.getAllItems(false,'status=all').subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  saveItem(item): Observable<any> {
    return this._http.post('/sla-and-contract-checklists', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','checklist_added');
        this.getAllItems(false,'status=all').subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    let params='';
    if(RightSidebarLayoutStore.filterPageTag == 'complaince_checklist' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/sla-and-contract-checklists/export'+(params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('checklist')+".xlsx");     
      }
    )
  }

  getItem(id: number):
    Observable<IndividualChecklist> {
    return this._http.get<IndividualChecklist>('/sla-and-contract-checklists/' + id).pipe(
      map((res: IndividualChecklist) => {
        ComplainceChecklistStore.setChecklistDetails(res);
        return res;
      })
    );

  }

  delete(id: number,BAId?) {
    return this._http.delete('/sla-and-contract-checklists/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','checklist_deleted');
            this.getAllItems(false).subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/sla-and-contract-checklists/'+id+'/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','checklist_activated');
       // this.getItems(false,'status=all').subscribe();
        //this.getItem(id).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/sla-and-contract-checklists/'+id+'/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','checklist_deactivated');
        //this.getItems(false,'status=all').subscribe();
        //this.getItem(id).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    let url = '/sla-and-contract-checklists/template';
    this._http.get(url, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('checklist_template')+".xlsx");
      }
    )
  }

  importData(data) {
    let url = '/sla-and-contract-checklists/import';
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post(url, data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'checklist_imported');
        this.getAllItems(null).subscribe();
        return res;
      })
    )
  }

  shareData(data) {
    return this._http.post('/sla-and-contract-checklists/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }
}
