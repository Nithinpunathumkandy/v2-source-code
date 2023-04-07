import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { CallTreeUsers } from "src/app/core/models/bcm/bcp/bcp-calltree";
import { BcpCallTreeStore } from 'src/app/stores/bcm/bcp/bcp-call-tree-store';

@Injectable({
  providedIn: 'root'
})
export class BcpCallTreeService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  getItem(id,params): Observable<CallTreeUsers[]> {
    return this._http.get<CallTreeUsers[]>('/business-continuity-plans/'+id+'/call-tree'+(params ? params : '')).pipe(
      map((res:CallTreeUsers[]) => {
        BcpCallTreeStore.setBcpCallTree(res);
        return res;
      })
    );
  }

  saveItem(item,id: number): Observable<any> {
    return this._http.post('/business-continuity-plans/'+id+'/call-tree', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_call_tree_user_added');
        return res;
      })
    );
  }

  updateItem(item,bcpId: number, id: number): Observable<any> {
    return this._http.put('/business-continuity-plans/'+bcpId+'/call-tree/'+id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_calltree_updated');
        return res;
      })
    );
  }

  delete(id: number,bcpId: number) {
    return this._http.delete('/business-continuity-plans/'+bcpId+'/call-tree/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_call_tree_user_deleted');
        return res;
      })
    );
  }
}
