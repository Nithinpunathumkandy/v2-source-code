import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { environment } from 'src/environments/environment';
import { DownloadProgressStore } from 'src/app/stores/general/download-progress.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { BcmTemplatePaginationResponse, BcmTemplate, IndividualBcmTemplate } from 'src/app/core/models/bcm/bcm-template/bcm-template';
import { BcmTemplateStore } from 'src/app/stores/bcm/bcm-template/bcm-template';


@Injectable({
  providedIn: 'root'
})
export class BcmTemplateService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<BcmTemplatePaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${BcmTemplateStore.currentPage}&limit=16`;
      if (BcmTemplateStore.orderBy) params += `&order_by=${BcmTemplateStore.orderItem}&order=${BcmTemplateStore.orderBy}`;
    }
    if (BcmTemplateStore.searchText) params += (params ? '&q=' : '?q=') + BcmTemplateStore.searchText;
    if (additionalParams) params += additionalParams;
    if (status) params += (params ? '&' : '?') + 'status=all';
    return this._http.get<BcmTemplatePaginationResponse>('/bcp-templates' + (params ? params : '')).pipe(
      map((res: BcmTemplatePaginationResponse) => {
        BcmTemplateStore.setBcmTemplate(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualBcmTemplate> {
    return this._http.get<IndividualBcmTemplate>('/bcp-templates/' + id).pipe(
      map((res: IndividualBcmTemplate) => {
        BcmTemplateStore.setIndividualBcmTemplate(res)
        return res;
      })
    );
  }

  getThumbnailPreview(type, token, h?: number, w?: number) {
    switch (type) {
      case 'document-template-document': return environment.apiBasePath + '/bcm/files/bcp-templates/thumbnail?token=' + token;
        break;
      case 'user-profile-picture': return environment.apiBasePath + '/human-capital/files/user-profile-picture/thumbnail?token=' + token;
        break;
    }
  }

  activate(id: number) {
    return this._http.put('/bcp-templates/' + id + '/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'template_activated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/bcp-templates/' + id + '/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'template_deactivated');
        this.getItems(false, null, true).subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/bcp-templates/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'template_deleted_successfully');
        return res;
      })
    );
  }

  saveItem(item) {
    return this._http.post('/bcp-templates', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'template_created_successfully');
        return res;
      })
    );
  }

  updateItem(id: number, item) {
    return this._http.put('/bcp-templates/' + id, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'template_updated_successfully');
        return res;
      })
    );
  }

  setFileDetails(imageDetails, url, type) {
    BcmTemplateStore.setFileDetails(imageDetails, url, type);
  }

  setSelectedImageDetails(imageDetails, type) {
    BcmTemplateStore.setSelectedImageDetails(imageDetails);
  }

  sortCorrectiveActionList(type, callList: boolean = true) {
    if (!BcmTemplateStore.orderBy) {
      BcmTemplateStore.orderBy = 'asc';
      BcmTemplateStore.orderItem = type;
    }
    else {
      if (BcmTemplateStore.orderItem == type) {
        if (BcmTemplateStore.orderBy == 'asc') BcmTemplateStore.orderBy = 'desc';
        else BcmTemplateStore.orderBy = 'asc'
      }
      else {
        BcmTemplateStore.orderBy = 'asc';
        BcmTemplateStore.orderItem = type;
      }
    }
  }
}
