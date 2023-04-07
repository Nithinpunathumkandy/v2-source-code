import { Injectable } from '@angular/core';
import { AuditPlanComment, AuditPlanCommentPaginationResponse  } from 'src/app/core/models/internal-audit/audit-plan/audit-plan-comment/audit-plan-comment';
import {AuditPlanCommentsStore} from 'src/app/stores/internal-audit/audit-plan/audit-plan-comment/audit-plan-comment-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class AuditPlanCommentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getComments(finding_id:number, params?: string ): Observable<AuditPlanCommentPaginationResponse>{
      return this._http.get<AuditPlanCommentPaginationResponse>('/audit-plans/'+finding_id+'/comments').pipe(
        map((res: AuditPlanCommentPaginationResponse) => {
          
          AuditPlanCommentsStore.setAllAuditPlanComments(res);
          return res;
        })
      );
    }

    saveComment(finding_id:number, item:any ){
      return this._http.post('/audit-plans/'+finding_id+'/comments',item).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('Success','Comment Saved Successfully');
          return res;
        })
      );
    }

    upateComment(finding_id:number, item:any, id:number ){
      return this._http.put('/audit-plans/'+finding_id+'/comments/'+id,item).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('Success','Comment Updated Successfully');
          return res;
        })
      );
    }

    deleteComment(finding_id:number, id:number ){
      return this._http.delete('/audit-plans/'+finding_id+'/comments/'+id).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('Success','Comment Deleted Successfully');
          return res;
        })
      );
    }
}
