import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AuditTemplateAudit, AuditTemplateAuditProgram, AuditTemplateConclusion, AuditTemplateCoverPage, AuditTemplateExecutiveSummary, AuditTemplateFindings, AuditTemplateIntroduction, AuditTemplates,AuditTemplateSchedule,AuditTemplatesPaginationResponse} from 'src/app/core/models/internal-audit/audit-template/audit-template';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {AuditTemplateStore} from 'src/app/stores/internal-audit/audit-template/audit-template-store'
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuditTemplateService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService) { }

    saveAuditTemplateConclusion(id,item: any) {
      return this._http.put('/audit-report-templates/'+id+'/conclusion', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_conclusion_added');
          this.getAuditTemplateConslusion(id).subscribe();
          return res;
        })
      );
    }

    getAuditTemplateConslusion(id): Observable<AuditTemplateConclusion> {
      return this._http.get<AuditTemplateConclusion>('/audit-report-templates/'+id+'/conclusion').pipe((
        map((res:AuditTemplateConclusion)=>{
          AuditTemplateStore.setAuditTemplateConclusion(res);
          return res;
        })
      ))
    }

    saveAuditExectiveSummary(id,item: any) {
      return this._http.put('/audit-report-templates/'+id+'/executive-summary', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_summary_added');
          this.getAuditTemplateFindingsExecutiveSummary(id).subscribe();
          return res;
        })
      );
    }

    getAuditTemplateFindingsExecutiveSummary(id): Observable<AuditTemplateExecutiveSummary> {
      return this._http.get<AuditTemplateExecutiveSummary>('/audit-report-templates/'+id+'/executive-summary').pipe((
        map((res:AuditTemplateExecutiveSummary)=>{
          AuditTemplateStore.setAuditTemplateExecutiveSummary(res);
          return res;
        })
      ))
    }

    saveAuditFindings(id,item: any) {
      return this._http.put('/audit-report-templates/'+id+'/finding', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_findings_added');
          this.getAuditTemplateFindings(id).subscribe();
          return res;
        })
      );
    }

    getAuditTemplateFindings(id): Observable<AuditTemplateFindings> {
      return this._http.get<AuditTemplateFindings>('/audit-report-templates/'+id+'/finding').pipe((
        map((res:AuditTemplateFindings)=>{
          AuditTemplateStore.setAuditTemplateFindings(res);
          return res;
        })
      ))
    }

    saveAuditSchedule(id,item: any) {
      return this._http.put('/audit-report-templates/'+id+'/audit-schedule', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_audit_schedule_added');
          this.getAuditTemplateSchedule(id).subscribe();
          return res;
        })
      );
    }

    getAuditTemplateSchedule(id): Observable<AuditTemplateSchedule> {
      return this._http.get<AuditTemplateSchedule>('/audit-report-templates/'+id+'/audit-schedule').pipe((
        map((res:AuditTemplateSchedule)=>{
          AuditTemplateStore.setAuditTemplateSchedule(res);
          return res;
        })
      ))
    }

    setConclusionDocumentDetails(imageDetails,url){
      AuditTemplateStore.setConclusionDocumentDetails(imageDetails,url,'logo');
    }

    setLogoDocumentDetails(imageDetails,url){
      AuditTemplateStore.setLogoDocumentDetails(imageDetails,url,'logo');
    }

    setDocumentDetails(imageDetails,url){
      AuditTemplateStore.setDocumentDetails(imageDetails,url,'logo');
    }

    saveAuditDetails(id,item: any) {
      return this._http.put('/audit-report-templates/'+id+'/audit', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_audit_updated');
          this.getTemplateAuditDetails(id).subscribe();
          return res;
        })
      );
    }

    getTemplateAuditDetails(id): Observable<AuditTemplateAudit> {
      return this._http.get<AuditTemplateAudit>('/audit-report-templates/'+id+'/audit').pipe((
        map((res:AuditTemplateAudit)=>{
          AuditTemplateStore.setAuditTemplateAudit(res);
          return res;
        })
      ))
    }

    saveAuditProgram(id,item: any) {
      return this._http.put('/audit-report-templates/'+id+'/audit-program', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_program_updated');
          this.getTemplateAuditProgram(id).subscribe();
          return res;
        })
      );
    }

    getTemplateAuditProgram(id): Observable<AuditTemplateAuditProgram> {
      return this._http.get<AuditTemplateAuditProgram>('/audit-report-templates/'+id+'/audit-program').pipe((
        map((res:AuditTemplateAuditProgram)=>{
          AuditTemplateStore.setAuditTemplateAuditProgram(res);
          return res;
        })
      ))
    }

    saveIntroductionDetails(id,item: any) {
      return this._http.put('/audit-report-templates/'+id+'/introduction', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_introduction_update');
          this.getIntroduction(id).subscribe();
          return res;
        })
      );
    }

    getIntroduction(id): Observable<AuditTemplateIntroduction> {
      return this._http.get<AuditTemplateIntroduction>('/audit-report-templates/'+id+'/introduction').pipe((
        map((res:AuditTemplateIntroduction)=>{
          AuditTemplateStore.setAuditTemplateIntroduction(res);
          return res;
        })
      ))
    }

    getCoverPageDetails(id): Observable<AuditTemplateCoverPage> {
      return this._http.get<AuditTemplateCoverPage>('/audit-report-templates/'+id+'/cover-page').pipe((
        map((res:AuditTemplateCoverPage)=>{
          AuditTemplateStore.setAuditTemplateCoverPage(res);
          return res;
        })
      ))
    }

    saveCoverPageDetails(id,item: any) {
      return this._http.put('/audit-report-templates/'+id+'/cover-page', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_cover_page_updated');
          this.getCoverPageDetails(id).subscribe();
          return res;
        })
      );
    }

    getItem(id): Observable<AuditTemplates> {
      return this._http.get<AuditTemplates>('/audit-report-templates/'+id).pipe((
        map((res:AuditTemplates)=>{
          AuditTemplateStore.setIndividualAuditTemplate(res);
          return res;
        })
      ))
    }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<AuditTemplatesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditTemplateStore.currentPage}&status=all`;
        if (AuditTemplateStore.orderBy) params += `&order_by=${AuditTemplateStore.orderItem}&order=${AuditTemplateStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditTemplateStore.searchText) params += (params ? '&q=' : '?q=')+AuditTemplateStore.searchText;

      return this._http.get<AuditTemplatesPaginationResponse>('/audit-report-templates' + (params ? params : '')).pipe(
        map((res: AuditTemplatesPaginationResponse) => {
          AuditTemplateStore.setAuditTemplate(res);
          return res;
        })
      );
    }

    getAllItems(): Observable<AuditTemplates[]>{
      return this._http.get<AuditTemplates[]>('/audit-report-templates?is_all=true').pipe(
        map((res: AuditTemplates[]) => {
          
          AuditTemplateStore.setAllAuditTemplate(res);
          return res;
        })
      );
    }

    generateTemplate() {
      this._http.get('/audit-report-templates/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_templates_template')+".xlsx");     

        }
      )
    }
  
    exportToExcel() {
      this._http.get('/audit-report-templates/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_templates')+".xlsx");     

        }
      )
    }

    saveItem(item: any) {
      return this._http.post('/audit-report-templates', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'template_main_added');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/audit-report-templates/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'template_update_main');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/audit-report-templates/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'template_delete_main');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              AuditTemplateStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });

          return res;
        })
      );
    }
}
