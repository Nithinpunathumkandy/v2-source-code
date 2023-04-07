import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FrameworkPaginationResponse, IndividualFramework } from 'src/app/core/models/business-assessments/frameworks';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FrameworksStore } from 'src/app/stores/business-assessments/frameworks.store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class FrameworksService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<FrameworkPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${FrameworksStore.currentPage}`;
      if (FrameworksStore.orderBy) params += `&order=${FrameworksStore.orderBy}`;
      if (FrameworksStore.orderItem) params += `&order_by=${FrameworksStore.orderItem}`;
      if (FrameworksStore.searchText) params += `&q=${FrameworksStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<FrameworkPaginationResponse>('/business-assessment-frameworks' + (params ? params : '')).pipe(
      map((res: FrameworkPaginationResponse) => {
        FrameworksStore.setFrameworkDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualFramework> {
    return this._http.get<IndividualFramework>('/business-assessment-frameworks/' + id).pipe(
      map((res: IndividualFramework) => {
        FrameworksStore.setIndividualFrameworkDetails(res);
        // FrameworkStore.updateFramework(res)
        return res;
      })
    );
  }

  updateItem(framework_id:number, framework): Observable<any> {
    return this._http.put('/business-assessment-frameworks/'+ framework_id, framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','framework_updated');
        
        this.getItems(false,'status=all').subscribe();
        this.getItem(framework_id).subscribe();

        return res;
      })
    );
  }

  saveItem(framework): Observable<any> {
    return this._http.post('/business-assessment-frameworks', framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','framework_added');
        this.getItems(false,'status=all').subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/business-assessment-frameworks/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','framework_deleted');
        this.getItems(false,'status=all').subscribe();
        return res;
      })
    );
  }

  activate(id: number) {
    return this._http.put('/business-assessment-frameworks/'+id+'/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','framework_activated');
        this.getItems(false,'status=all').subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/business-assessment-frameworks/'+id+'/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','framework_deactivated');
        this.getItems(false,'status=all').subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/business-assessment-frameworks/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessment_frameworks_template')+".xlsx");     

      }
    )
  }

  exportToExcel() {
    this._http.get('/business-assessment-frameworks/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('business_assessment_frameworks')+".xlsx");     

      }
    )
  }

  
       /**
   * Sort Framework List
   * @param type Sort By Variable
   */
  sortFrameworkList(type, callList: boolean = true) {
    if (!FrameworksStore.orderBy) {
      FrameworksStore.orderBy = 'asc';
      FrameworksStore.orderItem = type;
    }
    else {
      if (FrameworksStore.orderItem == type) {
        if (FrameworksStore.orderBy == 'asc') FrameworksStore.orderBy = 'desc';
        else FrameworksStore.orderBy = 'asc'
      }
      else {
        FrameworksStore.orderBy = 'asc';
        FrameworksStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'status=all').subscribe();
  }

}
