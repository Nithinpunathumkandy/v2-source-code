import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualOutcome } from 'src/app/core/models/bcm/test-and-exercise/outcome';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { OutcomeStore } from 'src/app/stores/bcm/test-exercise/outcome.store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class OutcomeService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService) { }


  getItems(getAll: boolean = false, additionalParams?: string): Observable<any> {
    let params = '';
    if (!getAll) {
      // params = params+`&page=${RisksStore.currentPage}`;
      params = (params=='')?params+`?page=${OutcomeStore.currentPage}`:params+`&page=${OutcomeStore.currentPage}`;
      if (OutcomeStore.orderBy) params += `&order=${OutcomeStore.orderBy}`;
      if (OutcomeStore.orderItem) params += `&order_by=${OutcomeStore.orderItem}`;
      if (OutcomeStore.searchText) params += `&q=${OutcomeStore.searchText}`;
      // if (RisksStore.orderBy) params += `&order_by=risks.title&order=${RisksStore.orderBy}`;
    }

    if(additionalParams){
      params = (params == '') ? params + `?${additionalParams}` : params + `&${additionalParams}`;
      // else params += `?${additionalParams}`;
    }
    if(RightSidebarLayoutStore.filterPageTag == 'risk_treatment' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<any>('/test-and-exercise-outcomes'+(params?params:'')).pipe(
      map((res: any) => {
        OutcomeStore.setOutcome(res);
        // ImpactStore.updateImpact(res)
        return res;
      })
    );
  }

  getItem(id: number,params?:string): Observable<IndividualOutcome> {
    return this._http.get<IndividualOutcome>('/test-and-exercise-outcomes/'+id+(params?params:'')).pipe(
      map((res: IndividualOutcome) => {
        if(res.id){
          OutcomeStore.setIndividualOutcome(res);
        }else{
          OutcomeStore.detailsLoaded = true
        }
        // RisksStore.updateRisk(res)
        return res;
      })
    );
  }

  updateItem(id,saveData): Observable<any> {
    return this._http.put('/test-and-exercise-outcomes/'+id, saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'outcome_updated');

        this.getItems().subscribe();

        return res;
      })
    );
  }
  saveItem(saveData): Observable<any> {
    return this._http.post('/test-and-exercise-outcomes', saveData).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'outcome_created');

        this.getItems().subscribe();

        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/test-and-exercise-outcomes/' + id ).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'outcome_deleted');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  setImageDetails(imageDetails,url,type){
    OutcomeStore.setDocumentImageDetails(imageDetails,url,type);
  }

  setSelectedImageDetails(imageDetails,type){
    OutcomeStore.setSelectedImageDetails(imageDetails);
  }

  getDocuments(){
    return OutcomeStore.getDocumentDetails;
  }

  sortRiskTreatmentList(type, callList: boolean = true) {
    if (!OutcomeStore.orderBy) {
      OutcomeStore.orderBy = 'asc';
      OutcomeStore.orderItem = type;
    }
    else {
      if (OutcomeStore.orderItem == type) {
        if (OutcomeStore.orderBy == 'asc') OutcomeStore.orderBy = 'desc';
        else OutcomeStore.orderBy = 'asc'
      }
      else {
        OutcomeStore.orderBy = 'asc';
        OutcomeStore.orderItem = type;
      }
    }
    if (callList)
      this.getItems(false,'').subscribe();
  }

  generateTemplate() {
    this._http.get('/test-and-exercise-outcomes/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('outcome_template') + ".xlsx");
      }
    )
  }

  exportToExcel(params?) {
    this._http.get('/test-and-exercise-outcomes/export'+(params?params:''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('outcome') + ".xlsx");
      }
    )
  }
}
