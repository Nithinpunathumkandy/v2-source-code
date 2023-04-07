import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { CAActionPlanPaginationResponse, CAActionPlanDetails,HistoryResponse,ActionPlans} from 'src/app/core/models/business-assessments/control-assessment/control-assessment-action-plan';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CAActionPlanStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-action-plan-store';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ControlAssessmentDetailsStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment-details-store';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ControlAssessmentActionPlanService {
  ControlAssessmentDetailsStore=ControlAssessmentDetailsStore;
  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<CAActionPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CAActionPlanStore.currentPage}`;
      if (CAActionPlanStore.orderBy) params += `&order=${CAActionPlanStore.orderBy}`;
      if (CAActionPlanStore.orderItem) params += `&order_by=${CAActionPlanStore.orderItem}`;
      if (CAActionPlanStore.searchText) params += `&q=${CAActionPlanStore.searchText}`;
    }
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(ControlAssessmentDetailsStore?.assessmentId)
    {
      params = (params == '') ? params + `?control_assessment_ids=${ControlAssessmentDetailsStore?.assessmentId}&control_ids=${ControlAssessmentDetailsStore?.controlId}` : params + `&control_assessment_ids=${ControlAssessmentDetailsStore?.assessmentId}&control_ids=${ControlAssessmentDetailsStore?.controlId}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'control_assessment_action_plan' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CAActionPlanPaginationResponse>('/control-assessment-action-plans' + (params ? params : '')).pipe(
      map((res: CAActionPlanPaginationResponse) => {
        CAActionPlanStore.setCAActionPlans(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<CAActionPlanDetails> {
    return this._http.get<CAActionPlanDetails>('/control-assessment-action-plans/' + id).pipe(
      map((res: CAActionPlanDetails) => {
        CAActionPlanStore.setCAActionPlanDetails(res);
        return res;
      })
    );
  }

  updateItem(framework_id:number, framework): Observable<any> {
    return this._http.put('/control-assessment-action-plans/'+ framework_id, framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_actionplan_updated');
        
        this.getItems(false,'status=all').subscribe();
        // this.getItem(framework_id).subscribe();

        return res;
      })
    );
  }

  saveItem(framework): Observable<any> {
    return this._http.post('/control-assessment-action-plans', framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_actionplan_created');
        if(ControlAssessmentDetailsStore?.assessmentId && ControlAssessmentDetailsStore?.controlId)
        {
          this.getItems(false,'status=all').subscribe();
        }
        
        return res;
      })
    );
  }

  delete(id: number,BAId?) {
    return this._http.delete('/control-assessment-action-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_actionplan_deleted');
        this.getItems(false, BAId? BAId : 'status=all').subscribe((resp) => {
          if (resp.from == null) {
            CAActionPlanStore.setCurrentPage(resp.current_page - 1);
            this.getItems(false, BAId? BAId : 'status=all').subscribe();
          }
        });
        return res;
      })
    );
  }

  

  generateTemplate() {
    this._http.get('/control-assessment-action-plans/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('control_assessment_action_plan_template')+".xlsx");     
      }
    )
  }

  exportToExcel() {
    let params='';
    if(ControlAssessmentDetailsStore?.assessmentId)
    {
      params = (params == '') ? params + `?control_assessment_ids=${ControlAssessmentDetailsStore?.assessmentId}&control_ids=${ControlAssessmentDetailsStore?.controlId}` : params + `&control_assessment_ids=${ControlAssessmentDetailsStore?.assessmentId}&control_ids=${ControlAssessmentDetailsStore?.controlId}`;
    }
    this._http.get('/control-assessment-action-plans/export'+(params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Control Assessment Action Plan')+".xlsx");     
      }
    )
  }

  getCaHistory(ca_id: number): Observable<HistoryResponse> {
    return this._http.get<HistoryResponse>('/control-assessment-action-plans/'+ca_id+'/updates'
    ).pipe(
      map((res: HistoryResponse) => {
        CAActionPlanStore.setActionPlanHistory(res);
        return res;
      })
    );
  }

  updateActionPlanStatus(actionplanId: number, data): Observable<any> {
    return this._http
      .post("/control-assessment-action-plans/" + actionplanId + "/updates", data)
      .pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            "success",
            "cyber_action_plan_status_updated"
          );
          this.getItem(actionplanId).subscribe();
          return res;
        })
      );
  }

  
       /**
   * Sort Framework List
   * @param type Sort By Variable
   */
  sortActionPlanList(type, callList: boolean = true) {
    if (!CAActionPlanStore.orderBy) {
      CAActionPlanStore.orderBy = 'asc';
      CAActionPlanStore.orderItem = type;
    }
    else {
      if (CAActionPlanStore.orderItem == type) {
        if (CAActionPlanStore.orderBy == 'asc') CAActionPlanStore.orderBy = 'desc';
        else CAActionPlanStore.orderBy = 'asc'
      }
      else {
        CAActionPlanStore.orderBy = 'asc';
        CAActionPlanStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'status=all').subscribe();
  }

  getThumbnailPreview(type, token, h?: number, w?: number) {
    
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
        
        case 'control-assessment-action-plan-update-document': return environment.apiBasePath+ '/business-assessment/files/control-assessment-action-plan-update-document/thumbnail?token='+token;
          break; 
       
    }
  }

  //Get File Preview 
    getFilePreview(type,id,file_id?,doc_id?){
    var previewURL = "";
    switch(type){   
      case 'control-assessment-action-plan-update-document': previewURL = environment.apiBasePath+ '/control-assessment-action-plans/'+`${id}`+'/updates/'+`${doc_id}`+'/files/'+`${file_id}`+'/preview'
        break;  
        
    }
    if(previewURL){
      try{
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch(e){
        console.log(e);
      }
    }
  }

  //Download File
  downloadFile(type, id, file_id?, doc_id?, file_name?, fileDetails?) {
    
    var downloadURL = "";
   switch(type){
    case 'control-assessment-action-plan-update-document' : downloadURL = environment.apiBasePath+`/control-assessment-action-plans/${id}/updates/${doc_id}/files/${file_id}/download`;
      break;  
   
     
   }
   if(downloadURL){
     //this.downloadFileByURL(downloadURL,type,fileDetails);
     if(file_name && fileDetails)
      this.downloadFileByURL(downloadURL,type,fileDetails);          
      else
        this.downloadFileByURL(downloadURL,type,file_name);
   }
 }

 download(fileSrc,type,fileDetails?){
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });
  const options = {
    headers: headers,
    reportProgress: true,
    observe: true
  };
  const req = new HttpRequest('GET', fileSrc, options, { responseType: 'blob' });
  return this._http.request(req).pipe(
    map((res:any)=>{
      return res;
    }),
  );
}

