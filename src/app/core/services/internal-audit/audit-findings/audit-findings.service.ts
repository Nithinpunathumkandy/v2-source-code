import { Injectable } from '@angular/core';
import { AuditableItem, AuditFindings ,AuditFindingsPaginationResponse  } from 'src/app/core/models/internal-audit/audit-findings/audit-findings';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {AuditFindingsStore} from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class AuditFindingsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

    getItemsForAuditProgam(id,getAll: boolean = false, additionalParams?: string): Observable<AuditableItem[]> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditFindingsStore.currentPage}&status=active`;
        if (AuditFindingsStore.orderBy) params += `&order_by=${AuditFindingsStore.orderItem}&order=${AuditFindingsStore.orderBy}`;
      }
      if (additionalParams) params += additionalParams;
      if(AuditFindingsStore.searchText) params += (params ? '&q=' : '?q=')+AuditFindingsStore.searchText;
      return this._http.get<AuditableItem[]>('/audit-schedules/'+id+'/auditable-items' + (params ? params : '')).pipe(
        map((res: AuditableItem[]) => {
          AuditFindingsStore.setIndividualAuditableItem(res);
          return res;
        })
      );
    }

    getAuditableItem(id): Observable<AuditableItem[]> {
      return this._http.get<AuditableItem[]>('/audit-schedules/'+id+'/auditable-items').pipe((
        map((res:AuditableItem[])=>{
          AuditFindingsStore.setAllAuditableItem(res);
          return res;
        })
      ))
    }

    getItems(getAll: boolean = false,additionalParams?:string): Observable<AuditFindingsPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${AuditFindingsStore.currentPage}`;
        if (AuditFindingsStore.orderBy) params += `&order_by=${AuditFindingsStore.orderItem}&order=${AuditFindingsStore.orderBy}`;

      }
     
      if(additionalParams) params += additionalParams;
      if(AuditFindingsStore.searchText) params += (params ? '&q=' : '?q=')+AuditFindingsStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'audit_finding' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<AuditFindingsPaginationResponse>('/findings' + (params ? params : '')).pipe(
        map((res: AuditFindingsPaginationResponse) => {
          AuditFindingsStore.setFinding(res);
          return res;
        })
      );
   
    }

    getAuditFindingsForAuditProgram(id:number,additionalParams?: string): Observable<AuditFindings[]> {
      let params = '';
      if (additionalParams) params += additionalParams;
      if(AuditFindingsStore.searchText) params += (params ? '&q=' : '?q=')+AuditFindingsStore.searchText;

      return this._http.get<AuditFindings[]>('/audit-programs/'+id+'/findings ' + (params ? params : '')).pipe(
        map((res: AuditFindings[]) => {
          AuditFindingsStore.setAllFindingsFromProgram(res);
          return res;
        })
      );
    }

    getItem(id): Observable<AuditFindings> {
      return this._http.get<AuditFindings>('/findings/'+id).pipe((
        map((res:AuditFindings)=>{
          AuditFindingsStore.setIndividualAuditFindingItem(res);
          return res;
        })
      ))
    }

    saveAuditFindingId(id:number){
      AuditFindingsStore.setAuditFindingId(id);}

    setDocumentDetails(imageDetails,url){
      AuditFindingsStore.setDocumentDetails(imageDetails,url);
    }

    selectRequiredAuditableItem(auditableItem) {
      
      var auditableItemToDisplay = [];
      for(let i of auditableItem){
        let obj = { id:i.id,title: i.title, reference_code:i.reference_code, type:i.auditableItemType?i.auditableItemType.title:i.auditable_item_type,risk_rating:i.risk_rating?.language?i.risk_rating.language[0].pivot.title:i.risk_rating
        , category:i.auditableItemCategory?i.auditableItemCategory.title:i.auditable_item_category, status:i.status_id}
        auditableItemToDisplay.push(obj);

   }
    
     AuditFindingsStore.addSelectedAuditableItem(auditableItem,auditableItemToDisplay);
    }


    selectRequiredChecklists(checklists){
      var checklistsToDisplay = [];
      for(let i of checklists){
        
        checklistsToDisplay.push(i);

   }
   AuditFindingsStore.addSelectedChecklists(checklistsToDisplay);
    }



    saveItem(item: any) {
      return this._http.post('/findings', item).pipe(
        map((res:any )=> {
          AuditFindingsStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_findings');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    saveFromAudit(item: any) {
      return this._http.post('/findings', item).pipe(
        map((res:any )=> {
          AuditFindingsStore.setLastInsertedId(res.id);

          this._utilityService.showSuccessMessage('success', 'create_findings');
          return res;
        })
      );
    }
    updateItem(id:number, item: any): Observable<any> {
      return this._http.put('/findings/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_findings');
          this.getItems().subscribe();
          return res;
        })
      );
    }

    updateFromAudit(id:number, item: any): Observable<any> {
      return this._http.put('/findings/' + id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'update_findings');
          return res;
        })
      );
    }

    addQuickCorrection(id:number,item :any){
      return this._http.post('/findings/'+id+'/corrections', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'create_quick_correction');
          return res;
        })
      );
    }

    updateQuickCorrection(findings_id:number,id:number,item :any){
      return this._http.put('/findings/'+findings_id+'/corrections/'+id, item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'update_quick_correction');
          return res;
        })
      );
    }

    deleteQuickCorrection(findings_id:number,id:number){
      return this._http.delete('/findings/'+findings_id+'/corrections/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success', 'delete_quick_correction');
          return res;
        })
      );
    }

    delete(id: number) {
      return this._http.delete('/findings/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'delete_finding');
          this.getItems().subscribe(resp=>{
            if(resp.from==null){
              AuditFindingsStore.setCurrentPage(resp.current_page-1);
              this.getItems().subscribe();
            }
          });

          return res;
        })
      );
    }

    generateTemplate() {
      this._http.get('/findings/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_findings_template')+".xlsx");     

        }
      )
    }
  
    exportToExcel(params:string='') {
      if (AuditFindingsStore.orderBy) params += `?order=${AuditFindingsStore.orderBy}`;
      if (AuditFindingsStore.orderItem) params += `&order_by=${AuditFindingsStore.orderItem}`;
      if(RightSidebarLayoutStore.filterPageTag == 'audit_finding' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/findings/export'+(params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_findings')+".xlsx");     
        }
      )
    }

    sortFindingslList(type:string, text:string) {
      if (!AuditFindingsStore.orderBy) {
        AuditFindingsStore.orderBy = 'asc';
        AuditFindingsStore.orderItem = type;
      }
      else{
        if (AuditFindingsStore.orderItem == type) {
          if(AuditFindingsStore.orderBy == 'asc') AuditFindingsStore.orderBy = 'desc';
          else AuditFindingsStore.orderBy = 'asc'
        }
        else{
          AuditFindingsStore.orderBy = 'asc';
          AuditFindingsStore.orderItem = type;
        }
      }
      if(!text)
      this.getItems().subscribe();
    else
    this.getItems(false,`&q=${text}`).subscribe();
    }
    

    selectRequiredFinding(items){
   
      AuditFindingsStore.addSelectedFinding(items);
    }


}

