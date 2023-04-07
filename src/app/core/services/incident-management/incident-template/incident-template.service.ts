import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentTemplates, IncidentTemplatesPaginationResponse } from 'src/app/core/models/incident-management/incident-template/incidet-template';
import { AuditTemplatesPaginationResponse } from 'src/app/core/models/internal-audit/audit-template/audit-template';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { IncidentTemplateStore } from 'src/app/stores/incident-management/template/incident-template-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class IncidentTemplateService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService) 
    { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable <IncidentTemplatesPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentTemplateStore.currentPage}`;
      if (IncidentTemplateStore.orderBy) params += `&order_by=incidents.title&order=${IncidentTemplateStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
     if(IncidentTemplateStore.searchText) params += (params ? '&q=' : '?q=')+IncidentTemplateStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_register' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<IncidentTemplatesPaginationResponse>('/incident-report-templates' + (params ? params : '')).pipe(
      map((res : IncidentTemplatesPaginationResponse) => {
        IncidentTemplateStore.setInvestigations(res);
        return res;
      })
    );
 
  }

  addTemplate(item:any){
    return this._http.post('/incident-report-templates', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'incident_template_main_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  updateItem(id:number, item: any): Observable<any> {
    return this._http.put('/incident-report-templates/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_template_update_main');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  getItem(id): Observable<IncidentTemplates> {
    return this._http.get<IncidentTemplates>('/incident-report-templates/'+id).pipe((
      map((res:IncidentTemplates)=>{
        IncidentTemplateStore.setIndividualIncidentTemplate(res);
        return res;
      })
    ))
  }

  delete(id: number) {
    return this._http.delete('/incident-report-templates/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_template_delete_main');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            IncidentTemplateStore.setCurrentPage(resp.current_page-1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/incident-report-templates/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_template_template') +".xlsx");
      }
    )
  }

  exportToExcel() {
    this._http.get('/incident-report-templates/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident_template') +".xlsx");
      }
    )
  }

  setDocumentDetails(imageDetails,url){
    IncidentTemplateStore.setDocumentDetails(imageDetails,url);
  }
  setConclusionDocumentDetails(imageDetails,url){
    IncidentTemplateStore.setConclusionDocumentDetails(imageDetails,url);
  }

  saveIncidentReportTemplates(templateId,pageId,data): Observable<any> {
    return this._http.put('/incident-report-templates/'+templateId+'/pages/'+pageId, data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'report_template_saved');
        this.getItems().subscribe();
        return res;
      })
    );
  }
}




