import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AmFindingIAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-ia.store';
import { ImpactAnalysisPaginationResponse,ImpactAnalysis } from 'src/app/core/models/risk-management/risks/impact-analysis';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditFindingIaService {
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService
  ) { }
  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<ImpactAnalysisPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${AmFindingIAStore.currentPage}`;
      if (AmFindingIAStore.orderBy) params += `&order_by=impact_analysis.title&order=${AmFindingIAStore.orderBy}`;
    }
    if (AmFindingIAStore.searchText) params += (params ? '&q=' : '?q=') + AmFindingIAStore.searchText;
    if (additionalParams)
      params = params ? (params + '&' + additionalParams) : (params + '?' + additionalParams);
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<ImpactAnalysisPaginationResponse>('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses' + (params ? params : '')).pipe(
      map((res: ImpactAnalysisPaginationResponse) => {
        AmFindingIAStore.setImpactAnalysis(res);
        return res;
      })
    );
  }

  getAllItems(): Observable<ImpactAnalysis> {
    let params = '';
    if (AmFindingIAStore.searchText) params += (params ? '&q=' : '?q=') + AmFindingIAStore.searchText;
    return this._http.get<ImpactAnalysis>('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses' + (params ? params : '')).pipe((
      map((res: ImpactAnalysis) => {
        AmFindingIAStore.setAllImpactAnalysis(res);
        return res;
      })
    ))
  }

  getItem(id): Observable<ImpactAnalysis> {
    return this._http.get<ImpactAnalysis>('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/' + id).pipe((
      map((res: ImpactAnalysis) => {
        AmFindingIAStore.setIndividualImpactAnalysis(res);
        return res;
      })
    ))
  }

  saveItem(item) {
    return this._http.post('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses', item).pipe(
      map((res: any) => {
        AmFindingIAStore.setLastInsertedId(res.id);
        this._utilityService.showSuccessMessage('success', 'impact_analysis_added');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id, item): Observable<any> {
    return this._http.put('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_updated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_deleted');
        this.getAllItems().subscribe(resp => {
          });
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_activated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_deactivated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    this._http.get('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_analysis') + ".xlsx");
      }
    )
  }

  generateTemplate() {
    this._http.get('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('impact_analysis_template') + ".xlsx");
      }
    )
  }
  shareData(data) {
    return this._http.post('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  importData(data) {
    const formData = new FormData();
    formData.append('file', data);
    return this._http.post('/am-audit-findings/' + AmAuditFindingStore.auditFindingId + '/impact-analyses/import', formData).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'impact_analysis_imported');
        return res;
      })
    )
  }

  sortImpactAnalysisList(type: string) {
    if (!AmFindingIAStore.orderBy) {
      AmFindingIAStore.orderBy = 'desc';
      AmFindingIAStore.orderItem = type;
    }
    else {
      if (AmFindingIAStore.orderItem == type) {
        if (AmFindingIAStore.orderBy == 'desc') AmFindingIAStore.orderBy = 'asc';
        else AmFindingIAStore.orderBy = 'desc'
      }
      else {
        AmFindingIAStore.orderBy = 'desc';
        AmFindingIAStore.orderItem = type;
      }
    }
  }
}
