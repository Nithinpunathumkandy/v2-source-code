import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditNonConfirmityResponse,AuditNonConfirmity } from 'src/app/core/models/ms-audit-management/ms-audit/ms-audit-details/audit-non-confirmity';
import { environment } from 'src/environments/environment';
import { MsAuditPlansStore } from 'src/app/stores/ms-audit-management/ms-audit-plans/ms-audit-plans-store';



@Injectable({
  providedIn: 'root'
})
export class AuditNonConfirmityService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,) { }

    getItems(getAll: boolean = false,additionalParams?: string, status: boolean = false): Observable<AuditNonConfirmityResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditNonConfirmityStore.currentPage}`;
        if (AuditNonConfirmityStore.orderBy) params += `&order_by=${AuditNonConfirmityStore.orderItem}&order=${AuditNonConfirmityStore.orderBy}`;
      }
      if (AuditNonConfirmityStore.searchText) params += (params ? '&q=' : '?q=') + AuditNonConfirmityStore.searchText;
      if (additionalParams) params += additionalParams;
      if (status) params += (params ? '&' : '?') + 'status=all';
      return this._http.get<AuditNonConfirmityResponse>('/ms-audit-findings' + (params ? params : '')).pipe(
        map((res: AuditNonConfirmityResponse) => {
          AuditNonConfirmityStore.setMsAuditNonConfirmity(res);
          return res;
        })
      );
    }
  
    saveNonConfirmity(item) {
      return this._http.post('/ms-audit-findings', item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'non_conformity_added');
          return res;
        })
      );
    }
  
    updateNonConfirmity(item,id) {
      return this._http.put('/ms-audit-findings/'+id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'non_conformity_updated');
          return res;
        })
      );
    }
  
    deleteNonConfirmity(id) {
      return this._http.delete('/ms-audit-findings/'+id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'non_conformity_deleted');
          return res;
        })
      );
    }

    getIndividualCheckList(id){
      return this._http.get<AuditNonConfirmity>('/ms-audit-findings/'+id ).pipe(
        map((res: AuditNonConfirmity) => {
          AuditNonConfirmityStore.setIndividualMsAuditNonConfirmityDetails(res)
          return res;
        })
      );
    }

    updateQuickCorrectionMsAudit(item,id) {
      return this._http.put('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrections/'+id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'correction_updated');
          return res;
        })
      );
    }

    addQuickCorrectionMsAudit(item,id) {
      return this._http.post('/ms-audit-findings/'+id+'/corrections', item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'correction_added');
          return res;
        })
      );
    }

    deleteQuickCorrection(id) {
      return this._http.delete('/ms-audit-findings/'+AuditNonConfirmityStore.msAuditNonConfirmityId+'/corrections/'+id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'quick_correction_deleted');
          return res;
        })
      );
    }

    getThumbnailPreview(type,token,h?:number,w?:number){
      // +(h && w)?'&h='+h+'&w='+w:''
      switch(type){
        case 'non-conformity': return environment.apiBasePath+ '/ms-audit-management/files/ms-audit-finding/thumbnail?token='+token;
        break;
        case 'document-version': return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
        break;
    
      }
      }

      sortList(type:string, text:string) {
        if (!AuditNonConfirmityStore.orderBy) {
          AuditNonConfirmityStore.orderBy = 'desc';
          AuditNonConfirmityStore.orderItem = type;
        }
        else{
          if (AuditNonConfirmityStore.orderItem == type) {
            if(AuditNonConfirmityStore.orderBy == 'desc') AuditNonConfirmityStore.orderBy = 'asc';
            else AuditNonConfirmityStore.orderBy = 'desc'
          }
          else{
            AuditNonConfirmityStore.orderBy = 'desc';
            AuditNonConfirmityStore.orderItem = type;
          }
        }
      }
}
