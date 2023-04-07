import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MaturityModalPaginationResponse, IndividualMaturityModal } from 'src/app/core/models/business-assessments/maturity-modal/maturity-modal';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MaturityModalStore } from 'src/app/stores/business-assessments/maturity-modal/maturity-modal-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class MaturityModalService {

  constructor(private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService) { }

  getItems(getAll: boolean = false, additionalParams?: string): Observable<MaturityModalPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${MaturityModalStore.currentPage}`;
      if (MaturityModalStore.orderBy) params += `&order=${MaturityModalStore.orderBy}`;
      if (MaturityModalStore.orderItem) params += `&order_by=${MaturityModalStore.orderItem}`;
      if (MaturityModalStore.searchText) params += `&q=${MaturityModalStore.searchText}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    return this._http.get<MaturityModalPaginationResponse>('/maturity-models' + (params ? params : '')).pipe(
      map((res: MaturityModalPaginationResponse) => {
        MaturityModalStore.setMaturityModalDetails(res);
        return res;
      })
    );
  }

  getItem(id: number): Observable<IndividualMaturityModal> {
    return this._http.get<IndividualMaturityModal>('/maturity-models/' + id).pipe(
      map((res: IndividualMaturityModal) => {
        MaturityModalStore.setIndividualMaturityModalDetails(res);
        // FrameworkStore.updateFramework(res)
        return res;
      })
    );
  }

  updateItem(framework_id:number, framework): Observable<any> {
    return this._http.put('/maturity-models/'+ framework_id, framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_maturity_modal_updated');
        
        this.getItems(false,'status=all').subscribe();
        this.getItem(framework_id).subscribe();

        return res;
      })
    );
  }

  saveItem(framework): Observable<any> {
    return this._http.post('/maturity-models', framework).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_maturity_modal_added');
        this.getItems(false,'status=all').subscribe();
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/maturity-models/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_maturity_modal_deleted');
        this.getItems(false,'status=all').subscribe();
        return res;
      })
    );
  }

  
  generateTemplate() {
    this._http.get('/maturity-models/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Maturity Models')+".xlsx");     

      }
    )
  }

  exportToExcel() {
    this._http.get('/maturity-models/export', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Maturity Models')+".xlsx");     

      }
    )
  }

  activate(id: number) {
    return this._http.put('/maturity-models/'+id+'/activate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_maturity_modal_activated');
       // this.getItems(false,'status=all').subscribe();
        //this.getItem(id).subscribe();
        return res;
      })
    );
  }

  deactivate(id: number) {
    return this._http.put('/maturity-models/'+id+'/deactivate', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','cyber_maturity_modal_deactivated');
        //this.getItems(false,'status=all').subscribe();
        //this.getItem(id).subscribe();
        return res;
      })
    );
  }

  
       /**
   * Sort Framework List
   * @param type Sort By Variable
   */
  sortmaturityModalList(type, callList: boolean = true) {
    if (!MaturityModalStore.orderBy) {
      MaturityModalStore.orderBy = 'asc';
      MaturityModalStore.orderItem = type;
    }
    else {
      if (MaturityModalStore.orderItem == type) {
        if (MaturityModalStore.orderBy == 'asc') MaturityModalStore.orderBy = 'desc';
        else MaturityModalStore.orderBy = 'asc'
      }
      else {
        MaturityModalStore.orderBy = 'asc';
        MaturityModalStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'status=all').subscribe();
  }
}
