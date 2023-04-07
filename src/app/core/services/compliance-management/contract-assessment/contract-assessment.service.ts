import { EventEmitter, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpRequest, HttpEventType, HttpEvent } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Contract, ContractPaginationResponse, IndividualContract
} from "src/app/core/models/compliance-management/contract-assessment/contract-assessment-model";
import { ComplainceContractStore } from 'src/app/stores/compliance-management/complaince-checklist/contract-assessment-store';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class ContractAssessmentService {

  ComplainceContractStore=ComplainceContractStore;
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,

    private _helperService: HelperServiceService) { }

  getAllItems(getAll: boolean = false, additionalParams?: string): Observable<ContractPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ComplainceContractStore.currentPage}`;
      if (ComplainceContractStore.orderBy) params += `&order=${ComplainceContractStore.orderBy}`;
      if (ComplainceContractStore.orderItem) params += `&order_by=${ComplainceContractStore.orderItem}`;
      if (ComplainceContractStore.searchText) params += `&q=${ComplainceContractStore.searchText}`;
    }
    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'contract_assessment' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ContractPaginationResponse>('/sla-and-contract-assessments' + (params ? params : '')).pipe(
      map((res: ContractPaginationResponse) => {
        ComplainceContractStore.setAllContract(res);
        return res;
      })
    );
  }

  updateItem(id:number, item): Observable<any> {
    return this._http.put('/sla-and-contract-assessments/'+ id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','contract_updated');
        this.getAllItems(false,'status=all').subscribe();
        this.getItem(id).subscribe();
        return res;
      })
    );
  }

  saveItem(item): Observable<any> {
    return this._http.post('/sla-and-contract-assessments', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','contract_added');
        this.getAllItems(false,'status=all').subscribe();
        return res;
      })
    );
  }

  exportToExcel() {
    let params='';
    if(RightSidebarLayoutStore.filterPageTag == 'contract_assessment' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/sla-and-contract-assessments/export'+(params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('contract')+".xlsx");     
      }
    )
  }

  getItem(id: number):
    Observable<IndividualContract> {
    return this._http.get<IndividualContract>('/sla-and-contract-assessments/' + id).pipe(
      map((res: IndividualContract) => {
        ComplainceContractStore.setContractDetails(res);
        return res;
      })
    );

  }

  getFrameworkOptions():
  Observable<any> {
    return this._http.get<any>('/sla-and-contract-framework-options').pipe(
      map((res: any) => {
        //ComplainceContractStore.setContractDetails(res);
        return res;
      })
    ); 
  }

  delete(id: number,BAId?) {
    return this._http.delete('/sla-and-contract-assessments/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','contract_assessment_deleted');
            this.getAllItems(false).subscribe();
        return res;
      })
    );
  }

  updateChecklist(item,id:number): Observable<any> {
    return this._http.put('/contract-assessment-checklists/'+ id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','checklist_assessment_done');
        // this.getAllItems(false,'status=all').subscribe();
        // this.getItem(id).subscribe();
        return res;
      })
    );
  }

  publishAssessment(assessment_id:number): Observable<any> {
    return this._http.put('/sla-and-contract-assessments/'+ assessment_id+'/submit', null).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success','assessment_published');
        
        this.getItem(assessment_id).subscribe();

        return res;
      })
    );
  }
  
  getThumbnailPreview(type, token, h?: number, w?: number) {
    // +(h && w)?'&h='+h+'&w='+w:''
    switch (type) {
      case 'checklist-document': return environment.apiBasePath + '/compliance-management/files/checklist-document/thumbnail?token=' + token;
      break;
      
     
    }
  }
 
}
