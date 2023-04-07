import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuditProgram,AuditProgramPaginationResponse, AuditRiskRateType, SingleAuditor } from 'src/app/core/models/internal-audit/audit-program/audit-program';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {AuditProgramMasterStore} from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class AuditProgramService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService:HelperServiceService) { }

    removeAuditableItem(id: number,item:any){
      return this._http.post('/audit-programs/'+AuditProgramMasterStore.auditProgramId+'/auditors/'+id+'/auditable-items/remove', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'delete_aduitor');
          return res;
        })
      );
    }

    updateAuditableItem(id: number,item:any){

      return this._http.post('/audit-programs/'+AuditProgramMasterStore.auditProgramId+'/auditors/'+id+'/auditable-items/add', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', res.message);
          return res;
        })
      );
    }

    getRiskRatingItem(id,params): Observable<AuditRiskRateType[]> {
      return this._http.get<AuditRiskRateType[]>('/audit-programs/'+AuditProgramMasterStore.auditProgramId+'/auditors/'+id+'/auditable-items'+ (params ? params : '')).pipe((
        map((res:AuditRiskRateType[])=>{
          AuditProgramMasterStore.setAuditRiskRateTpyes(res)
          return res;
        })
      ))
    }

    getAuditorView(id): Observable<SingleAuditor> {
      return this._http.get<SingleAuditor>('/audit-programs/'+AuditProgramMasterStore.auditProgramId+'/auditors/'+id).pipe((
        map((res:SingleAuditor)=>{
          AuditProgramMasterStore.setAuditerById(res)
          return res;
        })
      ))
    }


    getItems(getAll: boolean = false,additionalParams?:string): Observable<AuditProgramPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditProgramMasterStore.currentPage}`;
        if (AuditProgramMasterStore.orderBy) params += `&order_by=${AuditProgramMasterStore.orderItem}&order=${AuditProgramMasterStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(AuditProgramMasterStore.searchText) params += (params ? '&q=' : '?q=')+AuditProgramMasterStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'audit_programz' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AuditProgramPaginationResponse>('/audit-programs' + (params ? params : '')).pipe(
        map((res: AuditProgramPaginationResponse) => {
          AuditProgramMasterStore.setAuditProgram(res);
          return res;
        })
      );
   
    }

    getItem(id): Observable<AuditProgram> {
      return this._http.get<AuditProgram>('/audit-programs/'+id).pipe((
        map((res:AuditProgram)=>{
          AuditProgramMasterStore.setIndividualAuditProgram(res);
          return res;
        })
      ))
    }

    getAllItems(): Observable<AuditProgram[]>{
      return this._http.get<AuditProgram[]>('/audit-programs?is_all=true').pipe(
        map((res: AuditProgram[]) => {
          
          AuditProgramMasterStore.setAllAuditPrograms(res);
          return res;
        })
      );
    }

    saveAuditProgramId(id:number){
      AuditProgramMasterStore.setAuditProgramId(id);}

    saveItem(item: any) {
      return this._http.post('/audit-programs', item).pipe(
        map((res:any )=> {
          AuditProgramMasterStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_audit_program');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    saveImportAuditableItem(id: number,item:any){

      return this._http.put('/audit-programs/'+id+'/auditable-items/add', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'auditor_created_successfully');
          return res;
        })
      );
    }

    deleteImportedAuditableItem(id: number,item:any){
        return this._http.put('/audit-programs/'+id+'/auditable-items/remove', item).pipe(
          map((res:any )=> {
            this._utilityService.showSuccessMessage('success','deleted_auditable_item');
            return res;
          })
        );

    }

    saveImportedRisk(id: number,item:any){

      return this._http.put('/audit-programs/'+id+'/auditable-items/risks/import', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', res.message);
          return res;
        })
      );
    }

    saveImportedProcesses(id: number,item:any){

      return this._http.put('/audit-programs/'+id+'/auditable-items/processes/import', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', res.message);
          return res;
        })
      );
    }

    saveAuditors(id: number,item:any){

      return this._http.post('/audit-programs/'+id+'/auditors', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', res.message);
          return res;
        })
      );
    }

    removeAuditors(id: number,auidtorId:any){
      return this._http.delete('/audit-programs/'+id+'/auditors/'+auidtorId).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'delete_aduitor');
          return res;
        })
      );
    }

    addAllAuditors(id: number,item:any){

      return this._http.put('/audit-programs/'+id+'/add-all-auditors', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', res.message);
          return res;
        })
      );
    }

    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/audit-programs/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_audit_program');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    
    delete(id: number) {
      return this._http.delete('/audit-programs/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_audit_programs');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              AuditProgramMasterStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });

          return res;
        })
      );
    }

    generateTemplate() {
      this._http.get('/audit-programs/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_program_template')+".xlsx");     

        }
      )
    }

    importData(data){  
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/audit-programs/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('successfully','audit_program_imported');
          return res;
        })
      )
    }
  
    exportToExcel() {
      let params = '';
      if (AuditProgramMasterStore.orderBy) params += `?order=${AuditProgramMasterStore.orderBy}`;
      if (AuditProgramMasterStore.orderItem) params += `&order_by=${AuditProgramMasterStore.orderItem}`;
      if(RightSidebarLayoutStore.filterPageTag == 'audit_programz' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/audit-programs/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('audit_programs')+".xlsx");
        }
      )
    }

    auditorsExportToExcel(id :number){
      this._http.get('/audit-programs/'+id+'/auditors/export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('auditor')+".xlsx");
        }
      )
    }

    sortAuditProgramList(type:string, text:string) {
      if (!AuditProgramMasterStore.orderBy) {
        AuditProgramMasterStore.orderBy = 'asc';
        AuditProgramMasterStore.orderItem = type;
      }
      else{
        if (AuditProgramMasterStore.orderItem == type) {
          if(AuditProgramMasterStore.orderBy == 'asc') AuditProgramMasterStore.orderBy = 'desc';
          else AuditProgramMasterStore.orderBy = 'asc'
        }
        else{
          AuditProgramMasterStore.orderBy = 'asc';
          AuditProgramMasterStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems().subscribe();
    else
    this.getItems(false,`&q=${text}`).subscribe();
    }
    

}
