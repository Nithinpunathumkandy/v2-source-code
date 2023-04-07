import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class BcpClauseService {

  constructor(private _http: HttpClient, private _utilityService: UtilityService) { }

  updateItem(category_id:number, category): Observable<any> {
    return this._http.put('/bcp-version-contents/'+ category_id, category).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_version_updated');
        return res;
      })
    );
  }

  saveItem(item): Observable<any> {
    return this._http.post('/bcp-version-contents', item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_version_added');
        return res;
      })
    );
  }

  delete(id: number) {
    return this._http.delete('/bcp-version-contents/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'bcp_version_deleted');
        return res;
      })
    );
  }
}
