import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuditCheckListAnswerKeyMasterStore } from 'src/app/stores/masters/internal-audit/audit-checklist-answer-key-store';
import { AuditCheckListAnswerKeyPaginationResponse } from 'src/app/core/models/masters/internal-audit/audit-checklist-answer-key';

@Injectable({
  providedIn: 'root'
})
export class AuditChecklistAnswerKeyService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false, additionalParams?: string, is_all:boolean = false): Observable<AuditCheckListAnswerKeyPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditCheckListAnswerKeyMasterStore.currentPage}`;
        if (AuditCheckListAnswerKeyMasterStore.orderBy) params += `&order_by=${AuditCheckListAnswerKeyMasterStore.orderItem}&order=${AuditCheckListAnswerKeyMasterStore.orderBy}`;
  
      }
      if (additionalParams) params += additionalParams;
      if(is_all) params += '&status=all';
      if(AuditCheckListAnswerKeyMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditCheckListAnswerKeyMasterStore.searchText;
      return this._http.get<AuditCheckListAnswerKeyPaginationResponse>('/audit-checklist-answer-keys' + (params ? params : '')).pipe(
        map((res: AuditCheckListAnswerKeyPaginationResponse) => {
  
          AuditCheckListAnswerKeyMasterStore.setAuditCheckListAnswerKey(res);
          return res;}
        ))
    }

    getAllItems() {
      return this._http.get('/audit-checklist-answer-keys').pipe((
       map((res) => {
        return res;
       }) 
      ))
    }

    sortAuditCheckList(type:string) {
      if (!AuditCheckListAnswerKeyMasterStore.orderBy) {
        AuditCheckListAnswerKeyMasterStore.orderBy = 'asc';
        AuditCheckListAnswerKeyMasterStore.orderItem = type;
      }
      else{
        if (AuditCheckListAnswerKeyMasterStore.orderItem == type) {
          if(AuditCheckListAnswerKeyMasterStore.orderBy == 'asc') AuditCheckListAnswerKeyMasterStore.orderBy = 'desc';
          else AuditCheckListAnswerKeyMasterStore.orderBy = 'asc'
        }
        else{
          AuditCheckListAnswerKeyMasterStore.orderBy = 'asc';
          AuditCheckListAnswerKeyMasterStore.orderItem = type;
        }
      }
    }
}
