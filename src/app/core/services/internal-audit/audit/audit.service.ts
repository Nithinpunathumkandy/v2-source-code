import { Injectable } from '@angular/core';
import { Audit,AuditPaginationResponse} from 'src/app/core/models/internal-audit/audit/audit';
import {AuditStore} from 'src/app/stores/internal-audit/audit/audit-store';
import { Schedules} from 'src/app/core/models/internal-audit/audit-plan/audit-plan';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service'; 
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuditService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

    
    getItems(getAll: boolean = false, additionalParams?: string): Observable<AuditPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditStore.currentPage}`;
        if (AuditStore.orderBy) params += `&order_by=${AuditStore.orderItem}&order=${AuditStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditStore.searchText) params += (params ? '&q=' : '?q=')+AuditStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'audit' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AuditPaginationResponse>('/audits' + (params ? params : '')).pipe(
        map((res: AuditPaginationResponse) => {
          AuditStore.setAudit(res);
          return res;
        })
      );
    }

    getAuditForAuditProgram(id:number,additionalParams?: string): Observable<Audit[]> {
      let params = '';
      if (additionalParams) params += additionalParams;
      if(AuditStore.searchText) params += (params ? '&q=' : '?q=')+AuditStore.searchText;

      return this._http.get<Audit[]>('/audit-programs/'+id+'/audits' + (params ? params : '')).pipe(
        map((res: Audit[]) => {
          AuditStore.setAllAuditForAuditProgram(res);
          return res;
        })
      );
    }
  
    getAllItems(): Observable<Audit[]>{
      return this._http.get<Audit[]>('/audits?is_all=true').pipe(
        map((res: Audit[]) => {
          
          AuditStore.setAllAudit(res);
          return res;
        })
      );
    }


    setDocumentDetails(imageDetails,url){
      AuditStore.setDocumentDetails(imageDetails,url);
    }

    setExecuteChecklistDocDetails(imageDetails,url){
      AuditStore.setChecklistExecuteDocumentDetails(imageDetails,url)
    }

    setAuditId(id){
      AuditStore.setAuditId(id)
    }

    setAuditReportId(id){
      AuditStore.setReportId(id)
    }

    setSelected(id){
      AuditStore.setSelected(id);
    }

    getAuditSchedule(auditSchedule) {
      AuditStore.setauditSchedule(auditSchedule);
    }


    saveChecklistAnswers(item:any) {
      return this._http.post('/audit-schedules/checklist-answer',item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'create_checklist_answers');
          return res;
        })
      );
    }

    updateChecklistAnswers(id:number, item:any) {
      return this._http.put('/audit-schedules/checklist-answer/'+id,item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_checklist_answers');
          return res;
        })
      );
    }



    getItem(id): Observable<Audit> {
      return this._http.get<Audit>('/audits/'+id).pipe((
        map((res:Audit)=>{
          AuditStore.setIndividualAudit(res);
          return res;
        })
      ))
    }


    markAudited(scheduleId:number, item:any): Observable<Audit> {
      return this._http.put<Audit>('/audit-schedules/'+scheduleId+'/audited',item).pipe((
        map((res:Audit)=>{
          this._utilityService.showSuccessMessage('success', 'mark_as_audited');
          return res;
        })
      ))
    }


    unMarkAudited( scheduleId:number , item:any) : Observable<Audit> {
      return this._http.put<Audit>('/audit-schedules/'+scheduleId+'/not-audited' , item).pipe((
        map((res:Audit)=>{
          this._utilityService.showSuccessMessage('success', 'unmark_as_audited');
          return res;
        })
      ))
    }

    addNewAuditors(scheduleId:number , item:any) : Observable<Audit> {
      return this._http.put<Audit>('/audit-schedules/'+scheduleId+'/add-auditor' , item).pipe((
        map((res:Audit)=>{
          this._utilityService.showSuccessMessage('success', 'new_auditors_added');
          return res;
        })
      ))
    }

    addNewAuditees(scheduleId:number , item:any) : Observable<Audit> {
      return this._http.put<Audit>('/audit-schedules/'+scheduleId+'/add-auditee' , item).pipe((
        map((res:Audit)=>{
          this._utilityService.showSuccessMessage('success', 'new_auditee_added');
          return res;
        })
      ))
    }


    saveItem(item: any) {
      return this._http.post('/audits', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'create_audit_message');
          this.getItems().subscribe();
          return res;
        })
      );
    }
    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/audits/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_audit_message');
          this.getItems().subscribe();
          return res;
        })
      );
    }
  
    
    delete(id: number) {
      return this._http.delete('/audits/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delet_audit_message');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              AuditStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });
  
          return res;
        })
      );
    }


    generateTemplate() {
      this._http.get('/audits/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_templates')+".xlsx");     
        }
      )
    }

    importData(data){  
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/audits/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('successfully','audit_imported');
          return res;
        })
      )
    }
  
    exportToExcel() {
      let params = '';
      if (AuditStore.orderBy) params += `?order=${AuditStore.orderBy}`;
      if (AuditStore.orderItem) params += `&order_by=${AuditStore.orderItem}`;
      if(RightSidebarLayoutStore.filterPageTag == 'audit' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/audits/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit')+".xlsx");     
        }
      )
    }
  
    sortAuditList(type:string, text:string) {
      if (!AuditStore.orderBy) {
        AuditStore.orderBy = 'asc';
        AuditStore.orderItem = type;
      }
      else{
        if (AuditStore.orderItem == type) {
          if(AuditStore.orderBy == 'asc') AuditStore.orderBy = 'desc';
          else AuditStore.orderBy = 'asc'
        }
        else{
          AuditStore.orderBy = 'asc';
          AuditStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems().subscribe();
    else
    this.getItems(false,`&q=${text}`).subscribe();
    }


    sortAuditListFromProgram(type:string, text:string, id:number) {
      if (!AuditStore.orderBy) {
        AuditStore.orderBy = 'asc';
        AuditStore.orderItem = type;
      }
      else{
        if (AuditStore.orderItem == type) {
          if(AuditStore.orderBy == 'asc') AuditStore.orderBy = 'desc';
          else AuditStore.orderBy = 'asc'
        }
        else{
          AuditStore.orderBy = 'asc';
          AuditStore.orderItem = type;
        }
      }
      if(!text)
      this.getAuditForAuditProgram(id).subscribe();
    else
    this.getAuditForAuditProgram(id,`&q=${text}`).subscribe();
    }

}
