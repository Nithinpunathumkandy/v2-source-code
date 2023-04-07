import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';

import {AuditPlanScheduleMasterStore} from 'src/app/stores/internal-audit/audit-plan-schedule/audit-plan-schedule-store';
import { AuditableItems, Schedules ,MsTypeClauses, SchedulesPaginationResponse } from 'src/app/core/models/internal-audit/audit-plan-schedule/audit-plan-schedule';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class AuditPlanScheduleService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { } 

    getItemsForAuditProgam(id,auditLeaderId,getAll: boolean = false, additionalParams?: string): Observable<AuditableItems[]> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditPlanScheduleMasterStore.currentPage}&status=active`;
        if (AuditPlanScheduleMasterStore.orderBy) params += `&order_by=${AuditPlanScheduleMasterStore.orderItem}&order=${AuditPlanScheduleMasterStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditPlanScheduleMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditPlanScheduleMasterStore.searchText;

      return this._http.get<AuditableItems[]>('/audit-plans/'+id+'/audit-leaders/'+auditLeaderId+'/auditable-items' + (params ? params : '')).pipe(
        map((res: AuditableItems[]) => {
          AuditPlanScheduleMasterStore.setIndividualAuditableItem(res);
          return res;
        })
      );
    }

    getAuditableItem(id,auditLeaderId): Observable<AuditableItems[]> {
      return this._http.get<AuditableItems[]>('/audit-plans/'+id+'/audit-leaders/'+auditLeaderId+'/auditable-items').pipe((
        map((res:AuditableItems[])=>{
          AuditPlanScheduleMasterStore.setAllAuditableItem(res);
          return res;
        })
      ))
    }

    getItems(getAll: boolean = false, additionalParams?: string): Observable<SchedulesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditPlanScheduleMasterStore.currentPage}`;
        if (AuditPlanScheduleMasterStore.orderBy) params += `&order_by=${AuditPlanScheduleMasterStore.orderItem}&order=${AuditPlanScheduleMasterStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditPlanScheduleMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditPlanScheduleMasterStore.searchText;

      return this._http.get<SchedulesPaginationResponse>('/audit-plan-schedules' + (params ? params : '')).pipe(
        map((res: SchedulesPaginationResponse) => {
          AuditPlanScheduleMasterStore.setAuditPlanSchedule(res);
          return res;
        })
      );
    }
  
    getAllItems(): Observable<Schedules[]>{
      return this._http.get<Schedules[]>('/audit-plan-schedules?is_all=true').pipe(
        map((res: Schedules[]) => {
          
          AuditPlanScheduleMasterStore.setAllAuditPlanSchedule(res);
          return res;
        })
      );
    }

    setAuditPlanScheduleId(id){
      AuditPlanScheduleMasterStore.setAuditPlanScheduleId(id)
    }

    getItem(id): Observable<Schedules> {
      return this._http.get<Schedules>('/audit-plan-schedules/'+id).pipe((
        map((res:Schedules)=>{
          AuditPlanScheduleMasterStore.setIndividualAuditSchedule(res);
          return res;
        })
      ))
    }

    setDocumentDetails(imageDetails,url){
      AuditPlanScheduleMasterStore.setDocumentDetails(imageDetails,url);
    }

    selectRequiredAuditableItem(auditableItem) {
      console.log(auditableItem)
      var risk_rate
      var auditableItemToDisplay = [];
      for(let i of auditableItem){
        // if(i.risk_rating_type=='very_high'){
        //   risk_rate = 'Very High'
        // }else if(i.risk_rating_type=='high'){
        //   risk_rate = 'High'
        // }
        // else if(i.risk_rating_type=='medium'){
        //   risk_rate = 'Medium'
        // }
        // else if(i.risk_rating_type=='low'){
        //   risk_rate = 'Low'
        // }
          let obj = { id:i.id,
            title: i.title, 
            reference_code:i.reference_code,
             type:i.auditableItemType?i.auditableItemType.title:i.type,
             risk_rating:i.risk_rating, 
             risk_rating_label:i.risk_rating_label, 
             category:i.auditableItemCategory?i.auditableItemCategory.title:i.category, 
             status:i.status_id}
          auditableItemToDisplay.push(obj);
  
     }
    
     AuditPlanScheduleMasterStore.addSelectedAuditableItem(auditableItem,auditableItemToDisplay);
    }

    selectRequiredCheckList(checklist){
      var checklistToDisplay = [];
      for(let i of checklist){
        let obj = { id:i.id,title: i.title,clause_number:i.clause_number}
          checklistToDisplay.push(obj);
      
   }
   AuditPlanScheduleMasterStore.addSelectedChecklist(checklist,checklistToDisplay);

    }

    saveItem(item: any) {
      return this._http.post('/audit-plan-schedules', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'create_plan_schedule');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    addNewAuditors(scheduleId:number , item:any) : Observable<Schedules> {
      return this._http.put<Schedules>('/audit-plan-schedules/'+scheduleId+'/add-auditor' , item).pipe((
        map((res:Schedules)=>{
          this._utilityService.showSuccessMessage('success', 'new_auditors_added');
          return res;
        })
      ))
    }

    addNewAuditees(scheduleId:number , item:any) : Observable<Schedules> {
      return this._http.put<Schedules>('/audit-plan-schedules/'+scheduleId+'/add-auditee' , item).pipe((
        map((res:Schedules)=>{
          this._utilityService.showSuccessMessage('success', 'new_auditee_added');
          return res;
        })
      ))
    }

    auditorAbsent(schedule_id:number, id:number, item){
      return this._http.put<Schedules>('/audit-plan-schedules/'+schedule_id+'/auditor/'+id+'/absent',item).pipe((
        map((res:Schedules)=>{
          this._utilityService.showSuccessMessage('success', 'absent_mark_auditor');
          return res;
        })
      ))
    }

    auditorPresent(schedule_id:number, id:number,item){
      return this._http.put<Schedules>('/audit-plan-schedules/'+schedule_id+'/auditor/'+id+'/present',item).pipe((
        map((res:Schedules)=>{
          this._utilityService.showSuccessMessage('success', 'present_mark_auditor');
          return res;
        })
      ))
    }


    auditeeAbsent(schedule_id:number, id:number, item){
      return this._http.put<Schedules>('/audit-plan-schedules/'+schedule_id+'/auditee/'+id+'/absent',item).pipe((
        map((res:Schedules)=>{
          this._utilityService.showSuccessMessage('success', 'absent_mark_auditee');
          return res;
        })
      ))
    }

    auditeePresent(schedule_id:number, id:number,item){
      return this._http.put<Schedules>('/audit-plan-schedules/'+schedule_id+'/auditee/'+id+'/present',item).pipe((
        map((res:Schedules)=>{
          this._utilityService.showSuccessMessage('success', 'present_mark_auditee');
          return res;
        })
      ))
    }

    saveFromAuditPlan(item: any) {
      return this._http.post('/audit-plan-schedules', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'create_plan_schedule');
          return res;
        })
      );
    }

    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/audit-plan-schedules/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_plan_schedule');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    updateItemFromPlan(id:number, item: any): Observable<any> {
      return this._http.put('/audit-plan-schedules/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_plan_schedule');
          return res;
        })
      );
    }
  
    
    delete(id: number) {
      return this._http.delete('/audit-plan-schedules/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_plan_schedules');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              AuditPlanScheduleMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });
  
          return res;
        })
      );
    }


    generateTemplate() {
      this._http.get('/audit-plan-schedules/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "AuditPlanScheduleTemplate.xlsx");
        }
      )
    }
  
    exportToExcel() {
      this._http.get('/audit-plan-schedules/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "AuditPlanSchedule.xlsx");
        }
      )
    }
  
    sortAuditPlanSCheduleList(type:string, text:string) {
      if (!AuditPlanScheduleMasterStore.orderBy) {
        AuditPlanScheduleMasterStore.orderBy = 'asc';
        AuditPlanScheduleMasterStore.orderItem = type;
      }
      else{
        if (AuditPlanScheduleMasterStore.orderItem == type) {
          if(AuditPlanScheduleMasterStore.orderBy == 'asc') AuditPlanScheduleMasterStore.orderBy = 'desc';
          else AuditPlanScheduleMasterStore.orderBy = 'asc'
        }
        else{
          AuditPlanScheduleMasterStore.orderBy = 'asc';
          AuditPlanScheduleMasterStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems().subscribe();
    else
    this.getItems(false,`&q=${text}`).subscribe();
    }
  
    getClausesByMstypes(ms_type_id): Observable<MsTypeClauses[]>{
      return this._http.get<MsTypeClauses[]>(`/document-version-contents?ms_type_ids=${ms_type_id}`).pipe(
        map((res: MsTypeClauses[]) => {     
          AuditPlanScheduleMasterStore.setMsTypeClauses(res);
          return res;
        })
      );
    }

  
}
