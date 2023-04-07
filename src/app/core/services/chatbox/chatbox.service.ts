import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { ChatbotStore } from 'src/app/stores/chatbot.stores';

@Injectable({
  providedIn: 'root'
})
export class ChatboxService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }


    getResult(details){
      return this._http.post('https://isochatbot.isorobot.io/api/v1.0/response', details).pipe(
        map((res ) => {
          ChatbotStore.setMessage(res);
          return res;
        })
      );
    }  
}
