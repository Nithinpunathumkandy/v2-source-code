import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HistoryResponse, MockDrillActionPlanDetails, MockDrillActionPlanPaginationResponse, MockDrillActionPlans } from 'src/app/core/models/mock-drill/mock-drill-action-plan/mock-drill-action-plan';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MockDrillActionPlanStore } from 'src/app/stores/mock-drill/mock-drill-action-plan/mock-drill-action-plan-store';
import { environment } from 'src/environments/environment';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MockDrillActionPlanService {
  itemChange: EventEmitter<number> = new EventEmitter();
  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { }
  getItems(
    getAll: boolean = false,
    additionalParams?: string
  ): Observable<MockDrillActionPlanPaginationResponse> {
    let params = "";
    if (!getAll) {
      params = `?page=${MockDrillActionPlanStore.currentPage}&status=all`;
      if (MockDrillActionPlanStore.orderBy)
        params += `&order_by=${MockDrillActionPlanStore.orderItem}&order=${MockDrillActionPlanStore.orderBy}`;
    }
    if (additionalParams) params += additionalParams;
    if (MockDrillActionPlanStore.searchText)
      params += (params ? "&q=" : "?q=") + MockDrillActionPlanStore.searchText;
    if (
      RightSidebarLayoutStore.filterPageTag == "action_plan" &&
      RightSidebarLayoutStore.filtersAsQueryString
    )
      params =
        params == ""
          ? "?" + RightSidebarLayoutStore.filtersAsQueryString
          : params + "&" + RightSidebarLayoutStore.filtersAsQueryString;
    return this._http
      .get<MockDrillActionPlanPaginationResponse>(
        "/mock-drill/mock-drill-action-plans" + (params ? params : "")
      )
      .pipe(
        map((res: MockDrillActionPlanPaginationResponse) => {
          MockDrillActionPlanStore.setActionPlans(res);
          return res;
        })
      );
  }

  getItem(id: number): Observable<MockDrillActionPlanDetails> {
    return this._http.get<MockDrillActionPlanDetails>("/mock-drill/mock-drill-action-plans/" + id).pipe(
      map((res: MockDrillActionPlanDetails) => {
        MockDrillActionPlanStore.setIndividualActionPlansDetails(res);
        return res;
      })
    );
  }
  saveItem(data): Observable<any> {
    return this._http.post("/mock-drill/mock-drill-action-plans", data).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "action_plan_is_added"
        );
        return res;
      })
    );
  }

  updateItem(actionPlan_id: number, data: MockDrillActionPlans): Observable<any> {
    return this._http.put("/mock-drill/mock-drill-action-plans/" + actionPlan_id, data).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "action_plan_has_been_updated"
        );
        // this.getItems().subscribe();
        return res;
      })
    );
  }
  delete(id: number) {
    return this._http.delete("/mock-drill/mock-drill-action-plans/" + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          "success",
          "action_plan_has_been_deleted"
        );
        return res;
      })
    );
  }
  setDocumentDetails(imageDetails, url) {
    MockDrillActionPlanStore.setDocumentDetails(imageDetails, url);
  }
  updateProgressItem(actionplanId: number, data): Observable<any> {
    return this._http
      .post("/mock-drill/mock-drill-action-plans/" + actionplanId + "/updates", data)
      .pipe(
        map((res) => {
          this._utilityService.showSuccessMessage(
            "success",
            "action_plan_status_updated"
          );
          this.getItem(actionplanId).subscribe();
          return res;
        })
      );
  }
  //Download File
  downloadFile(type, id, file_id?, doc_id?, file_name?, fileDetails?) {

    var downloadURL = "";
    switch (type) {
      case 'action-plan': downloadURL = environment.apiBasePath + '/mock-drill/mock-drill-action-plans/' + `${id}` + '/files/' + `${file_id}` + '/download';
        break;

    }
    if (downloadURL) {
      //this.downloadFileByURL(downloadURL,type,fileDetails);
      if (file_name && fileDetails)
        this.downloadFileByURL(downloadURL, type, fileDetails);
      else
        this.downloadFileByURL(downloadURL, type, file_name);
    }
  }

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
    if (fileDetails) {
      fileDetailsObject.fileExtension = fileDetails.ext;
      fileDetailsObject.fileName = fileDetails.title;
      fileDetailsObject.fileSize = fileDetails.size;
      fileDetailsObject.downloadProgress = '0%';
      fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
    }
    else {
      fileDetailsObject.fileExtension = 'zip';
      fileDetailsObject.fileName = 'allfiles.zip';
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
          this._utilityService.downloadFile(downloadEvent.body, fileDetails?.title ? fileDetails.title : fileDetails + '.zip');
          DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
          DownloadProgressStore.setDownloadMessage('Download Successful', fileDetailsObject.position);
      }
    }, (error => {
      DownloadProgressStore.setDownloadMessage('Download Failed', fileDetailsObject.position);
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
  getThumbnailPreview(type, token, h?: number, w?: number) {
    switch (type) {
      case 'action-plan': return environment.apiBasePath + '/mock-drill/files/mock-drill-action-plan-document/thumbnail?token=' + token;
        break;
    }
  }
  getFilePreview(type, id, file_id?, doc_id?) {
    var previewURL = "";
    switch (type) {
      case 'action-plan': previewURL = environment.apiBasePath + '/mock-drill/mock-drill-action-plans/' + `${id}` + '/files/' + `${file_id}` + '/preview'
        break;

    }
    if (previewURL) {
      try {
        return this._http.get(previewURL, { responseType: 'blob' as 'json' });
      }
      catch (e) {
        console.log(e);
      }
    }
  }
  getHistory(actionplanId: number): Observable<HistoryResponse> {
    let params = '';
    params = `?page=${MockDrillActionPlanStore.currentPage}`;
    if (MockDrillActionPlanStore.orderBy) params += `&order_by=${MockDrillActionPlanStore.historyOrderItem}&order=${MockDrillActionPlanStore.historyOrderBy}`;

    return this._http.get<HistoryResponse>("/mock-drill/mock-drill-action-plans/" + actionplanId + "/updates" + (params ? params : '')).pipe(
      map((res: HistoryResponse) => {
        MockDrillActionPlanStore.setActionPlanHistory(res);
        return res;
      })
    );
  }
}
