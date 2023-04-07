import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { JsoCount, jsoNumberOfObservations, jsoOpenClosed, jsoParticipationPerDepartment, jsoPositiveNegativeCount } from 'src/app/core/models/masters/jso/jso-dashboard';
import { JsoDashboardStore } from 'src/app/stores/jso/jso-dashboard/jso-dashboard-stores';

@Injectable({
  providedIn: 'root'
})
export class JsoDashboardService {

  constructor(private _http: HttpClient,
    private _helperService:HelperServiceService,
    // private _cdr:ChangeDetectorRef,
    private _utilityService: UtilityService) { }

    
    getJSOCount(): Observable<JsoCount> {
      return this._http.get<JsoCount>('/dashboard/jso-counts').pipe(
        map((res: JsoCount) => {
          JsoDashboardStore.setJSOCount(res)
          return res;
        })
      );
    }

    getPositiveNegative(): Observable<jsoPositiveNegativeCount> {
      return this._http.get<jsoPositiveNegativeCount>('/dashboard/jso-positive-vs-negative-counts').pipe(
        map((res: jsoPositiveNegativeCount) => {
          JsoDashboardStore.setJSOPositiveNegativeCount(res)
          return res;
        })
      );
    }

    getOpenClosed(): Observable<jsoOpenClosed> {
      return this._http.get<jsoOpenClosed>('/dashboard/jso-observation-open-vs-closed-counts').pipe(
        map((res: jsoOpenClosed) => {
          JsoDashboardStore.setJSOOpenClose(res)
          return res;
        })
      );
    }

    getParticipationPerDepartment(): Observable<jsoParticipationPerDepartment> {
      return this._http.get<jsoParticipationPerDepartment>('/dashboard/jso-participation-per-departments').pipe(
        map((res: jsoParticipationPerDepartment) => {
          JsoDashboardStore.setParticipationPerDepartment(res)
          return res;
        })
      );
    }

    getObservationCategories(): Observable<jsoPositiveNegativeCount> {
      return this._http.get<jsoPositiveNegativeCount>('/dashboard/jso-observation-categories').pipe(
        map((res: jsoPositiveNegativeCount) => {
          JsoDashboardStore.setObservationCategories(res)
          return res;
        })
      );
    }

    getNumberOfObservations(): Observable<jsoNumberOfObservations> {
      return this._http.get<jsoNumberOfObservations>('/dashboard/jso-number-of-observations').pipe(
        map((res: jsoNumberOfObservations) => {
          JsoDashboardStore.setNumberOfObservations(res)
          return res;
        })
      );
    }
}
