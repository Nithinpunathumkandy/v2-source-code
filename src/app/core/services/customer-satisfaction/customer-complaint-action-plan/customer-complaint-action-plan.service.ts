import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CustomerComplaintActionPlanPaginationResponse, IndividualCustomerComplaintActionPlan } from 'src/app/core/models/customer-satisfaction/customer-complaint-action-plans/customer-complaint-action-plans';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { CustomerComplaintActionPlanStore } from 'src/app/stores/customer-engagement/customer-complaint-action-plans/customer-complaint-action-plans-store';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
@Injectable({
  providedIn: 'root'
})
export class CustomerComplaintActionPlanService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService

  ) { }

  /**
  * @description
  * This method is used for getting Customer Complaint Action Plan.
  *
  * @param {*} [param]
  * @returns this api will return a observalble
  * @memberof CustomerComplaintActionPlanService
  */
  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<CustomerComplaintActionPlanPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${CustomerComplaintActionPlanStore.currentPage}`;
      if (CustomerComplaintActionPlanStore.orderBy) params += `&order_by=${CustomerComplaintActionPlanStore.orderItem}&order=${CustomerComplaintActionPlanStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (CustomerComplaintActionPlanStore.searchText) params += (params ? '&q=' : '?q=') + CustomerComplaintActionPlanStore.searchText;
    if (is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'action-plan' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<CustomerComplaintActionPlanPaginationResponse>('/customer-complaint-action-plans' + (params ? params : '')).pipe(
      map((res: CustomerComplaintActionPlanPaginationResponse) => {
        CustomerComplaintActionPlanStore.setCustomerComplaintActionPlans(res);
        return res;
      })
    );

  }

  /**
  * @description
  * This method is used for getting individual Customer Complaint Action Plan details.
  *
  * @param {number} id
  * @returns this api will return a observalble
  * @memberof CustomerComplaintActionPlanService
  */
  getItem(id): Observable<IndividualCustomerComplaintActionPlan> {
    return this._http.get<IndividualCustomerComplaintActionPlan>('/customer-complaint-action-plans/' + id).pipe(
      map((res: IndividualCustomerComplaintActionPlan) => {
        CustomerComplaintActionPlanStore.setIndivitualCustomerComplaintActionPlan(res)
        return res;
      })
    );
  }

  /**
  * @description
  * this method is used for creating Customer Complaint Action Plan
  *
  * @param {*} [data]
  * @returns this api will return a observalble
  * @memberof CustomerComplaintActionPlanService
  */
  saveCustomerComplaintActionPlan(item) {
    return this._http.post('/customer-complaint-action-plans', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'customer_complaint_action_plan_saved');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  /**
   * @description
   * this method is used for updating Customer Complaint Action Plan
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof CustomerComplaintActionPlanService
   */
  updateCustomerComplaintActionPlan(id, item) {
    return this._http.put('/customer-complaint-action-plans/' + id, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('success', 'customer_complaint_action_plan_updated');
        // this.getItem(id).subscribe();
        return res;
      })
    );
  }

  /**
  * @description
  * this method is used for deleting Customer Complaint Action Plan
  * 
  * @param {*} param
  * @returns this api will return a observalble
  * @memberof CustomerComplaintActionPlanService
  */
  delete(id: number) {
    return this._http.delete('/customer-complaint-action-plans/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'customer_complaint_action_plan_deleted');
        // this.getItems().subscribe();
        return res;
      })
    );
  }



  /**
  * @description
  * this method is used for generate Customer Complaint Action Plan template data
  *
  * @param {*} [data]
  * @returns this api will return a observalble
  * @memberof CustomerComplaintActionPlanService
  */
  generateTemplate() {
    this._http.get('/customer-complaint-action-plans/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_action_plan_template') + ".xlsx");
      }
    )
  }

  /**
  * @description
  * this method is used for export Customer Complaint Action Plan Data
  *
  * @param {*} [data]
  * @returns this api will return a observalble
  * @memberof CustomerComplaintActionPlanService
  */
  exportToExcel() {
    let params = '';
    if (CustomerComplaintActionPlanStore.orderBy) params += `?order=${CustomerComplaintActionPlanStore.orderBy}`;
    if (CustomerComplaintActionPlanStore.orderItem) params += `&order_by=${CustomerComplaintActionPlanStore.orderItem}`;
    if(RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/customer-complaint-action-plans/export' + (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('customer_complaint_action_plan') + ".xlsx");
      }
    )
  }



  sortCustomerComplaintActionPlanList(type: string, text: string) {
    if (!CustomerComplaintActionPlanStore.orderBy) {
      CustomerComplaintActionPlanStore.orderBy = 'asc';
      CustomerComplaintActionPlanStore.orderItem = type;
    }
    else {
      if (CustomerComplaintActionPlanStore.orderItem == type) {
        if (CustomerComplaintActionPlanStore.orderBy == 'asc') CustomerComplaintActionPlanStore.orderBy = 'desc';
        else CustomerComplaintActionPlanStore.orderBy = 'asc'
      }
      else {
        CustomerComplaintActionPlanStore.orderBy = 'asc';
        CustomerComplaintActionPlanStore.orderItem = type;
      }
    }
  }

  // //Get File Preview 
  // getFilePreview(type, ca_id?, file_id?) {
  //   var previewURL = "";
  //   switch (type) {
  //     case 'corrective-action': previewURL = environment.apiBasePath + '/customer-complaint-action-plans/' + `${ca_id}` + '/files/' + `${file_id}` + '/preview'
  //       break;
  //   }
  //   if (previewURL) {
  //     try {
  //       return this._http.get(previewURL, { responseType: 'blob' as 'json' });
  //     }
  //     catch (e) {
  //     }
  //   }
  // }

  // //Get Thumbnail Preview according to type and token
  // getThumbnailPreview(type, token, h?: number, w?: number) {
  //   // +(h && w)?'&h='+h+'&w='+w:''
  //   switch (type) {
  //     case 'corrective-action': return environment.apiBasePath + '/customer-engagement/files/customer-complaint-action-plan-document/thumbnail?token=' + token;
  //       break;
  //   }
  //   switch (type) {
  //     case 'corrective-action-update': return environment.apiBasePath + '/customer-engagement/files/customer-complaint-action-plan-update-document/thumbnail?token=' + token;
  //       break;
  //   }
  // }

  // downloadFile(type, ca_id, file_id?, file_name?, fileDetails?) {
  //   var downloadURL = "";
  //   switch (type) {
  //     case 'corrective-action': downloadURL = environment.apiBasePath + '/customer-complaint-action-plans/' + `${ca_id}` + '/files/' + `${file_id}` + '/download';
  //       break;
  //   }
  //   if (downloadURL) {
  //     if (file_name && fileDetails)
  //       this.downloadFileByURL(downloadURL, type, fileDetails);
  //     else
  //       this.downloadFileByURL(downloadURL, type, file_name);
  //   }
  // }

  // downloadFileByURL(fileSrc, type, fileDetails?) {
  //   var responseType = 'blob';
  //   var fileDetailsObject = {
  //     fileExtension: '',
  //     fileName: '',
  //     fileSize: '',
  //     downloadProgress: '',
  //     message: '',
  //     position: null
  //   };

  //   if (fileDetails && (typeof fileDetails !== 'string')) {
  //     fileDetailsObject.fileExtension = fileDetails.ext;
  //     fileDetailsObject.fileName = fileDetails.title;
  //     fileDetailsObject.fileSize = fileDetails.size;
  //     fileDetailsObject.downloadProgress = '0%';
  //     fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
  //   }
  //   else {
  //     fileDetailsObject.fileExtension = 'zip';
  //     fileDetailsObject.fileName = fileDetails + '.zip';
  //     fileDetailsObject.fileSize = null;
  //     fileDetailsObject.downloadProgress = '0%';
  //     fileDetailsObject.position = DownloadProgressStore.downloadFileDetails.length;
  //   }
  //   DownloadProgressStore.setDownloadFileDetails(fileDetailsObject);
  //   this.download(fileSrc, responseType).subscribe((event: HttpEvent<any>) => {
  //     let downloadEvent: any = event;
  //     switch (downloadEvent.type) {
  //       case HttpEventType.DownloadProgress:
  //         let downloadProgress = downloadEvent.total ? Math.round((100 * downloadEvent.loaded) / downloadEvent.total) : 0;
  //         DownloadProgressStore.setDownloadProgress(downloadProgress, fileDetailsObject.position);
  //         break;
  //       case HttpEventType.Response:
  //         this._utilityService.downloadFile(downloadEvent.body, fileDetails?.title ? fileDetails.title : 'allfiles.zip');
  //         DownloadProgressStore.setDownloadProgress(100, fileDetailsObject.position);
  //         DownloadProgressStore.setDownloadMessage('download_succesful', fileDetailsObject.position);

  //     }
  //   }, (error => {
  //     DownloadProgressStore.setDownloadMessage('Download Failed', fileDetailsObject.position);
  //   }))
  // }

  // download(fileSrc, type, fileDetails?) {
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json',
  //   });
  //   const options = {
  //     headers: headers,
  //     reportProgress: true,
  //     observe: true
  //   };
  //   const req = new HttpRequest('GET', fileSrc, options, { responseType: 'blob' });
  //   return this._http.request(req).pipe(
  //     map((res: any) => {
  //       return res;
  //     }),
  //   );
  // }

  getDocuments() {
    return CustomerComplaintActionPlanStore.getUpdateDocumentDetails;
  }

  markAsResolved(ca_id: number, item: any) {
		return this._http.post('/customer-complaint-action-plans/' + ca_id + '/updates', item).pipe(
			map((res: any) => {
				this._utilityService.showSuccessMessage('success', 'ca_status_update_success_message');
				return res;
			})
		);
	}

  setImageDetails(imageDetails, url, type) {
		CustomerComplaintActionPlanStore.setDocumentImageDetails(imageDetails, url, type);
	}

	setSelectedImageDetails(imageDetails, type) {
		CustomerComplaintActionPlanStore.setSelectedImageDetails(imageDetails);
	}

}
