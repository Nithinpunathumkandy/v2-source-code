import { EventEmitter, Injectable } from '@angular/core';
import { ExternalAuditCorrectiveActions, ExternalAuditCorrectiveActionsPaginationResponse } from 'src/app/core/models/external-audit/corrective-actions/corrective-actios';
import { caHistoryPaginationData, HistoryDocPreview } from 'src/app/core/models/external-audit/corrective-action/corrective-action';
import { ExternalAuditCorrectiveActionStore } from 'src/app/stores/external-audit/corrective-actions/corrective-actions-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class ExternalAuditCorrectiveActionsService {

  itemChange: EventEmitter<number> = new EventEmitter();

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getAllItems(additionalParams?: string): Observable<ExternalAuditCorrectiveActionsPaginationResponse> {
    let params = '';
    params = `?page=${ExternalAuditCorrectiveActionStore.currentPage}&status=all`;
    if (additionalParams) params += additionalParams;
    if (ExternalAuditCorrectiveActionStore.orderBy) params += `&order_by=${ExternalAuditCorrectiveActionStore.orderItem}&order=${ExternalAuditCorrectiveActionStore.orderBy}`;
    if (ExternalAuditCorrectiveActionStore.searchText) params += (params ? '&q=' : '?q=') + ExternalAuditCorrectiveActionStore.searchText;
    if (RightSidebarLayoutStore.filterPageTag == 'ea_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ExternalAuditCorrectiveActionsPaginationResponse>('/external-audit/corrective-actions' + (params ? params : '')).pipe(
      map((res: ExternalAuditCorrectiveActionsPaginationResponse) => {

        ExternalAuditCorrectiveActionStore.setAllCorrectiveAction(res);
        return res;
      })
    );
  }

  getFindingsCorrectiveActions(id, additionalParams?) {
    let params = '';
    params = `?page=${ExternalAuditCorrectiveActionStore.currentPage}&status=all`;
    if (additionalParams) params += additionalParams;
    return this._http.get<ExternalAuditCorrectiveActions[]>('/external-audit/findings/' + id + '/corrective-actions' + (params ? params : '')).pipe(
      map((res: ExternalAuditCorrectiveActions[]) => {
        ExternalAuditCorrectiveActionStore.setFindingCorrectiveActions(res);
        return res;
      })
    );
  }

  setDocumentDetails(imageDetails, url) {
    ExternalAuditCorrectiveActionStore.setDocumentDetails(imageDetails, url);
  }


  getItem(finding_id: number, id: number):
    Observable<ExternalAuditCorrectiveActions> {
    return this._http.get<ExternalAuditCorrectiveActions>('/external-audit/findings/' + finding_id + '/corrective-actions/' + id).pipe(
      map((res: ExternalAuditCorrectiveActions) => {
        ExternalAuditCorrectiveActionStore.setIndividualCorrectiveActionDetails(res);
        return res;
      })
    );

  }

  saveItem(findings_id: number, item: ExternalAuditCorrectiveActions) {

    return this._http.post('/external-audit/findings/' + findings_id + '/corrective-actions', item).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('Success!', 'ea_ca_add_success_msg');
        return res;
      })
    );
  }

  UpdateItem(findings_id: number, id: number, item: ExternalAuditCorrectiveActions) {

    return this._http.put('/external-audit/findings/' + findings_id + '/corrective-actions/' + id, item).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('Success!', 'ea_ca_update_success_msg');
        return res;
      })
    );
  }


  generateTemplate(id?: number) {
    let url = '/external-audit/findings/corrective-actions/template';
    if (id) url = '/external-audit/findings/' + id + '/corrective-actions/template'

    this._http.get(url, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('corrective_action_template')+".xlsx");
      }
    )
  }

  exportToExcel(id?: number) {
    let params = '';
    if (ExternalAuditCorrectiveActionStore.orderBy) params += `?order=${ExternalAuditCorrectiveActionStore.orderBy}`;
    if (ExternalAuditCorrectiveActionStore.orderItem) params += `&order_by=${ExternalAuditCorrectiveActionStore.orderItem}`;
    if(RightSidebarLayoutStore.filterPageTag == 'ea_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    let url = '/external-audit/corrective-actions/export'+params;
    if (id) '/external-audit/findings/' + id + '/corrective-actions/export'
    this._http.get(url, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('corrective_action')+".xlsx");
      }
    )
  }

  deleteItem(finding_id: number, id: number,audit?) {
    return this._http.delete('/external-audit/findings/' + finding_id + '/corrective-actions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'ia_ca_delete_success_msg');
        if(!audit)
        {
          this.getAllItems().subscribe(resp => {
            if (resp.from == null) {
              ExternalAuditCorrectiveActionStore.setCurrentPage(resp.current_page - 1);
              this.getAllItems().subscribe();
            }
          });
        }
       
        return res;
      })
    );
  }
  importData(data, id?: number) {
    let url = '/external-audit/findings/corrective-actions/import';
    if (id) url = '/external-audit/findings/' + id + '/corrective-actions/import'
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post(url, data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'corrective_action_imported');
        this.getAllItems(null).subscribe();
        return res;
      })
    )
  }

  shareData(data) {
    return this._http.post('/external-audit/corrective-actions/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }


  sortCaList(type: string, text: string) {
    if (!ExternalAuditCorrectiveActionStore.orderBy) {
      ExternalAuditCorrectiveActionStore.orderBy = 'asc';
      ExternalAuditCorrectiveActionStore.orderItem = type;
    }
    else {
      if (ExternalAuditCorrectiveActionStore.orderItem == type) {
        if (ExternalAuditCorrectiveActionStore.orderBy == 'asc') ExternalAuditCorrectiveActionStore.orderBy = 'desc';
        else ExternalAuditCorrectiveActionStore.orderBy = 'asc'
      }
      else {
        ExternalAuditCorrectiveActionStore.orderBy = 'asc';
        ExternalAuditCorrectiveActionStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }

  setSelected(position?: number, process: boolean = false, reload = false) {
    if (process) {
      var items: ExternalAuditCorrectiveActions[] = ExternalAuditCorrectiveActionStore.allItems;
      if (position >= 0) {
        if (items.length > 0) {
          if (position == 0) {
            if (reload)
              this.itemChange.emit(items[0].id);
            ExternalAuditCorrectiveActionStore.setSelected(items[0].id)
          }
          else {
            if (items.length >= 1) {
              if (reload)
                this.itemChange.emit(items[position - 1].id);
              ExternalAuditCorrectiveActionStore.setSelected(items[position - 1].id);
            }
          }
        }
      }
      else {
        if (items.length > 0) {
          if (reload)
            this.itemChange.emit(items[0].id);
          ExternalAuditCorrectiveActionStore.setSelected(items[0].id);
        }
      }
    }
    else {
      if (position) {
        if (reload)
          this.itemChange.emit(position);
        ExternalAuditCorrectiveActionStore.setSelected(position)
      }
      else {
        if (reload)
          this.itemChange.emit(ExternalAuditCorrectiveActionStore.initialItemId);
        ExternalAuditCorrectiveActionStore.setSelected(ExternalAuditCorrectiveActionStore.initialItemId);
      }
    }
  }

  getCaHistory(ca_id: number): Observable<caHistoryPaginationData> {
    return this._http.get<caHistoryPaginationData>('/external-audit/finding-corrective-actions/' + ca_id + '/updates'
    ).pipe(
      map((res: caHistoryPaginationData) => {
        ExternalAuditCorrectiveActionStore.setCorrectiveActionHistory(res);
        return res;
      })
    );
  }

  closeCorrectiveAction(finding_id: number, ca_id: number, item: any) {
    return this._http.put('/findings/' + finding_id + '/corrective-actions/' + ca_id + '/close', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'ca_close_message');
        return res;
      })
    );
  }

  getDocuments() {
    return ExternalAuditCorrectiveActionStore.getDocumentDetails;
  }

  setImageDetails(imageDetails, url, type) {
    ExternalAuditCorrectiveActionStore.setDocumentImageDetails(imageDetails, url, type);
  }

  setSelectedImageDetails(imageDetails, type) {
    ExternalAuditCorrectiveActionStore.setSelectedImageDetails(imageDetails);
  }

}


