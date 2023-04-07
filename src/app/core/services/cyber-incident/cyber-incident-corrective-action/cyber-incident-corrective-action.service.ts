import { HttpClient } from '@angular/common/http';
import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { caHistoryPaginationData, CyberIncidentCorrectiveAction, CyberIncidentCorrectiveActionPaginationResponse } from 'src/app/core/models/cyber-incident/cyber-incident-corrective-action';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CyberIncidentCorrectiveActionStore } from 'src/app/stores/cyber-incident/cyber-incident-corrective-action-store';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CyberIncidentCorrectiveActionService {

  itemChange: EventEmitter<number> = new EventEmitter();
  
  RightSidebarLayoutStore=RightSidebarLayoutStore
  constructor(private _http: HttpClient,
	private _helperService: HelperServiceService,
    private _utilityService: UtilityService,) { }

    getAllItems(additionalParams?: string): Observable<CyberIncidentCorrectiveActionPaginationResponse> {
      let params = '';
      params = `?page=${CyberIncidentCorrectiveActionStore.currentPage}&status=all`;
      if (additionalParams) params += additionalParams;
      if (CyberIncidentCorrectiveActionStore.orderBy) params += `&order_by=${CyberIncidentCorrectiveActionStore.orderItem}&order=${CyberIncidentCorrectiveActionStore.orderBy}`;
      if (CyberIncidentCorrectiveActionStore.searchText) params += (params ? '&q=' : '?q=') + CyberIncidentCorrectiveActionStore.searchText;
      if (RightSidebarLayoutStore.filterPageTag == 'ci_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<CyberIncidentCorrectiveActionPaginationResponse>('/cyber-incident/cyber-incident-corrective-actions' + (params ? params : '')).pipe(
        map((res: CyberIncidentCorrectiveActionPaginationResponse) => {
  
          CyberIncidentCorrectiveActionStore.setCICorrectiveActions(res);
          return res;
        })
      );
    }

    getCICorrectiveActions(additionalParams?) {
      let params = '';
      // params = `?page=${CyberIncidentCorrectiveActionStore.currentPage}&status=all`;
      if (additionalParams) params += additionalParams;
      return this._http.get<CyberIncidentCorrectiveActionPaginationResponse>('/cyber-incident/cyber-incident-corrective-actions' + (params ? params : '')).pipe(
        map((res: CyberIncidentCorrectiveActionPaginationResponse) => {
          CyberIncidentCorrectiveActionStore.setIncidentCorrectiveActions(res.data);
          return res;
        })
      );
    }

    getItem(id: number):
    Observable<CyberIncidentCorrectiveAction> {
    return this._http.get<CyberIncidentCorrectiveAction>('/cyber-incident/cyber-incident-corrective-actions/'+id).pipe(
      map((res: CyberIncidentCorrectiveAction) => {
        CyberIncidentCorrectiveActionStore.setIndividualCorrectiveActionDetails(res);
        return res;
      })
    );

  }

  saveItem(item){
    return this._http.post('/cyber-incident/cyber-incident-corrective-actions', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Corrective Action added');
        this.getAllItems("&cyber_incident_id="+CyberIncidentStore.incidentId).subscribe();
        return res;
      })
    );
  }
  
  UpdateItem(id,item){
    return this._http.put('/cyber-incident/cyber-incident-corrective-actions/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Corrective Action updated');
        this.getAllItems("&cyber_incident_id="+CyberIncidentStore.incidentId).subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  delete(id?){
    return this._http.delete('/cyber-incident/cyber-incident-corrective-actions/'+id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'Corrective Action deleted sucessfully');
        this.getAllItems("&cyber_incident_id="+CyberIncidentStore.incidentId).subscribe();
        return res;
      })
    );
  }

  setSelected(position?: number, process: boolean = false, reload = false) {
    if (process) {
      var items: CyberIncidentCorrectiveAction[] = CyberIncidentCorrectiveActionStore.allItems;
      if (position >= 0) {
        if (items.length > 0) {
          if (position == 0) {
            if (reload)
              this.itemChange.emit(items[0].id);
              CyberIncidentCorrectiveActionStore.setSelected(items[0].id)
          }
          else {
            if (items.length >= 1) {
              if (reload)
                this.itemChange.emit(items[position - 1].id);
                CyberIncidentCorrectiveActionStore.setSelected(items[position - 1].id);
            }
          }
        }
      }
      else {
        if (items.length > 0) {
          if (reload)
            this.itemChange.emit(items[0].id);
            CyberIncidentCorrectiveActionStore.setSelected(items[0].id);
        }
      }
    }
    else {
      if (position) {
        if (reload)
          this.itemChange.emit(position);
          CyberIncidentCorrectiveActionStore.setSelected(position)
      }
      else {
        if (reload)
          this.itemChange.emit(CyberIncidentCorrectiveActionStore.initialItemId);
          CyberIncidentCorrectiveActionStore.setSelected(CyberIncidentCorrectiveActionStore.initialItemId);
      }
    }
  }

  getCaHistory(ca_id: number): Observable<caHistoryPaginationData> {
    return this._http.get<caHistoryPaginationData>('/cyber-incident/cyber-incident-corrective-actions/' + ca_id + '/updates'
    ).pipe(
      map((res: caHistoryPaginationData) => {
        CyberIncidentCorrectiveActionStore.setCorrectiveActionHistory(res);
        return res;
      })
    );
  }

  getDocuments() {
    return CyberIncidentCorrectiveActionStore.getDocumentDetails;
  }

  updateCorrectiveAction(ca_id: number, item: any) {

    return this._http.post('/cyber-incident/cyber-incident-corrective-actions/' + ca_id + '/updates', item).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('success', 'cyber_incident_ca_status_update_success_msg');
        return res;
      })
    );
  }

  setImageDetails(imageDetails, url, type) {
    CyberIncidentCorrectiveActionStore.setDocumentImageDetails(imageDetails, url, type);
  }

  setSelectedImageDetails(imageDetails, type) {
    CyberIncidentCorrectiveActionStore.setSelectedImageDetails(imageDetails);
  }

  generateTemplate(id?: number) {
    let url = '/cyber-incident/cyber-incident-corrective-actions/template';
   // if (id) url = '/external-audit/findings/' + id + '/corrective-actions/template'

    this._http.get(url, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('corrective_action_template')+".xlsx");
      }
    )
  }

  exportToExcel(id?: number) {
    let params = '';
    if (CyberIncidentCorrectiveActionStore.orderBy) params += `?order=${CyberIncidentCorrectiveActionStore.orderBy}`;
    if (CyberIncidentCorrectiveActionStore.orderItem) params += `&order_by=${CyberIncidentCorrectiveActionStore.orderItem}`;
    // if(RightSidebarLayoutStore.filterPageTag == 'audit_mangement_ms_audit_ca' && RightSidebarLayoutStore.filtersAsQueryString)
    // params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    let url = '/cyber-incident/cyber-incident-corrective-actions/export'+params;
    // if (id) {url='/cyber-incident/cyber-incident-corrective-actions/export'}
    this._http.get(url, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('corrective_action')+".xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('/cyber-incident/cyber-incident-corrective-actions/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data) {
    let url = '/cyber-incident/cyber-incident-corrective-actions/import';
    // if (id) url = '/ms-audit-findings/'+ id + '/corrective-actions/import'
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post(url, data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'corrective_action_imported');
        this.getCICorrectiveActions().subscribe();
        return res;
      })
    )
  }

  sortList(type:string, text:string) {
    if (!CyberIncidentStore.orderBy) {
      CyberIncidentStore.orderBy = 'desc';
      CyberIncidentStore.orderItem = type;
    }
    else{
      if (CyberIncidentStore.orderItem == type) {
        if(CyberIncidentStore.orderBy == 'desc') CyberIncidentStore.orderBy = 'asc';
        else CyberIncidentStore.orderBy = 'desc'
      }
      else{
        CyberIncidentStore.orderBy = 'desc';
        CyberIncidentStore.orderItem = type;
      }
    }
  }
}
