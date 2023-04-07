import { Injectable ,EventEmitter } from '@angular/core';
import { caHistoryPaginationData, CorrectiveAction, CorrectiveActionPaginationResponse  } from 'src/app/core/models/internal-audit/audit-findings/corrective-action/corrective-action';
// import {AmFindingCAStore} from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {CorrectiveActionsResolveStore} from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-resolve-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { AmFindingCAStore } from 'src/app/stores/audit-management/am-audit-finding/am-finding-ca.store';
import { AmAuditFindingStore } from 'src/app/stores/audit-management/am-audit-finding/am-audit-finding.store';

@Injectable({
  providedIn: 'root'
})
export class AmAuditFindingCaService {
  itemChange: EventEmitter <number> = new EventEmitter();
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
  getAllItems(additionalParams?:string): Observable<CorrectiveActionPaginationResponse>{
    let params = '';
    params = `?page=${AmFindingCAStore.currentPage}`;
    if(additionalParams) params += additionalParams;
    if (AmFindingCAStore.orderBy) params += `&order_by=${AmFindingCAStore.orderItem}&order=${AmFindingCAStore.orderBy}`;
    if(AmFindingCAStore.searchText) params += (params ? '&q=' : '?q=')+AmFindingCAStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'am_finding_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CorrectiveActionPaginationResponse>('/am-audit-finding-corrective-actions'+ (params ? params : '')).pipe(
      map((res: CorrectiveActionPaginationResponse) => {
        
        AmFindingCAStore.setAllCorrectiveActions(res);
        return res;
      })
    );
  }

  getFindingsCorrectiveActions(additionalParams?:string): Observable<CorrectiveAction[]>{
    let params = '';
    params = `?page=${AmFindingCAStore.currentPage}`;
    if(additionalParams) params += additionalParams;


    return this._http.get<CorrectiveAction[]>('/am-audit-finding-corrective-actions'+ (params ? params : '')).pipe(
      map((res: CorrectiveAction[]) => {
        
        AmFindingCAStore.setFindingCorrectiveActions(res);
        return res;
      })
    );
  }

 

  getItem(finding_id:number,id: number):
    Observable<CorrectiveAction> {
      return this._http.get<CorrectiveAction>('/am-audit-finding-corrective-actions/' + id).pipe(
        map((res: CorrectiveAction) => {
          AmFindingCAStore.setIndividualCADetails(res);
          return res;
        })
      );

  }

  getCa(id: number):
    Observable<CorrectiveAction> {
      return this._http.get<CorrectiveAction>('/am-audit-finding-corrective-actions/' + id).pipe(
        map((res: CorrectiveAction) => {
          AmFindingCAStore.setIndividualCADetails(res);
          return res;
        })
      );

  }


  setSelected(position?:number,process:boolean = false,reload = false){
    if(process){
      var items:CorrectiveAction[] = AmFindingCAStore.allItems;
      if(position >= 0){
        if(items.length > 0){
          if(position == 0){
            if(reload)
              this.itemChange.emit(items[0].id); 
              AmFindingCAStore.setSelected(items[0].id)
          }
          else{
            if(items.length >= 1){
              if(reload)
                this.itemChange.emit(items[position - 1].id);
                AmFindingCAStore.setSelected(items[position - 1].id);
            }
          }
        }
      }
      else{
        if(items.length > 0){
          if(reload)
            this.itemChange.emit(items[0].id);
            AmFindingCAStore.setSelected(items[0].id);
        }
      }
    }
    else{
      if(position){
        if(reload) 
          this.itemChange.emit(position);
          AmFindingCAStore.setSelected(position)
      }
      else{
        if(reload) 
          this.itemChange.emit(AmFindingCAStore.initialItemId);
          AmFindingCAStore.setSelected(AmFindingCAStore.initialItemId);
      }
    }
  }

  unsetSelectedItemDetails(){
    AmFindingCAStore.unsetSelectedItemDetails();
  }


  setDocumentDetails(imageDetails,url){
    AmFindingCAStore.setDocumentDetails(imageDetails,url);
  }

  setResolveDocumentDetails(imageDetails,url){
    CorrectiveActionsResolveStore.setDocumentDetails(imageDetails,url);
  }

   sortCaList(type: string, text: string) {
    if (!AmFindingCAStore.orderBy) {
      AmFindingCAStore.orderBy = 'asc';
      AmFindingCAStore.orderItem = type;
    }
    else {
      if (AmFindingCAStore.orderItem == type) {
        if (AmFindingCAStore.orderBy == 'asc') AmFindingCAStore.orderBy = 'desc';
        else AmFindingCAStore.orderBy = 'asc'
      }
      else {
        AmFindingCAStore.orderBy = 'asc';
        AmFindingCAStore.orderItem = type;
      }
    }
    // if(!text)
    //   this.getItems(false,null,true).subscribe();
    // else
    //   this.getItems(false,`&q=${text}`,true).subscribe();
  }

  saveItem(findings_id:number,item: CorrectiveAction) {
    
    return this._http.post('/am-audit-finding-corrective-actions', item).pipe(
      map((res:any )=> {
        
        this._utilityService.showSuccessMessage('success', 'ia_ca_add_success_msg');
        return res;
      })
    );
  }

  markAsResolved(ca_id:number,item: any) {
    
    return this._http.post('/finding-am-audit-finding-corrective-actions/'+ca_id+'/updates', item).pipe(
      map((res:any )=> {
        
        this._utilityService.showSuccessMessage('success', 'ca_marked_resolved');
        return res;
      })
    );
  }

  closeCorrectiveAction(ca_id:number){
    return this._http.put('/am-audit-finding-corrective-actions/'+ca_id+'/close', null).pipe(
      map((res:any )=> {
        
        this._utilityService.showSuccessMessage('success', 'ca_close_message');
        this.getAllItems('&finding_ids='+AmAuditFindingStore.auditFindingId).subscribe();
        this.getItem(null,ca_id).subscribe();
        return res;
      })
    );
  }

  UpdateItem(findings_id:number, id:number,item: CorrectiveAction) {
    let params='?finding_ids='+findings_id;
    return this._http.put('/am-audit-finding-corrective-actions/'+id+(params?params:''), item).pipe(
      map((res:any )=> {
        
        this._utilityService.showSuccessMessage('success', 'ia_ca_update_success_msg');
        return res;
      })
    );
  }

  updateCorrectiveAction(ca_id: number, item: any) {

    return this._http.post('/am-audit-finding-corrective-actions/' + ca_id + '/updates', item).pipe(
      map((res: any) => {
        this.getAllItems(AmAuditFindingStore.auditFindingId ? '&finding_ids='+AmAuditFindingStore.auditFindingId : '').subscribe();
        this._utilityService.showSuccessMessage('success', 'ia_ca_status_update_success_msg');
        return res;
        
      })
    );
  }

  getCaHistory(ca_id: number): Observable<caHistoryPaginationData> {
    return this._http.get<caHistoryPaginationData>('/am-audit-finding-corrective-actions/' + ca_id + '/updates'
    ).pipe(
      map((res: caHistoryPaginationData) => {
        AmFindingCAStore.setCorrectiveActionHistory(res);
        return res;
      })
    );
  }


  getDocuments() {
    return AmFindingCAStore.getDocumentDetails;
  }

  setImageDetails(imageDetails, url, type) {
    AmFindingCAStore.setDocumentImageDetails(imageDetails, url, type);
  }

  setSelectedImageDetails(imageDetails, type) {
    AmFindingCAStore.setSelectedImageDetails(imageDetails);
  }

  
  deleteItem(finding_id:number, id: number){
    return this._http.delete('/am-audit-finding-corrective-actions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'ia_ca_delete_success_msg');
        return res;
      })
    );
  }

  deleteCa(id: number){
    return this._http.delete('/am-audit-finding-corrective-actions/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'ia_ca_delete_success_msg');
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/am-audit-finding-corrective-actions/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "CorrectiveActionTemplate.xlsx");
      }
    )
  }

  shareData(data) {
    return this._http.post('/am-audit-finding-corrective-actions/share', data).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'item_shared');
        return res;
      })
    )
  }

  exportToExcel(id?:number) {
    let params = '';
    if (AmFindingCAStore.orderBy) params += `?order=${AmFindingCAStore.orderBy}`;
    if (AmFindingCAStore.orderItem) params += `&order_by=${AmFindingCAStore.orderItem}`;
    if(RightSidebarLayoutStore.filterPageTag == 'ia_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if(id){
      params = (params=='')?'?finding_ids='+id:params+'&finding_ids='+id;
    }
    // let url = '/findings/am-audit-finding-corrective-actions/export'+params;
    // if(id) '/am-audit-finding-corrective-actions/export'
    this._http.get('/am-audit-finding-corrective-actions/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "CorrectiveAction.xlsx");
      }
    )
  }
}
