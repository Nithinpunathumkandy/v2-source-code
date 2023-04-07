import { Injectable } from '@angular/core';
import { FindingComment, FindingCommentPaginationResponse  } from 'src/app/core/models/internal-audit/audit-findings/finding-comment/finding-comment';

import {FindingCommentsStore} from 'src/app/stores/internal-audit/audit-findings/finding-comment/finding-comment-store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
@Injectable({
  providedIn: 'root'
})
export class FindingCommentService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
    getComments(finding_id:number, params?: string ): Observable<FindingCommentPaginationResponse>{
      return this._http.get<FindingCommentPaginationResponse>('/findings/'+finding_id+'/comments').pipe(
        map((res: FindingCommentPaginationResponse) => {
          
          FindingCommentsStore.setAllFindingsComments(res);
          return res;
        })
      );
    }

    saveComment(finding_id:number, item:any ){
      return this._http.post('/findings/'+finding_id+'/comments',item).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('Success','Comment Saved Successfully');
          return res;
        })
      );
    }

    upateComment(finding_id:number, item:any, id:number ){
      return this._http.put('/findings/'+finding_id+'/comments/'+id,item).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('Success','Comment Updated Successfully');
          return res;
        })
      );
    }

    deleteComment(finding_id:number, id:number ){
      return this._http.delete('/findings/'+finding_id+'/comments/'+id).pipe(
        map((res) => {
          this._utilityService.showSuccessMessage('Success','Comment Deleted Successfully');
          return res;
        })
      );
    }
}
