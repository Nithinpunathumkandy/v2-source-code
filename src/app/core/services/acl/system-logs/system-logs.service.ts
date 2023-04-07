import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { SystemLogStore } from 'src/app/stores/acl/system-log.store';
import { Observable } from 'rxjs';
import { SystemLog } from 'src/app/core/models/acl/system.logs';

@Injectable({
  providedIn: 'root'
})
export class SystemLogsService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }

  getSystemLogDetails(){
    return this._http.get('/system-logs').pipe(
      map((res) => {
        SystemLogStore.setSystemLog(res);
        return res;
      })
    );
  }

  downloadFile(filename){
    this._http.get('/system-logs/'+filename +'/download', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,"systemlog.txt");
      })
  }

 systemLogDetails(filename){
    return this._http.get('/system-logs/'+filename).pipe(
      map((res) => {
        SystemLogStore.setSystemLogDetails(res);
        return res;
      })
    );
  }

  systemLogDashboard(): Observable<SystemLog> {
    return this._http.get<SystemLog>('/system-logs/dashboard').pipe(
      map((res:SystemLog) => { 
        SystemLogStore.setSystemLogDashboard(res);
        return res;
      })
    );
   }

}
