import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { IndividualTrainings, Trainings, TrainingsPaginationResponse } from 'src/app/core/models/training/trainings/trainings.model';
import { Observable } from 'rxjs';
import { TrainingsStore } from 'src/app/stores/training/trainings/training-store';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';

@Injectable({
  providedIn: 'root'
})
export class TrainingsService {

  constructor(private _http: HttpClient,
    private _helperService:HelperServiceService,
    private _utilityService: UtilityService) { }


    getItems(getAll: boolean = false, additionalParams?: string): Observable<TrainingsPaginationResponse> {
      let params = '';
      if (!getAll) {
        params = `?page=${TrainingsStore.currentPage}`;
        if (TrainingsStore.orderBy) params += `&order=${TrainingsStore.orderBy}`;
        if (TrainingsStore.orderItem) params += `&order_by=${TrainingsStore.orderItem}`;
      }
      if(additionalParams) params += additionalParams;
      if (TrainingsStore.searchText) params += (params ? '&q=' : '?q=') + TrainingsStore.searchText;
      if (RightSidebarLayoutStore.filterPageTag == 'trainings' && RightSidebarLayoutStore.filtersAsQueryString)
        params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      return this._http.get<TrainingsPaginationResponse>('/trainings' + (params ? params : '')).pipe(
        map((res: TrainingsPaginationResponse) => {
          TrainingsStore.setTrainings(res);
          return res;
        })
      );
    }
  
    getItem(id): Observable<IndividualTrainings> {
      return this._http.get<IndividualTrainings>('/trainings/' + id).pipe(
        map((res: IndividualTrainings) => {
          TrainingsStore.setIndividualTrainings(res)
          return res;
        })
      );
    }

       /**
   * @description
   * this method is used for creating Training
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TrainingsService
   */
  saveItem(value) {
    return this._http.post('/trainings', value).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('success', 'trainings_added');
        this.getItems(false, null).subscribe();
        return res;
      })
    );
  }


    /**
   * @description
   * this method is used for updating trainings
   *
   * @param {*} [data]
   * @returns this api will return a observalble
   * @memberof TrainingsService
   */
     updateItem(id: number, item: Trainings):Observable<any>{
      return this._http.put(`/trainings/${id}`, item).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success','updated_trainings');
        return res;
      }))
    }

    deleteTraining(id: number):Observable<any>{
      return this._http.delete(`/trainings/${id}`).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success','deleted_trainings');
        this.getItems().subscribe();
        return res;
      }))
    }
  
    deleteActivity(id: number):Observable<any>{
      return this._http.put('/trainings/'+ id+ '/revert',id).pipe(map(res=>{
        this._utilityService.showSuccessMessage('success','training_activity_deleted');
        this.getItem(id).subscribe();
        return res;
      }))
    }

    generateTemplate() {
      this._http.get('/trainings/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('training_template')+".xlsx");
        }
      )
    }

    importData(data){  
      const formData = new FormData();
      formData.append('file',data);
      return this._http.post('/trainings/import',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('successfully','training_imported');
          return res;
        })
      )
    }
  
    exportToExcel() {
      let params = '';
		if (TrainingsStore.orderBy) params += `?order=${TrainingsStore.orderBy}`;
		if (TrainingsStore.orderItem) params += `&order_by=${TrainingsStore.orderItem}`;
		if(RightSidebarLayoutStore.filterPageTag == 'trainings' && RightSidebarLayoutStore.filtersAsQueryString)
		params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/trainings/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response,  this._helperService.translateToUserLanguage('trainings')+".xlsx");
        }
      )
    }
  
    sortTrainingList(type, callList: boolean = true) {
      if (!TrainingsStore.orderBy) {
        TrainingsStore.orderBy = 'asc';
        TrainingsStore.orderItem = type;
      }
      else {
        if (TrainingsStore.orderItem == type) {
          if (TrainingsStore.orderBy == 'asc') TrainingsStore.orderBy = 'desc';
          else TrainingsStore.orderBy = 'asc'
        }
        else {
          TrainingsStore.orderBy = 'asc';
          TrainingsStore.orderItem = type;
        }
      }
    }

    onGoing(id){
      return this._http.put('/trainings/'+ id+ '/ongoing',null).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('success','on_going');
          return res;
        })
      );
    }

    cancelled(id){
      return this._http.put('/trainings/'+ id+ '/cancelled',null).pipe(
        map((res) => {
          this.getItem(id).subscribe();
          this._utilityService.showSuccessMessage('success','cancelled_succesfully');
          return res;
        })
      );
    }

    completed(id,value){
      return this._http.put('/trainings/'+ id+ '/completed',value).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('success','complete_succesfully');
          return res;
        })
      );
    }
    selectRequiredTraining(issues){
   
      TrainingsStore.addSelectedTrainings(issues);
      }
}
