import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuditSchedules,AuditSchedulesPaginationResponse } from 'src/app/core/models/internal-audit/audit-schedule/audit-schedule';
import {AuditSchedulesStore} from 'src/app/stores/internal-audit/audit-schedule/audit-schedule-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuditScheduleService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService) { }


    getItems(getAll: boolean = false,additionalParams?:string): Observable<AuditSchedulesPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditSchedulesStore.currentPage}`;
        if (AuditSchedulesStore.orderBy) params += `&order_by=${AuditSchedulesStore.orderItem}&order=${AuditSchedulesStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(AuditSchedulesStore.searchText) params += (params ? '&q=' : '?q=')+AuditSchedulesStore.searchText;
      return this._http.get<AuditSchedulesPaginationResponse>('/audit-schedules' + (params ? params : '')).pipe(
        map((res: AuditSchedulesPaginationResponse) => {
          AuditSchedulesStore.setAuditSChedules(res);
          return res;
        })
      );
   
    }

    getItem(id): Observable<AuditSchedules> {
      return this._http.get<AuditSchedules>('/audit-schedules/'+id).pipe((
        map((res:AuditSchedules)=>{
          AuditSchedulesStore.setIndividualAuditSchedule(res);
          return res;
        })
      ))
    }

    getAllItems(): Observable<AuditSchedules[]>{
      return this._http.get<AuditSchedules[]>('/audit-schedules?is_all=true').pipe(
        map((res: AuditSchedules[]) => {
          
          AuditSchedulesStore.setAllAuditSChedules(res);
          return res;
        })
      );
    }

    saveAuditScheduleId(id:number){
      AuditSchedulesStore.setAuditScheduleId(id);}



      updateItem(id:number, item: any): Observable<any> {
        return this._http.put('/audit-schedules/' + id, item).pipe(
          map(res => {
            this._utilityService.showSuccessMessage('success', 'update_audit_schedule');
            // this.getItems().subscribe();
            return res;
          })
        );
      }


      markAudited(scheduleId:number, item:any): Observable<AuditSchedules> {
        return this._http.put<AuditSchedules>('/audit-schedules/'+scheduleId+'/audited',item).pipe((
          map((res:AuditSchedules)=>{
            this._utilityService.showSuccessMessage('success', 'mark_as_audited');
            return res;
          })
        ))
      }
  
  
      unMarkAudited( scheduleId:number , item:any) : Observable<AuditSchedules> {
        return this._http.put<AuditSchedules>('/audit-schedules/'+scheduleId+'/not-audited' , item).pipe((
          map((res:AuditSchedules)=>{
            this._utilityService.showSuccessMessage('success', 'unmark_as_audited');
            return res;
          })
        ))
      }

      auditorAbsent(schedule_id:number, id:number, item){
        return this._http.put<AuditSchedules>('/audit-schedules/'+schedule_id+'/auditor/'+id+'/absent',item).pipe((
          map((res:AuditSchedules)=>{
            this._utilityService.showSuccessMessage('success', 'absent_mark_auditor');
            return res;
          })
        ))
      }
  
      auditorPresent(schedule_id:number, id:number,item){
        return this._http.put<AuditSchedules>('/audit-schedules/'+schedule_id+'/auditor/'+id+'/present',item).pipe((
          map((res:AuditSchedules)=>{
            this._utilityService.showSuccessMessage('success', 'present_mark_auditor');
            return res;
          })
        ))
      }
  
  
      auditeeAbsent(schedule_id:number, id:number, item){
        return this._http.put<AuditSchedules>('/audit-schedules/'+schedule_id+'/auditee/'+id+'/absent',item).pipe((
          map((res:AuditSchedules)=>{
            this._utilityService.showSuccessMessage('success', 'absent_mark_auditee');
            return res;
          })
        ))
      }
  
      auditeePresent(schedule_id:number, id:number,item){
        return this._http.put<AuditSchedules>('/audit-schedules/'+schedule_id+'/auditee/'+id+'/present',item).pipe((
          map((res:AuditSchedules)=>{
            this._utilityService.showSuccessMessage('success', 'present_mark_auditee');
            return res;
          })
        ))
      }


      generateTemplate() {
        this._http.get('/audit-schedules/template', { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_schedules_template')+".xlsx");
          }
        )
      }
    
      exportToExcel() {
        this._http.get('/audit-schedules/export', { responseType: 'blob' as 'json' }).subscribe(
          (response: any) => {
            this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_schedules')+".xlsx");
          }
        )
      }


      sortAuditScheduleList(type:string, text:string) {
        if (!AuditSchedulesStore.orderBy) {
          AuditSchedulesStore.orderBy = 'asc';
          AuditSchedulesStore.orderItem = type;
        }
        else{
          if (AuditSchedulesStore.orderItem == type) {
            if(AuditSchedulesStore.orderBy == 'asc') AuditSchedulesStore.orderBy = 'desc';
            else AuditSchedulesStore.orderBy = 'asc'
          }
          else{
            AuditSchedulesStore.orderBy = 'asc';
            AuditSchedulesStore.orderItem = type;
          }
        }
        if(!text)
        this.getItems().subscribe();
      else
      this.getItems(false,`&q=${text}`).subscribe();
      }

}
