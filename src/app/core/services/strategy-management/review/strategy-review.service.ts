import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ObjectiveResponse } from 'src/app/core/models/strategy-management/strategy.model';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyReviewStore } from 'src/app/stores/strategy-management/review.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Observable } from 'rxjs';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';



@Injectable({
  providedIn: 'root'
})
export class StrategyReviewService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

    getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ObjectiveResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${StrategyReviewStore.currentPage}`;
        if (StrategyReviewStore.orderBy) params += `&order_by=${StrategyReviewStore.orderItem}&order=${StrategyReviewStore.orderBy}`;
  
      }
      if(additionalParams) params += additionalParams;
      if(StrategyReviewStore.searchText) params += (params ? '&q=' : '?q=')+StrategyReviewStore.searchText;
      if(is_all) params += '&status=all';
      if(RightSidebarLayoutStore.filterPageTag == 'strategy_reviews`' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<ObjectiveResponse>('/strategy-reviews' + (params ? params : '')).pipe(
        map((res: ObjectiveResponse) => {
          StrategyReviewStore.setObjectives(res);
          return res;
        }) 
      );
   
    }


    addKpiMesure(item){
      return this._http.put('/strategy-reviews/'+StrategyStore.objectiveId ,item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'Kpi Mesure Added');
          // this.getItems().subscribe();
          return res;
        })
      );
    }


      getThumbnailPreview(type,token,h?:number,w?:number){
    // +(h && w)?'&h='+h+'&w='+w:''
    switch(type){
      case 'kpi-measure': return environment.apiBasePath+ '/strategy-management/files/strategy-review-document/thumbnail?token='+token;
        break;
        case 'document-version': return environment.apiBasePath + '/knowledge-hub/files/document-version/thumbnail?token=' + token +'&h='+(h ? h : '')+'&w='+(w ? w : '');
        break;
        case  'plan-measure' : return environment.apiBasePath+ '/strategy-management/files/strategy-initiative-review-document/thumbnail?token='+token;
        break;
        case 'objective-measure': return environment.apiBasePath+ '/strategy-management/files/strategy-profile-objective-review-document/thumbnail?token='+token;
        break;
    }
  }

  downloadFile(frequencyId,type,file_id?, doc_id?, file_name?, fileDetails?) {
    var downloadURL = "";
   switch(type){
     case 'kpi-document' : downloadURL = environment.apiBasePath+'/strategy-reviews/'+`${frequencyId}`+'/files/'+`${file_id}`+'/download';
       break;
       case 'plan-measure' : downloadURL = environment.apiBasePath+'/strategy-initiative-reviews/'+`${frequencyId}`+'/files/'+`${file_id}`+'/download';
       break;
       case 'objective-document' : downloadURL = environment.apiBasePath+'/strategy-reviews/'+`${frequencyId}`+'/files/'+`${file_id}`+'/download';
       break;

       
      // /api/v1/strategy-reviews/$strategyReviewFrequencyTargetId/files/$fileId/download
    
   }
   if(downloadURL){
    this.downloadFileByURL(downloadURL,type,fileDetails);
  }
  }

  savePlanMesure(item){
    return this._http.put('/strategy-initiative-reviews/'+StrategyInitiativeStore.selectedInitiativeId ,item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Kpi Mesure Added');
        // this.getItems().subscribe();
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
          this._utilityService.downloadFile(downloadEvent.body,fileDetails?.title ? fileDetails.title : 'allfiles.zip');
          //setTimeout(() => {
            //DownloadProgressStore.setDownloadProgress(100);
            DownloadProgressStore.setDownloadProgress(100,fileDetailsObject.position);
            DownloadProgressStore.setDownloadMessage('Download Successful',fileDetailsObject.position);
          // }, 10000);
          //break;
      }
    },(error=>{
      // console.log(error);
      DownloadProgressStore.setDownloadMessage('Download Failed',fileDetailsObject.position);
      //DownloadProgressStore.clearDownloadFileDetails();
      //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
    }))
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

  getFilePreview(file_id,frequencyId){
    
    let previewURL= environment.apiBasePath+'/strategy-reviews/'+`${frequencyId}`+'/files/'+`${file_id.id}`+'/preview'

    if(previewURL){
      try{
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch(e){
        console.log(e);
      }
    }
  }

  getObjectiveFilePreview(file_id,frequencyId){
    
    let previewURL= environment.apiBasePath+'/strategy-profile-objective-review-targets/'+`${frequencyId}`+'/files/'+`${file_id.id}`+'/preview'

    if(previewURL){
      try{
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch(e){
        console.log(e);
      }
    }
  }

  getPlanFilePreview(file_id,frequencyId){
    
    let previewURL= environment.apiBasePath+'/strategy-initiative-reviews/'+`${frequencyId}`+'/files/'+`${file_id.id}`+'/preview'

    if(previewURL){
      try{
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch(e){
        console.log(e);
      }
    }
  }
}
