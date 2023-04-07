import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ControlAssessmentDashboardStore } from 'src/app/stores/business-assessments/control-assessment-dashboard/control-assessment-dashboard';
import { controlAssessmentCount } from 'src/app/core/models/business-assessments/control-assessment/control-assessment-dashboard';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';

@Injectable({
  providedIn: 'root'
})
export class ControlAssessmentDashboardService {
  ControlAssessmentDashboardStore=ControlAssessmentDashboardStore;
  ControlAssessmentStore=ControlAssessmentStore;

  constructor(
    private _http:HttpClient,
    private _utilityService:UtilityService,
    private _helperService:HelperServiceService
  ) { }

  getControlCount(id): Observable<controlAssessmentCount> {
    return this._http.get<controlAssessmentCount>('/dashboard/control-assessment-counts?document_version_ids='+id).pipe(
      map((res: controlAssessmentCount) => {
        ControlAssessmentDashboardStore.setControlCounts(res);
        
        return res;
      })
    );
  }
}
