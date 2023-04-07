import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from "rxjs/operators";
import { environment } from 'src/environments/environment';
import {
  Processes,
  ProcessDetails,
  ProcessesPaginationResponse,
  ProcessStatusesPaginationResponse,
} from "../../../models/bpm/process/processes";
import {ProcessStore} from '../../../../stores/bpm/process/processes.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';


@Injectable({
  providedIn: 'root'
})
export class ProcessService {
  

  constructor(private _http: HttpClient, private _utilityService: UtilityService, private _helperService: HelperServiceService) { }

  getAllItems(getAll: boolean = false, resparams: string = '',status:boolean = false): Observable<ProcessesPaginationResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${ProcessStore.currentPage}`;
      if (ProcessStore.orderBy) params += `&order=${ProcessStore.orderBy}&order_by=${ProcessStore.orderItem}`;
    }
    if (resparams) params += resparams;
    if(ProcessStore.searchText) params += (params ? '&q=' : '?q=')+ProcessStore.searchText;
    if(RightSidebarLayoutStore.filterPageTag == 'process' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if(RightSidebarLayoutStore.filterPageTag == 'process' && RightSidebarLayoutStore.filtersAsQueryString=='')params+='&status=all'
    return this._http
      .get<ProcessesPaginationResponse>('/processes'+ (params ? params : ''))
      .pipe(
        map((res: ProcessesPaginationResponse) => {
          ProcessStore.setProcesses(res);
          return res;
        })
      );
  }
  

  
    getItemById(id:number):Observable<ProcessDetails>{
      return this._http.get<ProcessDetails>('/processes/' + id).pipe(map((res: ProcessDetails) => {
        ProcessStore.setProcessDetails(res)
        return res;
      }))
  }

    getProcessControlDetails(id:number):Observable<ProcessDetails>{
      return this._http.get<ProcessDetails>('/processes/' + id).pipe(map((res: ProcessDetails) => {
      return res;
    }))
}
  
  // Post Request - save new item
  saveItem(item: Processes) {
    return this._http.post('/processes', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'new_process_created');
        this.getAllItems(false,null,true).subscribe((res) => {
        })
        return res;
      })
    );
  }

  updateItem(id, item: Processes): Observable<any>{
    return this._http.put('/processes/'+id,item).pipe(map(res=>{
      this._utilityService.showSuccessMessage('success', 'process_updated');
      this.getAllItems(false,null,true).subscribe()
      return res;
    }))
  }

  delete(id: number) {
    return this._http.delete("/processes/" + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'process_deleted');
        this.getAllItems(false,null,true).subscribe(resp => {
          if (resp.from == null) {        
            ProcessStore.setCurrentPage(resp.current_page-1);
            this.getAllItems(false,null,true).subscribe();
          }
        });

        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/processes/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'process_activated');
        this.getAllItems(false,null,true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/processes/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'process_deactivated');
        this.getAllItems(false,null,true).subscribe();
        return res;
      })
    );
  }


    saveProcessId(id:number){
      ProcessStore.setProcessId(id);
  }
  // Needs to be Edited
  getThumbnailPreview(token) {
    return environment.apiBasePath + '/human-capital/files/user-profile-picture/thumbnail?token=' + token;
  }

  setProcessFlowDocuments(imageDetails, url) {
    ProcessStore.setProcessFlowDocuments(imageDetails,url);
  }

  setAttachements(imageDetails, url) {
    ProcessStore.setAttachements(imageDetails,url);
  }

  getProcessFlow() {
    return ProcessStore.getProcessFlow;
  }
  getProcessDocuments() {
    return ProcessStore.getAttachement;
  }

  
    /**
   * Sort Control List
   * @param type Sort By Variable
   */
  sortProcessList(type, text) {
    if (!ProcessStore.orderBy) {
      ProcessStore.orderBy = 'asc';
      ProcessStore.orderItem = type;
    }
    else{
      if (ProcessStore.orderItem == type) {
        if(ProcessStore.orderBy == 'asc') ProcessStore.orderBy = 'desc';
        else ProcessStore.orderBy = 'asc'
      }
      else{
        ProcessStore.orderBy = 'asc';
        ProcessStore.orderItem = type;
      }
    }
    if(!text)
      this.getAllItems().subscribe();
    else
    this.getAllItems(false,`&q=${text}&`).subscribe()
  }

  generateTemplate() {
    this._http
      .get("/processes/template", { responseType: "blob" as "json" })
      .subscribe((response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('process_template')+".xlsx");
      });
  }

  exportToExcel() {
    let params = '';
    if (ProcessStore.orderBy) params += `&order=${ProcessStore.orderBy}`;
    if (ProcessStore.orderItem) params += `&order_by=${ProcessStore.orderItem}`;
    if(ProcessStore.searchText) params += (params ? '&q=' : '?q=')+ProcessStore.searchText;
    if(RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http
      .get("/processes/export?status=all"+params, { responseType: "blob" as "json" })
      .subscribe((response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('processes')+".xlsx");
      });
  }
  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/processes/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','process_imported');
        this.getAllItems(false,null).subscribe();
        return res;
      })
    )
  }

  /**
   * Select Processes and Store
   * @param processess Selected Processes
   */
  selectRequiredProcesses(processess){
    var processesToDisplay = [];
    for(let i of processess){
      if(processesToDisplay.length == 0){
        let obj = { process_group: i.process_group_title, values : [{title:i.title,ref_code: i.reference_code, process_category_title: i.process_category_title}], ids: [i.id] };
        processesToDisplay.push(obj);
      }
      else{
        var foundFlag = false;
        processesToDisplay.forEach(element => {
            if(element.process_group == i.process_group_title){
                element.values.push({title:i.title,ref_code: i.reference_code, process_category_title: i.process_category_title});
                element.ids.push(i.id)
                foundFlag = true;
            }
        });
        if(!foundFlag){
            let obj = { process_group: i.process_group_title, values : [{title:i.title,ref_code: i.reference_code, process_category_title: i.process_category_title}], ids: [i.id] };
            processesToDisplay.push(obj);
        }
      }
    }
    ProcessStore.addSelectedProcesses(processess,processesToDisplay);
  }


  getStatusIds(getAll: boolean = false, resparams: string = '',status:boolean = false): Observable<ProcessStatusesPaginationResponse>{
    let params = "";
    // if (!getAll) {
    //   params = `?page=${ProcessStore.currentPage}`;
    //   if (ProcessStore.orderBy) params += `&order=${ProcessStore.orderBy}&order_by=${ProcessStore.orderItem}`;
    // }
    // if (resparams) params += resparams;
    // if(ProcessStore.searchText) params += (params ? '&q=' : '?q=')+ProcessStore.searchText;
    // if(status) params += `&status=all`;
    // if(RightSidebarLayoutStore.filterPageTag == 'process' && RightSidebarLayoutStore.filtersAsQueryString)
    // params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http
      .get<ProcessStatusesPaginationResponse>('/statuses'+ (params ? params : ''))
      .pipe(
        map((res: ProcessStatusesPaginationResponse) => {
          ProcessStore.setStatuses(res);
          return res;
        })
      );
  }
  

}
