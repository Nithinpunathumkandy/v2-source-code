import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IncidentCorrectiveActionPaginationResponse } from 'src/app/core/models/incident-management/incident/corrective-action/incident-corrective-action';
import { Incident, IncidentInvestigators, IncidentPaginationResponse, rootCause } from 'src/app/core/models/incident-management/incident/incident';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { IncidentCorrectiveActionStore } from 'src/app/stores/incident-management/corrective-action/corrective-action-store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';

@Injectable({
  providedIn: 'root'
})
export class IncidentService {

  constructor(private _http: HttpClient,
              private _utilityService: UtilityService,
              private _helperService: HelperServiceService
    ) { }

  getItems(getAll: boolean = false,additionalParams?:string,is_all:boolean = false): Observable<IncidentPaginationResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${IncidentStore.currentPage}`;
      if (IncidentStore.orderBy) params += `&order_by=${IncidentStore.orderItem}&order=${IncidentStore.orderBy}`;

    }
    if(additionalParams) params += additionalParams;
    if(IncidentStore.searchText) params += (params ? '&q=' : '?q=')+IncidentStore.searchText;
    if(is_all) params += '&status=all';
    if(RightSidebarLayoutStore.filterPageTag == 'incident_register' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<IncidentPaginationResponse>('/incidents' + (params ? params : '')).pipe(
      map((res: IncidentPaginationResponse) => {
        IncidentStore.setIncidents(res);
        return res;
      })
    );
 
  }

  updateIncidentItem(id:number, item: any): Observable<any> {
    return this._http.put('/incidents/' + id, item).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_updated');
        this.getItems().subscribe();
        return res;
      })
    );
  }

   
  delete(id: number) {
    return this._http.delete('/incidents/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'incident_deleted');
        this.getItems().subscribe(resp=>{
          if(resp.from==null){
            IncidentStore.setCurrentPage(resp.current_page != 1 ? resp.current_page-1 : 1);
            this.getItems().subscribe();
          }
        });

        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/incidents/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response,this._helperService.translateToUserLanguage('incident_template') +".xlsx");
      }
    )
  }

  exportToExcel() {
    let params = '';
    if (IncidentStore.orderBy) params += `?order=${IncidentStore.orderBy}`;
    if (IncidentStore.orderItem) params += `&order_by=${IncidentStore.orderItem}`;
    // if (IncidentStore.searchText) params += `&q=${IncidentStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'incident_register' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    this._http.get('/incidents/export'+params, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('incident') +".xlsx");
      }
    )
  }

  importData(data){
    const formData = new FormData();
    formData.append('file',data);
    return this._http.post('/incidents/import',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','incidents_imported');
        this.getItems().subscribe();
        return res;
      })
    )
  }

  searchIncident(params){
    return this.getItems(false, params ? params : '').pipe(
      map((res: IncidentPaginationResponse) => {
        IncidentStore.setIncidents(res);
        return res;
      })
    );
  }
  sortIncidentList(type:string, text:string) {
    if (!IncidentStore.orderBy) {
      IncidentStore.orderBy = 'asc';
      IncidentStore.orderItem = type;
    }
    else{
      if (IncidentStore.orderItem == type) {
        if(IncidentStore.orderBy == 'asc') IncidentStore.orderBy = 'desc';
        else IncidentStore.orderBy = 'asc'
      }
      else{
        IncidentStore.orderBy = 'asc';
        IncidentStore.orderItem = type;
      }
    }
  //   if(!text)
  //   this.getItems().subscribe();
  // else
  // this.getItems(false,`&q=${text}`).subscribe();
  }


  getItem(id): Observable<Incident> {
    IncidentInvestigationStore.involvedUserDetails = [];
    IncidentInvestigationStore.witnessUserDetails = [];
    IncidentStore.otherInvolvedUserDetails = [];
    IncidentStore.otherWitnessUserDetails = [];
    return this._http.get<Incident>('/incidents/'+id).pipe((
      map((res:Incident)=>{
        if(res['investigation'].length !=0){
          IncidentInvestigationStore.selectedInvestigationId = res['investigation'][0].id
        }else{
          IncidentInvestigationStore.selectedInvestigationId = null
        }
        IncidentStore.setIndividualIncidentItem(res);
        // res['involved_users'].map(data=>{
        //   IncidentInvestigationStore.setInvolvedUserDetails( res['involved_users']);
        // })
        // res['witness_users'].map(data=>{
        //   IncidentInvestigationStore.setWitnessUserDetails(data)
        // })
        // res['involved_other_users'].map(data=>{
        //   IncidentStore.setOtherInvolvedUserDetails(data)
        // })
        // res['witness_other_users'].map(data=>{
        //   IncidentStore.setOtherWitnessUserDetails(data)
        // })
        return res;
      })
    ))
  }

  mapingFun(){
    if(IncidentInvestigationStore.investigationItemDetails){
      IncidentInvestigationStore.investigationItemDetails.investigation_involved_users.forEach(element => {
        IncidentInvestigationStore.setInvolvedUserDetails( element);
       });
      IncidentInvestigationStore.investigationItemDetails.investigation_witness_users.forEach(data=>{
        IncidentInvestigationStore.setWitnessUserDetails(data)
      });
      IncidentInvestigationStore.investigationItemDetails.involved_other_users.forEach(data=>{
        IncidentStore.setOtherInvolvedUserDetails(data)
      })
      IncidentInvestigationStore.investigationItemDetails.witness_other_users.forEach(data=>{
        IncidentStore.setOtherWitnessUserDetails(data)
      })
    }else{
      IncidentStore.IncidentItemDetails.involved_users.forEach(element => {
        IncidentInvestigationStore.setInvolvedUserDetails( element);
       });
       IncidentStore.IncidentItemDetails.witness_users.forEach(data=>{
        IncidentInvestigationStore.setWitnessUserDetails(data)
      });
      IncidentStore.IncidentItemDetails.involved_other_users.forEach(data=>{
        IncidentStore.setOtherInvolvedUserDetails(data)
      })
      IncidentStore.IncidentItemDetails.witness_other_users.forEach(data=>{
        IncidentStore.setOtherWitnessUserDetails(data)
      })
    }
   
  }

  setDocumentDetails(imageDetails,url){
    IncidentStore.setDocumentDetails(imageDetails,url);
  }

  saveIncident(item){
    return this._http.post('/incidents', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('Success!', 'incident_added');
        this.getItems().subscribe();
        return res;
      })
    );
  }


  getInvestigation(id){
    return this._http.get<IncidentInvestigators>('/incidents/'+id+'/investigators').pipe((
      map((res)=>{
        IncidentStore.setIncidentInvestigators(res);
        return res;
      })
    ))
  }

  addInvestigator(item){
    return this._http.put('/incidents/'+IncidentStore.selectedId+'/investigators', item).pipe(
      map((res:IncidentInvestigators )=> {
        this._utilityService.showSuccessMessage('success', 'investigators_added');
        this.getInvestigation(IncidentStore.selectedId).subscribe();
        return res;
      })
    );
  }

  deleteInvestigator(userId,type){
    return this._http.delete('/incidents/'+ IncidentStore.selectedId + '/investigators/'+userId + '?type='+type).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'investigators_deleted');
        this.getInvestigation(IncidentStore.selectedId).subscribe();
        return res;
      })
    );

  }

  saveInvestigation(item){
    return this._http.post('/incident-investigations', item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'investigation_added');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

   updateInvestigation(id:number, item: any){
    return this._http.put('/incident-investigations/'+id, item).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success', 'investigation_updated');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  rootCauseAnalysis(){
    return this._http.get<rootCause>('/incidents/'+IncidentStore.selectedId+'/root-cause-analyses').pipe((
      map((res)=>{
        IncidentStore.setRootCauseAnalysis(res['data']);
        IncidentStore.setTotalItems(res['total'])
        return res;
      })
    ))
  }


  saveRootCauseAnalysis(item){
    return this._http.post('/incidents/'+IncidentStore.selectedId+'/root-cause-analyses', item).pipe(
      map((res )=> {
        this._utilityService.showSuccessMessage('success', 'incident_root_cause_created');
        this.rootCauseAnalysis().subscribe();
        return res;
      })
    );
  }

  deleteRCA(id){
    return this._http.delete('/incidents/'+IncidentStore.selectedId+'/root-cause-analyses/'+id).pipe(
      map((res )=> {
        this._utilityService.showSuccessMessage('success', 'incident_root_cause_deleted');
        // this.rootCauseAnalysis().subscribe();
        return res;
      })
    );
  }

  updateRootCauseAnalysis(id,item){
    return this._http.put('/incidents/'+IncidentStore.selectedId+'/root-cause-analyses/'+id, item).pipe(
      map((res )=> {
        this._utilityService.showSuccessMessage('success', 'incident_root_cause_updated');
        this.rootCauseAnalysis().subscribe();
        return res;
      })
    );
  }


  addIncidentInvolvedUser(data){
    return this._http.put('/incidents/'+IncidentStore.selectedId+'/involved-users',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','involved_user_added');
        return res;
      })
    )
  }
  
  deleteIncidentInvolvedUser(id){
    return this._http.delete('/incidents/'+IncidentStore.selectedId+'/involved-users/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','involved_user_deleted');
        return res;
      })
    )
  }
  
  addIncidentInvolvedOtherUser(data){
    return this._http.put('/incidents/'+IncidentStore.selectedId+'/involved-other-users',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','involved_other_user_added');
        return res;
      })
    )
  }
  
  deleteIncidentInvolvedOtherUser(id){
    return this._http.delete('/incidents/'+IncidentStore.selectedId+'/involved-other-users/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','involved_other_user_deleted');
        return res;
      })
    )
  }
  
  addIncidentInvolvedWitnessUser(data){
    return this._http.put('/incidents/'+IncidentStore.selectedId+'/witness-users',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','involved_witness_user_added');
        return res;
      })
    )
  }
  
  deleteIncidentInvolvedWitnessUser(id){
    return this._http.delete('/incidents/'+IncidentStore.selectedId+'/witness-users/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','involved_witness_user_deleted');
        return res;
      })
    )
  }
  
  addIncidentInvolvedWitnessOtherUser(data){
    return this._http.put('/incidents/'+IncidentStore.selectedId+'/witness-other-users',data).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','involved_witness_other_user_added');
        return res;
      })
    )
  }
  
  deleteIncidentInvolvedWitnessOtherUser(id){
    return this._http.delete('/incidents/'+IncidentStore.selectedId+'/witness-other-users/'+id).pipe(
      map((res:any )=> {
        this._utilityService.showSuccessMessage('success','involved_witness_other_user_deleted');
        return res;
      })
    )
  }

  selectRequiredIncident(issues){
   
		IncidentStore.addSelectedIncidents(issues);
	  }

}
