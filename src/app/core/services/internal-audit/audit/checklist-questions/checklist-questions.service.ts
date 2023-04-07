import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChecklistQuestions , ChecklistQuestionsPaginationResponse } from 'src/app/core/models/internal-audit/audit/checklist-questions/checklist-questions';
import { ChecklistQuestionsStore } from 'src/app/stores/internal-audit/audit/checklist-questions/checklist-questions-store';

@Injectable({
  providedIn: 'root'
})
export class ChecklistQuestionsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }


    getAllItems(id:number): Observable<ChecklistQuestions[]>{
      return this._http.get<ChecklistQuestions[]>('/audit-schedules/'+id+'/get-questions').pipe(
        map((res: ChecklistQuestions[]) => {
          
          ChecklistQuestionsStore.setAllChecklistQuestions(res);
          return res;
        })
      );
    }
}