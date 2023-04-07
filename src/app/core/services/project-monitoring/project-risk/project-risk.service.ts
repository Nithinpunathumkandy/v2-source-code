import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RiskPaginationResponse } from 'src/app/core/models/project-monitoring/project-risk';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { RiskStore } from 'src/app/stores/project-monitoring/project-risk-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class ProjectRiskService {

  constructor(
    private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService
  ) { }

  getItems(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<RiskPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${RiskStore.currentPage}`;
			if (RiskStore.orderBy) params += `&order_by=project_monitor_risks.id&order=${RiskStore.orderBy}`;
		}
		if (RiskStore.searchText) params += (params ? '&q=' : '?q=') + RiskStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<RiskPaginationResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/risks' + (params ? params : '')).pipe(
			map((res: RiskPaginationResponse) => {
				RiskStore.setRisk(res);
				return res;
			})
		);
	}

  getRisk(id){
    return this._http.get('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/risks/'+ id).pipe(
      map((res) => {
        // RiskStore.setRisk(res);
        return res;
      })
    );
  }

  
  saveRisk(item){
    return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/risks', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_created_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  
  updateRisk(item,id){
    return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/risks/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteRisk(id){
    return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/risks/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'risk_delete_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  sortRiskList(type: string, text: string) {
		if (!RiskStore.orderBy) {
			RiskStore.orderBy = 'asc';
			RiskStore.orderItem = type;
		}
		else {
			if (RiskStore.orderItem == type) {
				if (RiskStore.orderBy == 'asc') RiskStore.orderBy = 'desc';
				else RiskStore.orderBy = 'asc'
			}
			else {
				RiskStore.orderBy = 'asc';
				RiskStore.orderItem = type;
			}
		}
  }
}
