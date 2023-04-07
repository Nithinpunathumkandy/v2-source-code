import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { FeedbackStore } from 'src/app/stores/feedback.store';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getFeedbackKey(){
      return this._http.get('/app-feedback-keys').pipe(
        map((res ) => {
          FeedbackStore.setAppFeedbackKey(res);
          return res;
        })
      );
    } 
    
    getFeedbackSmilies(){
      return this._http.get('/app-feedback-smilies').pipe(
        map((res ) => {
          FeedbackStore.setAppFeedbackSmiley(res);
          return res;
        })
      );
    } 

    sendFeedback(details){
      return this._http.post('/app-user-feedbacks', details).pipe(
        map((res ) => {
          this._utilityService.showSuccessMessage('Success!', res['message']);
          return res;
        })
      );
    }  
}
