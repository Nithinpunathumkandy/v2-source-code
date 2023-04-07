import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MilestonResponse, ProjectsResponse, ScopeOfWorkResponse, ExpectedOutcomeResponse, DeliverableResponse, StrategicAlignmentResponse,InduvalMilestone,StakeholderPaginationResponse, ObjectiveResponse} from 'src/app/core/models/project-monitoring/project-monitoring.modal';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StakeholderStore } from 'src/app/stores/project-monitoring/project-stakeholder-store';


@Injectable({
  providedIn: 'root'
})
export class ProjectMonitoringService {

  constructor(private _http: HttpClient,private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }


  
  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<ProjectsResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${ProjectMonitoringStore.currentPage}`;
      if (ProjectMonitoringStore.orderBy) params += `&order_by=${ProjectMonitoringStore.orderItem}&order=${ProjectMonitoringStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(ProjectMonitoringStore.searchText) params += (params ? '&q=' : '?q=')+ProjectMonitoringStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'project_monitor' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<ProjectsResponse>('/project-monitor/projects' + (params ? params : '')).pipe(
      map((res: ProjectsResponse) => {
        ProjectMonitoringStore.setProjects(res);
        return res;
      }) 
    );
 
  }

  generateTemplate() {
    this._http.get('/project-monitor/projects/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('Project Template') +".xlsx");
      }
    )
  }

  exportToExcel(params:string='') {
    this._http.get('/project-monitor/projects/export'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Projects') +".xlsx");
      }
    )
  }

  importToExcel(params:string='') {
    this._http.get('/project-monitor/projects/import'+ (params ? params : ''), { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Projects') +".xlsx");
      }
    )
  }

  importData(data){  
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/project-monitor/projects/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('successfully','project_imported');
        return res;
      })
    )
  }

  save(item){
    return this._http.post('/project-monitor/projects', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Project created successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  update(item , id){
    return this._http.put('/project-monitor/projects/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Project updated successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  delete(id){
    return this._http.delete('/project-monitor/projects/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Project deleted successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getItem(id){
    return this._http.get('/project-monitor/projects/'+id).pipe(
      map((res:any )=> {
        ProjectMonitoringStore.setIndividualProjectDetails(res)
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  // getMilestons(params?:string){
  //   return this._http.get<MilestonResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones' + (params? params: '')).pipe(
  //     map((res: MilestonResponse) => {
  //       ProjectMonitoringStore.setMilestones(res['data']);
  //       return res;
  //     })
  //   );
  // }

  // getInduvalMilestons(id){
  //   return this._http.get<InduvalMilestone>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/'+id).pipe(
  //     map((res: InduvalMilestone) => {
  //       // ProjectMonitoringStore.setMilestones(res['data']);
  //       return res;
  //     })
  //   );
  // }

  // saveMileston(item){
  //   return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones', item).pipe(
  //     map((res:any )=> {
  //       this._utilityService.showSuccessMessage('Success!', 'Milestone created successfuly');
  //       // this.getItems().subscribe();
  //       return res;
  //     })
  //   );
  // }


  // updateMileston(item,id){
  //   return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/'+id, item).pipe(
  //     map((res:any )=> {
  //       this._utilityService.showSuccessMessage('Success!', 'Milestone updated successfuly');
  //       // this.getItems().subscribe();
  //       return res;
  //     })
  //   );
  // }

  // deleteMileston(id){
  //   return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/milestones/'+id).pipe(
  //     map((res:any )=> {
  //       this._utilityService.showSuccessMessage('Success!', 'Milestone deleted successfuly');
  //       // this.getItems().subscribe();
  //       return res;
  //     })
  //   );
  // }

  getScopes(params?:string){
    return this._http.get<ScopeOfWorkResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/scopes' + (params? params: '')).pipe(
      map((res: ScopeOfWorkResponse) => {
        ProjectMonitoringStore.setScopeOfWorks(res);
        return res;
      })
    );
  }

  saveScope(item,type){
    let typeMsg = ''
    if(type == 'in_scope'){
      typeMsg = 'in scope'
    }else if (type =='out_scope'){
      typeMsg = 'out of scope'
    }else {
      typeMsg = 'assumption'
    }
    return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/scopes', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Project '+typeMsg+' created successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  updateScope(item,id,type){
    let typeMsg = ''
    if(type == 'in_scope'){
      typeMsg = 'in scope'
    }else if (type =='out_scope'){
      typeMsg = 'out of scope'
    }else {
      typeMsg = 'assumption'
    }
    return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/scopes/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Project '+typeMsg+' updated successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteScope(id,type){
    let scope 
    if(type == 'in_scope'){
      scope = "Project in scope deleted successfuly"
    }else if(type == 'out_scope'){
      scope = 'Project out of scope deleted successfuly'
    }else {
      scope = 'Project assumption deleted successfuly'
    }
    return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/scopes/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!',  scope );
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getOutcomes(params?:string){
    return this._http.get<ScopeOfWorkResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/expected-outcomes' + (params? params: '')).pipe(
      map((res: ExpectedOutcomeResponse) => {
        ProjectMonitoringStore.setExpectedOutcomes(res['data']);
        return res;
      })
    );
  }

  saveOutcome(item){
    return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/expected-outcomes', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Expected outcome created successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  updateOutcome(item,id){
    return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/expected-outcomes/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Expected outcome updated successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteOutcome(id){
    return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/expected-outcomes/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Expected outcome deleted successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getDeliverables(params?:string){
    return this._http.get<DeliverableResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/deliverables' + (params? params: '')).pipe(
      map((res: DeliverableResponse) => {
        ProjectMonitoringStore.setDeliverables(res['data']);
        return res;
      })
    );
  }

  saveDeliverable(item){
    return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/deliverables', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Deliverables created successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  updateDeliverable(item,id){
    return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/deliverables/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Deliverables updated successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteDeliverable(id){
    return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/deliverables/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Deliverables deleted successfully');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  getStrategicAlignments(params?:string){
    return this._http.get<any>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/strategic-alignaments' + (params? params: '')).pipe(
      map((res) => {
        ProjectMonitoringStore.setStrategicAlignments(res);
        return res;
      })
    );
  }

  saveStrategicAlignment(item){
    return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/strategic-alignaments', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Strategic Alignment created successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  updateStrategicAlignment(item,id){
    return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/strategic-alignaments/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Strategic Alignment updated successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteStrategicAlignment(id){
    return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/strategic-alignaments/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'Strategic Alignment deleted successfuly');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getObjectives(id,params?:string){
    return this._http.get<ObjectiveResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/strategic-alignaments/project-themes/'+id + (params? params: '')).pipe(
      map((res: ObjectiveResponse) => {
        ProjectMonitoringStore.setThemeObjectives(res['objectives']);
        return res;
      })
    );
  }

  getItemStakeholder(getAll: boolean = false, additionalParams?: string, status: boolean = false): Observable<StakeholderPaginationResponse> {
		let params = '';
		if (!getAll) {
			params = `?page=${StakeholderStore.currentPage}`;
			if (StakeholderStore.orderBy) params += `&order_by=stakeholder.title&order=${StakeholderStore.orderBy}`;
		}
		if (StakeholderStore.searchText) params += (params ? '&q=' : '?q=') + StakeholderStore.searchText;
		if (additionalParams) params += additionalParams;
		if (status) params += (params ? '&' : '?') + 'status=all';
		return this._http.get<StakeholderPaginationResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/stakeholders' + (params ? params : '')).pipe(
			map((res: StakeholderPaginationResponse) => {
				StakeholderStore.setStakeholder(res);
				return res;
			})
		);
	}

  getStakeholder(params?:string){
    return this._http.get<StakeholderPaginationResponse>('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/stakeholders' + (params? params: '')).pipe(
      map((res: StakeholderPaginationResponse) => {
        StakeholderStore.setStakeholder(res);
        return res;
      })
    );
  }

  
  saveStakeholder(item){
    return this._http.post('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/stakeholders', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'stakeholder_created_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }


  
  updateStakeholder(item,id){
    return this._http.put('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/stakeholders/' + id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'stakeholder_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteStakeholder(id){
    return this._http.delete('/project-monitor/projects/'+ProjectMonitoringStore.selectedProjectId+'/stakeholders/' + id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'stakeholder_delete_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  sortProjects(type:string, text:string) {
    if (!ProjectMonitoringStore.orderBy) {
      ProjectMonitoringStore.orderBy = 'asc';
      ProjectMonitoringStore.orderItem = type;
    }
    else{
      if (ProjectMonitoringStore.orderItem == type) {
        if(ProjectMonitoringStore.orderBy == 'asc') ProjectMonitoringStore.orderBy = 'desc';
        else ProjectMonitoringStore.orderBy = 'asc'
      }
      else{
        ProjectMonitoringStore.orderBy = 'asc';
        ProjectMonitoringStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }

  sortStakeholderList(type: string, text: string) {
		if (!StakeholderStore.orderBy) {
			StakeholderStore.orderBy = 'asc';
			StakeholderStore.orderItem = type;
		}
		else {
			if (StakeholderStore.orderItem == type) {
				if (StakeholderStore.orderBy == 'asc') StakeholderStore.orderBy = 'desc';
				else StakeholderStore.orderBy = 'asc'
			}
			else {
				StakeholderStore.orderBy = 'asc';
				StakeholderStore.orderItem = type;
			}
		}
  }

  selectRequiredProjectMonitoring(issues) {
    ProjectMonitoringStore.addSelectedProjectMonitoring(issues);
  }
}
