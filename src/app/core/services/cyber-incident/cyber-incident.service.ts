import {  Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../general/helper-service/helper-service.service';
import { CyberIncidentStore } from 'src/app/stores/cyber-incident/cyber-incident-store';
import { CyberIncidentPaginationResponse, IndividualCyberIncident,CyberWorkflowDetail, CyberWorkflowHistoryPaginationResponse } from '../../models/cyber-incident/cyber-incident';
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import {CyberReport} from 'src/app/core/models/cyber-incident/cyber-incident-report'
import { CyberReportStore } from 'src/app/stores/cyber-incident/cyber-incident-report';
@Injectable({
  providedIn: 'root'
})
export class CyberIncidentService {
  DownloadProgressStore=DownloadProgressStore;
  CyberReportStore=CyberReportStore;
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,

    private _helperService: HelperServiceService) { }

  getAllItems(getAll: boolean = false, additionalParams?: string): Observable<CyberIncidentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CyberIncidentStore.currentPage}`;
      if (CyberIncidentStore.orderBy) params += `&order=${CyberIncidentStore.orderBy}`;
      if (CyberIncidentStore.orderItem) params += `&order_by=${CyberIncidentStore.orderItem}`;
      if (CyberIncidentStore.searchText) params += `&q=${CyberIncidentStore.searchText}`;
    }
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'cyber_incident' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CyberIncidentPaginationResponse>('/cyber-incident/cyber-incidents' + (params ? params : '')).pipe(
      map((res: CyberIncidentPaginationResponse) => {
        CyberIncidentStore.setAllCyberIncident(res);
        return res;
      })
    );
  }

  updateItem(framework_id:number, framework): Observable<any> {
    return this._http.put('/cyber-incident/cyber-incidents/'+ framework_id, framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_incident_updated');
        this.getAllItems(false,'status=all').subscribe();
        this.getItem(framework_id).subscribe();
        return res;
      })
    );
  }

  saveItem(framework): Observable<any> {
    return this._http.post('/cyber-incident/cyber-incidents', framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_incident_added');
        this.getAllItems(false,'status=all').subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    let params='';
    if(RightSidebarLayoutStore.filterPageTag == 'cyber_incident' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/cyber-incident/cyber-incidents/export'+(params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('cyber_incident')+".xlsx");     
      }
    )
  }

  getItem(id: number):
    Observable<IndividualCyberIncident> {
    return this._http.get<IndividualCyberIncident>('/cyber-incident/cyber-incidents/' + id).pipe(
      map((res: IndividualCyberIncident) => {
        CyberIncidentStore.setCyberIncidentDetails(res);
        return res;
      })
    );

  }

  delete(id: number,BAId?) {
    return this._http.delete('/cyber-incident/cyber-incidents/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_incident_deleted');
            this.getAllItems(false).subscribe();
        return res;
      })
    );
  }

  getThumbnailPreview(type,token,h?:number,w?:number){
		// +(h && w)?'&h='+h+'&w='+w:''
		switch(type){
		  case 'cyber_incident': return environment.apiBasePath+ '/cyber-incident/files/cyber-incident-document/thumbnail?token='+token;
			break;
      case 'corrective-action': return environment.apiBasePath+ '/cyber-incident/files/cyber-incident-corrective-action-document/thumbnail?token='+token;
			break;
      case 'corrective-action-history': return environment.apiBasePath+ '/cyber-incident/files/cyber-incident-corrective-action-update-document/thumbnail?token='+token;
			break;
		  case 'document-version': return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
			break;
      case 'corrective-action-history': return environment.apiBasePath+ '/cyber-incident/files/cyber-incident-corrective-action-update-document/thumbnail?token='+token;
	
		}
	  }

	  downloadFile(frequencyId,type,file_id?, doc_id?, file_name?, fileDetails?, update_id?) {
		var downloadURL = "";
	   switch(type){
		 case 'cyber_incident' : downloadURL = environment.apiBasePath+'/cyber-incident/cyber-incidents/'+`${frequencyId}`+'/files/'+`${file_id}`+'/download';
		   break;
    case 'corrective-action-history' : downloadURL = environment.apiBasePath+'/cyber-incident/cyber-incident-corrective-actions/'+`${frequencyId}`+'/updates/'+`${update_id}`+'/files/'+`${doc_id}`+'/download';
		   break;
    case 'corrective-action' : downloadURL = environment.apiBasePath+'/cyber-incident/cyber-incident-corrective-actions/'+`${frequencyId}`+'/files/'+`${doc_id}`+'/download';
		   break;
		  // /api/v1/strategy-reviews/$strategyReviewFrequencyTargetId/files/$fileId/download
		
	   }
	   if(downloadURL){
		this.downloadFileByURL(downloadURL,type,fileDetails);
	  }
	}

	getPreview(type,id,doc_id,update_id?){

    var previewURL = "";
    switch(type){   
      case 'cyber_incident': previewURL = environment.apiBasePath+ '/cyber-incident/cyber-incidents/'+`${id}`+'/files/'+`${doc_id}`+'/preview'
        break;  
      case 'corrective-action-history': previewURL = environment.apiBasePath + '/cyber-incident/cyber-incident-corrective-actions/' +`${id}`+ '/updates/'+`${update_id}`+'/files/'+`${doc_id}`+'/preview'
        break;
      case 'corrective-action': previewURL = environment.apiBasePath + '/cyber-incident/cyber-incident-corrective-actions/'+`${id}`+'/files/'+`${doc_id}`+'/preview'
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
    
		// let previewURL= environment.apiBasePath+'/cyber-incident/cyber-incidents/'+`${id}`+'/files/'+`${file_id.id}`+'/preview'
	
		// if(previewURL){
		//   try{
		// 	return this._http.get(previewURL, { responseType: 'blob' as 'json' });
		//   }
		//   catch(e){
		// 	console.log(e);
		//   }
		// }
	  }

  


  getWorkflowItems(id)
  {
    return this._http.get<CyberWorkflowDetail>('/cyber-incident/cyber-incidents/'+id+'/workflow').pipe((
      map((res:CyberWorkflowDetail)=>{
        CyberIncidentStore.setWorkflowDetails(res);
        return res;
      })
    ))
  }
  getHistory(id): Observable<CyberWorkflowHistoryPaginationResponse> {
    let params = '';
      params = `?page=${CyberIncidentStore.currentPage}`;
    return this._http.get<CyberWorkflowHistoryPaginationResponse>('/cyber-incident/cyber-incidents/'+id+'/workflow-history' + (params ? params : '')).pipe(
      map((res: CyberWorkflowHistoryPaginationResponse) => {
        CyberIncidentStore.setWorkflowHistory(res);
        return res;
      })
    );
  }

  submitIncident(id,item?) {
    return this._http.put('/cyber-incident/cyber-incidents/' + id+'/submit',id,item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'cyber_incident_submitted');
        //this.getItem(id).subscribe();
        return res;
      })
    );
  }

  approveWorkflow(id,comment) {
    return this._http.put('/cyber-incident/cyber-incidents/' + id+'/approve',comment).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'cyber_incident_approved');
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  revertWorkflow(id,data) {
    return this._http.put('/cyber-incident/cyber-incidents/' + id+'/revert',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'cyber_incident_reverted');
        this.getItem(id).subscribe();
        return res;
      })
    );
  }
  rejectProject(id,data) {
    return this._http.put('/cyber-incident/cyber-incidents/' + id+'/reject',data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'cyber_incident_rejected');
        this.getItem(id).subscribe();
        return res;
      })
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

  exportToPdf(id) {
     
    this._http.get('/cyber-incident/cyber-incidents/'+id+'/reports/export-pdf/'+CyberReportStore?.reportId, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, "Incident-Report.pdf");
      }
    )
  }

  getReport(): Observable<any> {
    return this._http.get<any>(`/cyber-incident/cyber-incidents/${CyberIncidentStore.incidentId}/reports`).pipe((
      map((res:any)=>{
        if(res?.data.length)
        {
          CyberReportStore.setReportId(res.data[0].id);
        }
        return res;
      })
    ))
  } 

  getReportDetails(): Observable<any> {
    return this._http.get<any>(`/cyber-incident/cyber-incidents/${CyberIncidentStore.incidentId}/reports/`+CyberReportStore?.reportId).pipe((
      map((res:any)=>{
        
          CyberReportStore.setCyberReport(res);
        
        return res;
      })
    ))
  } 

  generateReport(){
    return this._http.post(`/cyber-incident/cyber-incidents/${CyberIncidentStore.incidentId}/reports`,null).pipe(
      map((res:any )=> {
        CyberReportStore.setReportId(res.id);
        this._utilityService.showSuccessMessage('success', 'generate_report_message');
        return res;
      })
    );
  }

  deleteReport(id: number,BAId?) {
    return this._http.delete(`/cyber-incident/cyber-incidents/${CyberIncidentStore.incidentId}/reports/`+id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_incident_report_deleted');
            //this.getAllItems(false).subscribe();
        return res;
      })
    );
  }

  addReportComment(id, data) {
    return this._http.put(`/cyber-incident/cyber-incidents/${CyberIncidentStore.incidentId}/reports/`+id,data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_incident_conclusion_added');
            this.getReport().subscribe();
        return res;
      })
    );
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

}


