import { Injectable, EventEmitter } from '@angular/core';
import { caHistoryPaginationData, CorrectiveAction, CorrectiveActionPaginationResponse } from 'src/app/core/models/external-audit/corrective-action/corrective-action';
import { CorrectiveActionMasterStore } from 'src/app/stores/external-audit/corrective-action/corrective-action-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CorrectiveActionsResolveStore } from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-resolve-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class CorrectiveActionService {
  itemChange: EventEmitter<number> = new EventEmitter();

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }




  getAllItems(id: number, additionalParams?: string): Observable<CorrectiveAction[]> {
    let params = '';
    params = `?page=${CorrectiveActionMasterStore.currentPage}&status=all`;
    if (additionalParams) params += additionalParams;


    return this._http.get<CorrectiveAction[]>('/external-audit/findings/' + id + '/corrective-actions' + (params ? params : '')).pipe(
      map((res: CorrectiveAction[]) => {

        CorrectiveActionMasterStore.setAllCorrectiveActions(res);
        return res;
      })
    );
  }

  getItem(finding_id: number, id: number):
    Observable<CorrectiveAction> {
    return this._http.get<CorrectiveAction>('/external-audit/findings/' + finding_id + '/corrective-actions/' + id).pipe(
      map((res: CorrectiveAction) => {
        CorrectiveActionMasterStore.setIndividualCADetails(res);
        return res;
      })
    );

  }

  setResolveDocumentDetails(imageDetails, url) {
    CorrectiveActionsResolveStore.setDocumentDetails(imageDetails, url);
  }

  markAsResolved(ca_id: number, item: any) {

    return this._http.post('/finding-corrective-actions/' + ca_id + '/updates', item).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('success', 'ca_marked_resolved');
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


  setSelected(position?: number, process: boolean = false, reload = false) {
    if (process) {
      var items: CorrectiveAction[] = CorrectiveActionMasterStore.allItems;
      if (position >= 0) {
        if (items.length > 0) {
          if (position == 0) {
            if (reload)
              this.itemChange.emit(items[0].id);
            CorrectiveActionMasterStore.setSelected(items[0].id)
          }
          else {
            if (items.length >= 1) {
              if (reload)
                this.itemChange.emit(items[position - 1].id);
              CorrectiveActionMasterStore.setSelected(items[position - 1].id);
            }
          }
        }
      }
      else {
        if (items.length > 0) {
          if (reload)
            this.itemChange.emit(items[0].id);
          CorrectiveActionMasterStore.setSelected(items[0].id);
        }
      }
    }
    else {
      if (position) {
        if (reload)
          this.itemChange.emit(position);
        CorrectiveActionMasterStore.setSelected(position)
      }
      else {
        if (reload)
          this.itemChange.emit(CorrectiveActionMasterStore.initialItemId);
        CorrectiveActionMasterStore.setSelected(CorrectiveActionMasterStore.initialItemId);
      }
    }
  }

  unsetSelectedItemDetails() {
    CorrectiveActionMasterStore.unsetSelectedItemDetails();
  }


  setDocumentDetails(imageDetails, url) {
    CorrectiveActionMasterStore.setDocumentDetails(imageDetails, url);
  }

  getCaHistory(ca_id: number): Observable<caHistoryPaginationData> {
    return this._http.get<caHistoryPaginationData>('/external-audit/finding-corrective-actions/' + ca_id + '/updates'
    ).pipe(
      map((res: caHistoryPaginationData) => {
        CorrectiveActionMasterStore.setCorrectiveActionHistory(res);
        return res;
      })
    );
  }


  updateCorrectiveAction(ca_id: number, item: any) {

    return this._http.post('/noc-finding-corrective-actions/' + ca_id + '/updates', item).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('success', 'ea_ca_status_update_success_msg');
        return res;
      })
    );
  }

  getDocuments() {
    return CorrectiveActionMasterStore.getDocumentDetails;
  }



  setImageDetails(imageDetails, url, type) {
    CorrectiveActionMasterStore.setDocumentImageDetails(imageDetails, url, type);
  }

  setSelectedImageDetails(imageDetails, type) {
    CorrectiveActionMasterStore.setSelectedImageDetails(imageDetails);
  }

  saveItem(findng_id: number, item: CorrectiveAction) {
    return this._http.post('/external-audit/findings/' + findng_id + '/corrective-actions', item).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('Success!', 'ea_ca_add_success_msg');
        return res;
      })
    );
  }

  updateItem(findng_id: number, id: number, item: CorrectiveAction) {
    return this._http.put('/external-audit/findings/' + findng_id + '/corrective-actions/' + id, item).pipe(
      map((res: any) => {

        this._utilityService.showSuccessMessage('Success!', 'ea_ca_update_success_msg');
        return res;
      })
    );
  }

  deleteItem(finding_id: number, id: number) {
    return this._http.delete('/findings/' + finding_id + '/corrective-actions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'ia_ca_delete_success_msg');
        return res;
      })
    );
  }
  generateTemplate(findng_id: number) {
    this._http.get('/external-audit/findings/' + findng_id + '/corrective-actions/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('corrective_action_template')+".xlsx");
      }
    )
  }

  exportToExcel(findng_id: number) {
    this._http.get('/external-audit/findings/' + findng_id + '/corrective-actions/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('corrective_action')+".xlsx");
      }
    )
  }
}


