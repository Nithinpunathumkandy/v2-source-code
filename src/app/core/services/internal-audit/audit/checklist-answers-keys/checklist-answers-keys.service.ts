import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChecklistAnswersKey , ChecklistAnswersKeyPaginationResponse } from 'src/app/core/models/internal-audit/audit/checklist-answer-keys/checklist-answerkeys';
import { ChecklistAnswersKeyStore } from 'src/app/stores/internal-audit/audit/checklist-answer-keys/cheklist-answer-keys-store';

@Injectable({
  providedIn: 'root'
})
export class ChecklistAnswersKeysService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }


    getAllItems(): Observable<ChecklistAnswersKey[]>{
      return this._http.get<ChecklistAnswersKey[]>('/audit-checklist-answer-keys?is_all=true').pipe(
        map((res: ChecklistAnswersKey[]) => {
          
          ChecklistAnswersKeyStore.setAllChecklistAnswersKey(res);
          return res;
        })
      );
    }
}
