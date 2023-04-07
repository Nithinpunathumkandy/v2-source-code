import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';

import { StakeholdersList, NeedsExpectationsList, StakeNeedsExpectations } from 'src/app/core/models/organization/context/stakeholder-analysis';
import { StakeholderAnalysisStore } from "src/app/stores/organization/context/stakeholder-analysis.store";


@Injectable({
  providedIn: 'root'
})
export class StakeholderAnalysisService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
  /**
   * Get Stakeholder Details
   * Returns Stakeholder type and Stakeholders
   */
  getStakeholderDetails(){
    return this._http.get<StakeholdersList[]>('/stakeholder-analysis').pipe(
      map((res:StakeholdersList[]) => {
        StakeholderAnalysisStore.setStakeholdersDetails(res);
        return res;
      })
    );
  }

  /**
   * Get Needs and Expectations by Stakeholder Id
   * @param stakeholderId Stakeholder Id
   */
  getNeedsExpectations(stakeholderId){
    return this._http.get<StakeNeedsExpectations[]>(`/stakeholder-analysis/${stakeholderId}`).pipe(
      map((res:StakeNeedsExpectations[]) => {
        StakeholderAnalysisStore.setNeedsExpectationsList(res);
        return res;
      })
    );
  }
}
