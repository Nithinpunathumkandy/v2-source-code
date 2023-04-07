import { Injectable ,EventEmitter } from '@angular/core';
import { caHistoryPaginationData, CorrectiveAction, CorrectiveActionPaginationResponse  } from 'src/app/core/models/internal-audit/audit-findings/corrective-action/corrective-action';
import {CorrectiveActionsStore} from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import {CorrectiveActionsResolveStore} from 'src/app/stores/internal-audit/audit-findings/corrective-action/corrective-action-resolve-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
@Injectable({
  providedIn: 'root'
})
export class CorrectiveActionService {
  itemChange: EventEmitter <number> = new EventEmitter();
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
		private _helperService: HelperServiceService) { }

    getAllItems(additionalParams?:string): Observable<CorrectiveActionPaginationResponse>{
      let params = '';
      params = `?page=${CorrectiveActionsStore.currentPage}`;
      if(additionalParams) params += additionalParams;
      if (CorrectiveActionsStore.orderBy) params += `&order_by=${CorrectiveActionsStore.orderItem}&order=${CorrectiveActionsStore.orderBy}`;
      if(CorrectiveActionsStore.searchText) params += (params ? '&q=' : '?q=')+CorrectiveActionsStore.searchText;
      if(RightSidebarLayoutStore.filterPageTag == 'ia_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
    	params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<CorrectiveActionPaginationResponse>('/corrective-actions'+ (params ? params : '')).pipe(
        map((res: CorrectiveActionPaginationResponse) => {
          
          CorrectiveActionsStore.setAllCorrectiveActions(res);
          return res;
        })
      );
    }

    getFindingsCorrectiveActions(id:number,additionalParams?:string): Observable<CorrectiveAction[]>{
      let params = '';
      params = `?page=${CorrectiveActionsStore.currentPage}`;
      if(additionalParams) params += additionalParams;


      return this._http.get<CorrectiveAction[]>('/findings/'+id+'/corrective-actions'+ (params ? params : '')).pipe(
        map((res: CorrectiveAction[]) => {
          
          CorrectiveActionsStore.setFindingCorrectiveActions(res);
          return res;
        })
      );
    }

   

    getItem(finding_id:number,id: number):
      Observable<CorrectiveAction> {
        return this._http.get<CorrectiveAction>('/findings/'+finding_id+'/corrective-actions/' + id).pipe(
          map((res: CorrectiveAction) => {
            CorrectiveActionsStore.setIndividualCADetails(res);
            return res;
          })
        );

    }


    setSelected(position?:number,process:boolean = false,reload = false){
      if(process){
        var items:CorrectiveAction[] = CorrectiveActionsStore.allItems;
        if(position >= 0){
          if(items.length > 0){
            if(position == 0){
              if(reload)
                this.itemChange.emit(items[0].id); 
                CorrectiveActionsStore.setSelected(items[0].id)
            }
            else{
              if(items.length >= 1){
                if(reload)
                  this.itemChange.emit(items[position - 1].id);
                  CorrectiveActionsStore.setSelected(items[position - 1].id);
              }
            }
          }
        }
        else{
          if(items.length > 0){
            if(reload)
              this.itemChange.emit(items[0].id);
              CorrectiveActionsStore.setSelected(items[0].id);
          }
        }
      }
      else{
        if(position){
          if(reload) 
            this.itemChange.emit(position);
            CorrectiveActionsStore.setSelected(position)
        }
        else{
          if(reload) 
            this.itemChange.emit(CorrectiveActionsStore.initialItemId);
            CorrectiveActionsStore.setSelected(CorrectiveActionsStore.initialItemId);
        }
      }
    }

    unsetSelectedItemDetails(){
      CorrectiveActionsStore.unsetSelectedItemDetails();
    }


    setDocumentDetails(imageDetails,url){
      CorrectiveActionsStore.setDocumentDetails(imageDetails,url);
    }

    setResolveDocumentDetails(imageDetails,url){
      CorrectiveActionsResolveStore.setDocumentDetails(imageDetails,url);
    }

     sortCaList(type: string, text: string) {
      if (!CorrectiveActionsStore.orderBy) {
        CorrectiveActionsStore.orderBy = 'asc';
        CorrectiveActionsStore.orderItem = type;
      }
      else {
        if (CorrectiveActionsStore.orderItem == type) {
          if (CorrectiveActionsStore.orderBy == 'asc') CorrectiveActionsStore.orderBy = 'desc';
          else CorrectiveActionsStore.orderBy = 'asc'
        }
        else {
          CorrectiveActionsStore.orderBy = 'asc';
          CorrectiveActionsStore.orderItem = type;
        }
      }
      // if(!text)
      //   this.getItems(false,null,true).subscribe();
      // else
      //   this.getItems(false,`&q=${text}`,true).subscribe();
    }

    saveItem(findings_id:number,item: CorrectiveAction) {
      
      return this._http.post('/findings/'+findings_id+'/corrective-actions', item).pipe(
        map((res:any )=> {
          
          this._utilityService.showSuccessMessage('success', 'ia_ca_add_success_msg');
          return res;
        })
      );
    }

    markAsResolved(ca_id:number,item: any) {
      
      return this._http.post('/finding-corrective-actions/'+ca_id+'/updates', item).pipe(
        map((res:any )=> {
          
          this._utilityService.showSuccessMessage('success', 'ca_marked_resolved');
          return res;
        })
      );
    }

    closeCorrectiveAction(finding_id: number, ca_id:number, item:any){
      return this._http.put('/findings/'+finding_id+'/corrective-actions/'+ca_id+'/close', item).pipe(
        map((res:any )=> {
          
          this._utilityService.showSuccessMessage('success', 'ca_close_message');
          return res;
        })
      );
    }

    UpdateItem(findings_id:number, id:number,item: CorrectiveAction) {
      
      return this._http.put('/findings/'+findings_id+'/corrective-actions/'+id, item).pipe(
        map((res:any )=> {
          
          this._utilityService.showSuccessMessage('success', 'ia_ca_update_success_msg');
          return res;
        })
      );
    }

    updateCorrectiveAction(ca_id: number, item: any) {

      return this._http.post('/noc-finding-corrective-actions/' + ca_id + '/updates', item).pipe(
        map((res: any) => {
  
          this._utilityService.showSuccessMessage('success', 'ia_ca_status_update_success_msg');
          return res;
        })
      );
    }

    getCaHistory(ca_id: number): Observable<caHistoryPaginationData> {
      return this._http.get<caHistoryPaginationData>('/noc-finding-corrective-actions/' + ca_id + '/updates'
      ).pipe(
        map((res: caHistoryPaginationData) => {
          CorrectiveActionsStore.setCorrectiveActionHistory(res);
          return res;
        })
      );
    }
  

    getDocuments() {
      return CorrectiveActionsStore.getDocumentDetails;
    }

    setImageDetails(imageDetails, url, type) {
      CorrectiveActionsStore.setDocumentImageDetails(imageDetails, url, type);
    }
  
    setSelectedImageDetails(imageDetails, type) {
      CorrectiveActionsStore.setSelectedImageDetails(imageDetails);
    }

    
    deleteItem(finding_id:number, id: number){
      return this._http.delete('/findings/'+finding_id+'/corrective-actions/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('Success!', 'ia_ca_delete_success_msg');
          return res;
        })
      );
    }

    generateTemplate(id:number) {
      this._http.get('/findings/'+id+'/corrective-actions/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, "CorrectiveActionTemplate.xlsx");
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_corrective_action_template')+".xlsx");     
        }
      )
    }

    shareData(data) {
      return this._http.post('/corrective-actions/share', data).pipe(
        map((res: any) => {
          this._utilityService.showSuccessMessage('success', 'item_shared');
          return res;
        })
      )
    }

    exportToExcel(id?:number) {
      let params = '';
      if (CorrectiveActionsStore.orderBy) params += `?order=${CorrectiveActionsStore.orderBy}`;
      if (CorrectiveActionsStore.orderItem) params += `&order_by=${CorrectiveActionsStore.orderItem}`;
      if(RightSidebarLayoutStore.filterPageTag == 'ia_corrective_action' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      let url = '/findings/corrective-actions/export'+params;
      if(id) '/findings/' + id + '/corrective-actions/export'
      this._http.get(url, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('internal_audit_corrective_action')+".xlsx");     
        }
      )
    }
  
    // exportToExcel(id:number) {
    //   this._http.get('/findings/'+id+'/corrective-actions/export', { responseType: 'blob' as 'json' }).subscribe(
    //     (response: any) => {
    //       this._utilityService.downloadFile(response, "CorrectiveAction.xlsx");
    //     }
    //   )
    // }
}


