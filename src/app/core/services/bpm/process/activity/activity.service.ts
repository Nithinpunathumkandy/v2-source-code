import { Injectable, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { ActivityStore } from '../../../../../stores/bpm/process/activity.store'
import {ProcessStore} from '../../../../../stores/bpm/process/processes.store'
import {Activity,ActivityDetails,ActivityPaginationResponse} from '../../../../../core/models/bpm/process/activity'
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getAllItems(params?:string): Observable<ActivityPaginationResponse> {
    return this._http.get<ActivityPaginationResponse>('/processes/' +ProcessStore.process_id +'/activities'+ (params ? params : '')).pipe(
      map((res: ActivityPaginationResponse) => {
        res['data'].forEach((element,index)=> {
          element['is_accordion_active']=false; 
      });
        ActivityStore.setActivity(res);
        return res;
      })
    );
  }

  getItemById(activityId:number):Observable<ActivityDetails>{
    return this._http.get<ActivityDetails>('/processes/' + ProcessStore.process_id + '/activities/' + activityId).pipe(map((res: ActivityDetails) => {
      ActivityStore.setActivityDetails(res)
      return res;
    }))
  }

  // Get Request
  getItems(processId:number, params?: string): Observable<Activity[]> {
    return this._http.get<Activity[]>('/processes/' +processId +'/activities'+ (params ? params : ''));
  }



  // Post Request - save new item
  saveItem(processId, item: Activity, position?: number) {
    return this._http.post('/processes/' +processId +'/activities', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'new_activity_created');
        // this.getAllItems().subscribe()
        return res;
      })
    );
  }

  delete(processId,id: number) {
    return this._http.delete('/processes/' +processId +'/activities/'+ id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage(
          'success',
          'activity_deleted'
        );
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

  setFileDetails(imageDetails,url,type){
    ActivityStore.setFileDetails(imageDetails,url,type);
  }

  getActivityDocs(){
    return ActivityStore.getActivityDetails;
  }

  // Put Request
  updateItem(processId,id, item: Activity): Observable<any> {
    return this._http.put('/processes/' +processId +'/activities/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'activity_updated');
        this.getAllItems().subscribe();
        return res;
      })
    );
  }

}