downloadFileByURL(fileSrc,type,fileDetails?){
  var responseType = 'blob';
  var fileDetailsObject = {
    fileExtension: '',
    fileName: '',
    fileSize: '',
    downloadProgress : '',
    message:'',
    position: null
  };
  if(fileDetails){
    fileDetailsObject.fileExtension = fileDetails.ext;
    fileDetailsObject.fileName = fileDetails.title;
    fileDetailsObject.fileSize = fileDetails.size;
    fileDetailsObject.downloadProgress = '0%';
    fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
  }
  else{
    fileDetailsObject.fileExtension = 'zip';
    fileDetailsObject.fileName = 'allfiles.zip';
    fileDetailsObject.fileSize = null;
    fileDetailsObject.downloadProgress = '0%';
    fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
  }
  DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
  this.download(fileSrc,responseType).subscribe((event: HttpEvent<any>) => {
    let downloadEvent: any = event;
    switch (downloadEvent.type) {
      case HttpEventType.DownloadProgress:
        let downloadProgress = downloadEvent.total ? Math.round((100 * downloadEvent.loaded) / downloadEvent.total) : 0;
        DownloadProgressStore.setDownloadProgress(downloadProgress,fileDetailsObject.position);
        break;
      case HttpEventType.Response:
        this._utilityService.downloadFile(downloadEvent.body,fileDetails?.title ? fileDetails.title : fileDetails+'.zip');
        //setTimeout(() => {
          //DownloadProgressStore.setDownloadProgress(100);
          DownloadProgressStore.setDownloadProgress(100,fileDetailsObject.position);
          DownloadProgressStore.setDownloadMessage('Download Successful',fileDetailsObject.position);
        // }, 10000);
        //break;
    }
  },(error=>{
    DownloadProgressStore.setDownloadMessage('Download Failed',fileDetailsObject.position);
    //DownloadProgressStore.clearDownloadFileDetails();
    //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
  }))
}

}
