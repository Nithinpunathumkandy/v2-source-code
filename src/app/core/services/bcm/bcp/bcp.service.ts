import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BcpStore } from "src/app/stores/bcm/bcp/bcp-store";
import { BcpDetails, BcpPaginationResponse, BcpWorkFlowDetails } from "src/app/core/models/bcm/bcp/bcp";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { WorkflowHistoryPagination } from 'src/app/core/models/knowledge-hub/documents/documentWorkFlow';
import { diffStringsRaw } from 'jest-diff';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class BcpService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

    getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BcpPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${BcpStore.currentPage}`;
        if (BcpStore.orderBy) params += `&order=${BcpStore.orderBy}`;
        if (BcpStore.orderItem) params += `&order_by=${BcpStore.orderItem}`;
      }
      if (BcpStore.searchText) params = (params == '') ? params + `?q=${BcpStore.searchText}` : params + `&q=${BcpStore.searchText}`;
      if(additionalParams){
        params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      }
      if (status) params += (params ? '&' : '?')+'status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'bcm_bcp' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<BcpPaginationResponse>('/business-continuity-plans' + (params ? params : '')).pipe(
        map((res: BcpPaginationResponse) => {
          BcpStore.setBcpResponse(res);
          return res;
        })
      );
    }

    getItem(id: number): Observable<BcpDetails>{
      return this._http.get<BcpDetails>('/business-continuity-plans/' + id).pipe(
        map((res: BcpDetails) => {
          BcpStore.setBcpDetails(res);
          return res;
        })
      );
    }

    updateItem(category_id:number, category): Observable<any> {
      return this._http.put('/business-continuity-plans/'+ category_id, category).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcp_updated');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }
  
    saveItem(item): Observable<any> {
      return this._http.post('/business-continuity-plans', item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcp_added');
          BcpStore.orderItem = 'business_continuity_plans.created_at';
          BcpStore.orderBy = 'desc';
          this.getItems(false,null,true).subscribe(resp=>{
            if(resp.from==null){
              BcpStore.setCurrentPage(resp.current_page-1);
              this.getItems(false,null,true).subscribe();
            }
          });
          return res;
        })
      );
    }
  
    delete(id: number) {
      return this._http.delete('/business-continuity-plans/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcp_deleted');
          this.getItems(false,null,true).subscribe();
          return res;
        })
      );
    }

    searchBcpContents(e,type){
      let url = '';
      if(type == 'bcp_contents') url = '/business-continuity-plans/'+BcpStore.selectedBcpId+'/search?q='+e;
      else url = '/bcp-change-request/'+BcpStore.bcpContents.change_request[0].id+'/search?q='+e; 
      return this._http.get<any>(url).pipe(
        map((res: any) => {
          BcpStore.setSearchList(res);
          return res;
        })
      );
    }
  
    activate(id: number) {
      return this._http.put('/business-continuity-plans/' + id + '/activate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcp_activated');
          this.getItems(false,null).subscribe();
          return res;
        })
      );
    }
  
    deactivate(id: number) {
      return this._http.put('/business-continuity-plans/' + id + '/deactivate', null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcp_deactivated');
          this.getItems(false,null).subscribe();
          return res;
        })
      );
    }
  
    generateTemplate() {
      this._http.get('/business-continuity-plans/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('bcp_template')+".xlsx");
        }
      )
    }
  
    exportToExcel() {
      let params = '';
      if (BcpStore.orderBy) params += `?order=${BcpStore.orderBy}`;
      if (BcpStore.orderItem) params += `&order_by=${BcpStore.orderItem}`;
      // if (BcpStore.searchText) params += `&q=${BcpStore.searchText}`;
      if(RightSidebarLayoutStore.filterPageTag == 'bcm_bcp' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/business-continuity-plans/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_continuity_plan')+".xlsx");
        }
      )
    }

    exportBcpDetails(id) {
      this._http.get('/business-continuity-plans/'+id+'/pdf-export', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, BcpStore.bcpDetails.title+".pdf");
        }
      )
    }

    getWorkflowDetails(id: number): Observable<BcpWorkFlowDetails[]>{
      return this._http.get<BcpWorkFlowDetails[]>('/business-continuity-plans/' + id+'/workflow').pipe(
        map((res: BcpWorkFlowDetails[]) => {
          BcpStore.setBcpWorkflow(res);
          return res;
        })
      );
    }

    getWorkflowHistory(id: number): Observable <WorkflowHistoryPagination>{
      let params = '';
      params = `?page=${BcpStore.workflowHistoryPage}`;
      return this._http.get<WorkflowHistoryPagination>('/business-continuity-plans/'+id+'/workflow-history' + (params ? params : '')).pipe(
        map((res: WorkflowHistoryPagination) => {
          BcpStore.setBcpWorkflowHistory(res);
          return res;
        })
      );
    }

    approveWorkflow(id, data){
      return this._http.put('/business-continuity-plans/'+id+'/approve',data).pipe(
        map((res: any) => {
          this._utilityService.showSuccessMessage('success', 'bcp_workflow_approved');
          // BcpStore.setBcpWorkflowHistory(res);
          return res;
        })
      );
    }

    revertWorkflow(id,data){
      return this._http.put('/business-continuity-plans/'+id+'/revert',data).pipe(
        map((res: any) => {
          this._utilityService.showSuccessMessage('success', 'bcp_workflow_reverted');
          return res;
        })
      );
    }

    submitForWorkflow(id: number){
      return this._http.put('/business-continuity-plans/'+ id +'/submit',null).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'bcp_submitted');
          return res;
        })
      );
    }
  
  
    importData(data){
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/business-continuity-plans/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','bcp_imported');
          return res;
        })
      )
    }
  
    shareData(data) {
      return this._http.post('/business-continuity-plans/share', data).pipe(
        map((res: any) => {
          this._utilityService.showSuccessMessage('success', 'bcp_shared');
          return res;
        })
      )
    }
  
    sortBcpList(type:string) {
      if (!BcpStore.orderBy) {
        BcpStore.orderBy = 'asc';
        BcpStore.orderItem = type;
      }
      else{
        if (BcpStore.orderItem == type) {
          if(BcpStore.orderBy == 'asc') BcpStore.orderBy = 'desc';
          else BcpStore.orderBy = 'asc'
        }
        else{
          BcpStore.orderBy = 'asc';
          BcpStore.orderItem = type;
        }
      }
    }

    setBcpContents(contents){
      if(contents.change_request.length > 0 && contents.change_request[0].contents.length > 0){
        for(var i = 0; i < contents.contents.length; i++){
          if(contents.change_request[0].contents.hasOwnProperty(i)){
            let titleDifference = diffStringsRaw(contents.contents[i].title, contents.change_request[0].contents[i].title, true);
            // let descDifference = diffStringsRaw(contents.contents[i].description, contents.change_request[0].contents[i].description, true);
            let titles = this.identifyDifferences(titleDifference);
            // let descriptions = this.identifyDifferences(descDifference);
            contents.contents[i].dtitle = titles.a;
            contents.change_request[0].contents[i].dtitle = titles.b;
            // contents.contents[i].ddescription = descriptions.a;
            // contents.change_request[0].contents[i].ddescription = descriptions.b;
          }
          if(contents.contents[i].children.length > 0 && contents.change_request[0].contents.indexOf(i) != -1){
            this.checkforSubItems(contents.contents[i].children,contents.change_request[0].contents[i].children)
          }
        }
        BcpStore.setBcpContents(contents);
      }
      else{
        BcpStore.setBcpContents(contents);
      }
    }

    checkforSubItems(cdata,crData){
      if(cdata.length > 0 && crData.length > 0){
        for(var i = 0; i < cdata.length; i++){
          if(crData.hasOwnProperty(i)){
            let titleDifference = diffStringsRaw(cdata[i].title, crData[i].title, true);
            // let descDifference = diffStringsRaw(cdata[i].description, crData[i].description, true);
            let titles = this.identifyDifferences(titleDifference);
            // let descriptions = this.identifyDifferences(descDifference);
            cdata[i].dtitle = titles.a;
            crData[i].dtitle = titles.b;
            // cdata[i].ddescription = descriptions.a;
            // crData[i].ddescription = descriptions.b;
          }
          if(cdata[i].children.length > 0 && crData.index(i) != -1){
            this.checkforSubItems(cdata[i].children,crData[i].children);
          }
        }
      }
    }
  
    identifyDifferences(difference){
      let a_string = '';
      let b_string = '';
      for(let i of difference){
        switch(i[0]){
          case -1: a_string = a_string+"<span class='remove-text'>"+i[1]+'</span>';
            break;
          case 0: a_string = a_string+i[1];
                  b_string = b_string+i[1];
            break;
          case 1: b_string = b_string+"<span class='add-text'>"+i[1]+'</span>';
            break;
        }
      }
      return { a: a_string, b: b_string };
    }
}
