import { Injectable } from '@angular/core';
import { CaComment, CaCommentPaginationResponse  } from 'src/app/core/models/internal-audit/audit-findings/corrective-action-comments/ca-comment';
import {CaCommentsStore} from 'src/app/stores/internal-audit/audit-findings/corrective-actions-comment/ca-comment-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class CaCommentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getComments(id:number ,ca_id:number, params?: string ): Observable<CaCommentPaginationResponse>{
      return this._http.get<CaCommentPaginationResponse>('/findings/'+id+'/corrective-actions/'+ca_id+'/comments').pipe(
        map((res: CaCommentPaginationResponse) => {
          
          CaCommentsStore.setAllCorrectiveActionsComments(res);
          return res;
        })
      );
    }

    saveComment(id:number ,ca_id:number, item:any ){
      return this._http.post('/findings/'+id+'/corrective-actions/'+ca_id+'/comments',item).pipe(
        map((res) => {
          
          return res;
        })
      );
    }

    upateComment(finding_id:number,ca_id:number , id:number,item:any ){
      return this._http.put('/findings/'+finding_id+'/corrective-actions/'+ca_id+'/comments/'+id,item).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('Success','Comment Updated Successfully');
          return res;
        })
      );
    }

    deleteComment(finding_id:number,ca_id:number, id:number ){
      return this._http.delete('/findings/'+finding_id+'/corrective-actions/'+ca_id+'/comments/'+id).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('Success','Comment Deleted Successfully');
          return res;
        })
      );
    }
}
