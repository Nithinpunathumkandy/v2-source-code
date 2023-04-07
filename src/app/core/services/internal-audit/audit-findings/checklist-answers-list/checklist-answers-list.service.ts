import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

import {ChecklistsAnswersListStore} from 'src/app/stores/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list-store';
import { ChecklistAnswersList , ChecklistAnswersListPaginationResponse } from 'src/app/core/models/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list';


@Injectable({
  providedIn: 'root'
})
export class ChecklistAnswersListService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getAllItems(params?:string): Observable<ChecklistAnswersListPaginationResponse>{
      return this._http.get<ChecklistAnswersListPaginationResponse>('/audit-schedules/checklist-answer'+ (params ? params : '')).pipe(
        map((res: ChecklistAnswersListPaginationResponse) => {
          
          ChecklistsAnswersListStore.setAllChecklistANswersList(res);
          return res;
        })
      );
    }

    getItem( id:number,params?:string): Observable<ChecklistAnswersList>{
      return this._http.get<ChecklistAnswersList>('/audit-schedules/checklist-answer/'+id+ (params ? params : '')).pipe(
        map((res: ChecklistAnswersList) => {
          ChecklistsAnswersListStore.setIndividualCheckList(res);
          return res;
        })
      );
    }


}
