import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BiaMatrixList } from 'src/app/core/models/bcm/bia-matrix/bia-matrix';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BiamatrixListStore } from 'src/app/stores/bcm/bia/bia-matrix.store';

@Injectable({
  providedIn: 'root'
})
export class BiaMatrixService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

    getItem(): Observable<BiaMatrixList[]> {
      return this._http.get<BiaMatrixList[]>('/bia-matrix').pipe(
        map((res: BiaMatrixList[]) => {
          BiamatrixListStore.setBiaMatrix(res)
          return res;
        })
      );
    }
}
