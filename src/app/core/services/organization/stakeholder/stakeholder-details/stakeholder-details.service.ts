import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { UtilityService } from 'src/app/shared/services/utility.service';
import { StakeholderDetailsStore } from "src/app/stores/organization/stakeholders/stakeholder-details.store";

import { StakeholderNeedsAndExpectationsPaginationResponse } from "src/app/core/models/organization/stakeholder/stakeholder-needs-and-expectations";
import { IssueListResponse } from "src/app/core/models/organization/context/issue-list";

@Injectable({
  providedIn: 'root'
})
export class StakeholderDetailsService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getStakeholderNeedsAndExpectaions(id: number){
    let params = `&page=${StakeholderDetailsStore.nCurrentPage}`;
    return this._http.get<StakeholderNeedsAndExpectationsPaginationResponse>('/stakeholder-need-and-expectations?stakeholder_ids=' + id + (params ? params : '')).pipe(
      map((res: StakeholderNeedsAndExpectationsPaginationResponse) => {
        StakeholderDetailsStore.setStakeholderNeedsAndExpectations(res);
        return res;
      })
    );
  }

  getStakeholderIssues(id: number){
    let params = `&page=${StakeholderDetailsStore.iCurrentPage}`;
    return this._http.get<IssueListResponse>('/organization-issues?stakeholder_ids=' + id + (params ? params : '')).pipe(
      map((res: IssueListResponse) => {
        StakeholderDetailsStore.setStakeholderIssues(res);
        return res;
      })
    );
  }

  addStakeholderNeedsAndExpectaions(item,id){
    return this._http.post('/stakeholder-need-and-expectations', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'create_success');
        this.getStakeholderNeedsAndExpectaions(id).subscribe();
        return res;
      })
    );
  }

  deleteStakeholderNeedsAndExpectations(id,stakeholderId){
    return this._http.delete('/stakeholder-need-and-expectations/'+id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'delete_success');
        this.getStakeholderNeedsAndExpectaions(stakeholderId).subscribe();
        return res;
      })
    );
  }

}
