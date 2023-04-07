import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpRequest, HttpEvent, HttpEventType } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from "src/app/shared/services/utility.service";
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from "src/app/stores/general/download-progress.store";
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { AssetMaintenanceStore } from 'src/app/stores/asset-management/asset-register/asset-maintenance-store';

@Injectable({
  providedIn: 'root'
})
export class AssetManagementService {
  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getThumbnailPreview(type, token, h?: number, w?: number,schedule_id?,shutdown_id?) {
    // +(h && w)?'&h='+h+'&w='+w:''
    switch (type) {
      case 'maintenance-schedule': return environment.apiBasePath + '/asset-management/files/asset-maintenance-schedule-update-document/thumbnail?token=' + token;
        break;
        case 'maintenance-shutdown': return environment.apiBasePath + '/asset-management/files/asset-maintenance-schedule-shutdown-update-document/thumbnail?token=' + token;
        break;
     
    }
  }

  //Get File Preview 
  getFilePreview(type, file_id?, doc_id?,schedule_id?,shutdown_id?) {
    var previewURL = "";
    switch (type) {
      case 'maintenance-schedule': previewURL = environment.apiBasePath + '/asset-maintenances/'+`${AssetMaintenanceStore.maintenanceId}`+'/schedules/'+`${schedule_id}`+'/updates/'+`${doc_id}`+'/files/'+`${file_id}`+'/preview'
        break;
        case 'maintenance-shutdown': previewURL = environment.apiBasePath + '/asset-maintenances/'+`${AssetMaintenanceStore.maintenanceId}`+'/schedules/'+`${schedule_id}`+'/shutdowns/'+`${shutdown_id}`+'/updates/'+`${doc_id}`+'/files/'+`${file_id}`+'/preview'
        break;

    }
    if (previewURL) {
      try {
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch (e) {
      }
    }
  }

  //Download File
  downloadFile(type, file_id?, file_name?, individual_file_id?, fileDetails?,schedule_id?,shutdown_id?) {
    var downloadURL = "";
    switch (type) { 
      case 'maintenance-schedule': downloadURL = environment.apiBasePath + '/asset-maintenances/'+`${AssetMaintenanceStore.maintenanceId}`+'/schedules/'+`${schedule_id}` + '/updates/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
        break;
        case 'maintenance-shutdown': downloadURL = environment.apiBasePath + '/asset-maintenances/'+`${AssetMaintenanceStore.maintenanceId}`+'/schedules/'+`${schedule_id}`+'/shutdowns/'+`${shutdown_id}` + '/updates/' + `${file_id}` + '/files/' + `${individual_file_id}` + '/download';
        break;
      


    }
    if (downloadURL) {
      // this._http.get(downloadURL, { responseType: 'blob' as 'json' }).subscribe(response => {
      //   this._utilityService.downloadFile(response, file_name);
      // }, (error => {
      //   if (error.status == 403) {
      //     this._utilityService.showErrorMessage('Error', 'Permission Denied');
      //   }
      // }) 
      // )

      // this.downloadFileByURL(downloadURL, type, fileDetails)
      if (file_name && fileDetails)
        this.downloadFileByURL(downloadURL, type, fileDetails);
      else
        this.downloadFileByURL(downloadURL, type, file_name);
    }
  }

  /**
  * Function to get file download progress
  * Under development
  */
  downloadFileByURL(fileSrc, type, fileDetails?) {
    var responseType = 'blob';
    var fileDetailsObject = {
      fileExtension: '',
      fileName: '',
      fileSize: '',
      downloadProgress: '',
      message: '',
      position: null
    };
    // if (fileDetails) {
    //   fileDetailsObject.fileExtension = fileDetails.ext;
    //   fileDetailsObject.fileName = fileDetails.title;
    //   fileDetailsObject.fileSize = fileDetails.size;
    //   fileDetailsObject.downloadProgress = '0%';
    //   fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    // }
    // else {
    //   fileDetailsObject.fileExtension = 'zip';
    //   fileDetailsObject.fileName = 'allfiles.zip';
    //   fileDetailsObject.fileSize = null;
    //   fileDetailsObject.downloadProgress = '0%';
    //   fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    // }
    if (fileDetails && (typeof fileDetails !== 'string')) {
      fileDetailsObject.fileExtension = fileDetails.ext;
      fileDetailsObject.fileName = fileDetails.title;
      fileDetailsObject.fileSize = fileDetails.size;
      fileDetailsObject.downloadProgress = '0%';
      fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    }
    else {
      fileDetailsObject.fileExtension = 'zip';
      fileDetailsObject.fileName = fileDetails + '.zip';
      fileDetailsObject.fileSize = null;
      fileDetailsObject.downloadProgress = '0%';
      fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    }
    DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
    this.download(fileSrc, responseType).subscribe((event: HttpEvent<any>) => {
      let downloadEvent: any = event;
      switch (downloadEvent.type) {
        case HttpEventType.DownloadProgress:
          let downloadProgress = downloadEvent.total ? Math.round((100 * downloadEvent.loaded) / downloadEvent.total) : 0;
          DownloadProgressStore.setDownloadProgress(downloadProgress, fileDetailsObject.position);
          break;
        case HttpEventType.Response:
          this._utilityService.downloadFile(downloadEvent.body, fileDetails?.title ? fileDetails.title : 'allfiles.zip');
          //setTimeout(() => {
          //DownloadProgressStore.setDownloadProgress(100);
          DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
          DownloadProgressStore.setDownloadMessage('Download Successful', fileDetailsObject.position);
        // }, 10000);
        //break;
      }
    }, (error => {
      DownloadProgressStore.setDownloadMessage('Download Failed', fileDetailsObject.position);
      //DownloadProgressStore.clearDownloadFileDetails();
      //DownloadProgressStore.setMessage('Download Failed',fileDetailsObject.position);
    }))
  }

  download(fileSrc, type, fileDetails?) {
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
      map((res: any) => {
        return res;
      }),
    );
  }
}
