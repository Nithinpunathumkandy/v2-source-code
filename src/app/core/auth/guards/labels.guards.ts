import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { LabelMasterStore } from 'src/app/stores/masters/general/label-store';

@Injectable({
  providedIn: 'root'
})
export class LabelsGuard implements Resolve<any> {
  constructor(private _http: HttpClient) { }

  resolve(): Observable<any> {
    return this._http.get<any>('/labels?settings=true').pipe(
        map((res: any) => {
          LabelMasterStore.setLabelsToTranslate(res);
          return res;
        })
      );
  }


}
