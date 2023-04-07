import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { map } from 'rxjs/operators';
import { HistoryData, Investigation, InvestigationPaginationResponse, IncidentStatusPaginationResponse, IncidentStatus } from 'src/app/core/models/incident-management/investigation';
import { Observable } from 'rxjs';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';


@Injectable({
  providedIn: 'root'
})
export class InvestigationService {

  constructor( private _http: HttpClient,
    private _utilityService: UtilityService, 
    private _helperService: HelperServiceService) { }

    getAllinvestigation(getAll: boolean = false,additionalParams?:string,is_all:boolean = false){
      let params = '';
      if (!getAll) {
        params = `?page=${IncidentInvestigationStore.currentPage}`;
        if (IncidentInvestigationStore.orderBy) params += `&order_by=${IncidentInvestigationStore.orderItem}&order=${IncidentInvestigationStore.orderBy}`;
  
      }
      if(additionalParams) params += additionalParams;
      if(IncidentInvestigationStore.searchText) params += (params ? '&q=' : '?q=')+IncidentInvestigationStore.searchText;
      if(is_all) params += '&status=all';
      return this._http.get<InvestigationPaginationResponse>('/incident-investigations' + (params ? params : '')).pipe(
        map((res: InvestigationPaginationResponse ) => {
          IncidentInvestigationStore.setInvestigations(res);
          return res;
        })
      );

    }

    delete(id: number) {
      return this._http.delete('/incident-investigations/' + id).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success', 'incident_investigation_deleted');
          this.getAllinvestigation().subscribe(resp=>{
            if(resp.from==null){
              IncidentInvestigationStore.setCurrentPage(resp.current_page != 1 ? resp.current_page-1 : 1);
              this.getAllinvestigation().subscribe();
            }
          });
  
          return res;
        })
      );
    }

    setDocumentDetails(imageDetails,url){
      IncidentInvestigationStore.setDocumentDetails(imageDetails,url);
    }

    getItem(id) :Observable<Investigation> {
      return this._http.get<Investigation>('/incident-investigations/'+id).pipe((
        map((res:Investigation)=>{
          IncidentInvestigationStore.setIndividualInvestigationItem(res);
          return res;
        })
      ))
    }

    exportToExcel() {
      let params = '';
    if (IncidentInvestigationStore.orderBy) params += `?order=${IncidentInvestigationStore.orderBy}`;
    if (IncidentInvestigationStore.orderItem) params += `&order_by=${IncidentInvestigationStore.orderItem}`;
    // if (IncidentInvestigationStore.searchText) params += `&q=${IncidentInvestigationStore.searchText}`;
    // if(RightSidebarLayoutStore.filterPageTag == 'incident_register' && RightSidebarLayoutStore.filtersAsQueryString)
    //   params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
      this._http.get('/incident-investigations/export'+params, { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('investigation') +".xlsx");
        }
      )
    }

    generateTemplate() {
      this._http.get('/incident-investigations/template', { responseType: 'blob' as 'json' }).subscribe(
        (response: any) => {
          this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('investigation_template') +".xlsx");
        }
      )
    }

    shareData(data){
      return this._http.post('/incident-investigations/share',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','common_share_toast');
          return res;
        })
      )
    }

    sortInvestigationList(type:string, text:string) {
      if (!IncidentInvestigationStore.orderBy) {
        IncidentInvestigationStore.orderBy = 'desc';
        IncidentInvestigationStore.orderItem = type;
      }
      else{
        if (IncidentInvestigationStore.orderItem == type) {
          if(IncidentInvestigationStore.orderBy == 'desc') IncidentInvestigationStore.orderBy = 'asc';
          else IncidentInvestigationStore.orderBy = 'desc'
        }
        else{
          IncidentInvestigationStore.orderBy = 'desc';
          IncidentInvestigationStore.orderItem = type;
        }
      }
    //   if(!text)
    //   this.getItems().subscribe();
    // else
    // this.getItems(false,`&q=${text}`).subscribe();
    }

    addInvestigationInvolvedUser(data){
      return this._http.put('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/involved-users',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_involved_user_added');
          return res;
        })
      )
    }

    deleteInvestigationInvolvedUser(id){
      return this._http.delete('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/involved-users/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_involved_user_deleted');
          return res;
        })
      )
    }

    addInvestigationInvolvedOtherUser(data){
      return this._http.put('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/involved-other-users',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_involved_other_user_added');
          return res;
        })
      )
    }

    deleteInvestigationInvolvedOtherUser(id){
      return this._http.delete('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/involved-other-users/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_involved_other_user_deleted');
          return res;
        })
      )
    }
    
    closeInvestigation(id){
      return this._http.put('/incident-investigations/'+id+'/close',id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_closed');
          return res;
        })
      )
    }

    addInvestigationInvolvedWitnessUser(data){
      return this._http.put('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/witness-users',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_involved_witness_user_added');
          return res;
        })
      )
    }

    deleteInvestigationInvolvedWitnessUser(id){
      return this._http.delete('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/witness-users/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_involved_witness_user_deleted');
          return res;
        })
      )
    }

    addInvestigationInvolvedWitnessOtherUser(data){
      return this._http.put('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/witness-other-users',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_involved_witness_other_user_added');
          return res;
        })
      )
    }

    deleteInvestigationInvolvedWitnessOtherUser(id){
      return this._http.delete('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/witness-other-users/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_involved_witness_other_user_deleted');
          return res;
        })
      )
    }

    addInvestigationRecomendation(data){
      return this._http.put('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/recommendations',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_recomendation_added');
          return res;
        })
      )
    }

    deleteInvestigationRecomendation(id){
      return this._http.delete('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/recommendations/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_recomendation_deleted');
          return res;
        })
      )
    }

    addInvestigationInvestigationPoint(data){
      return this._http.put('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/points',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_point_added');
          return res;
        })
      )
    }  

    deleteInvestigationInvestigationPoint(id){
      return this._http.delete('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/points/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_point_deleted');
          return res;
        })
      )
    }

    addInvestigationReferences(data){
      return this._http.put('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/references',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_references_added');
          return res;
        })
      )
    } 

    deleteInvestigationReferences(id){
      return this._http.delete('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/references/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_references_deleted');
          return res;
        })
      )
    }

    addInvestigationObservations(data){
      return this._http.put('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/observations',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_observation_added');
          return res;
        })
      )
    } 

    deleteInvestigationObservations(id){
      return this._http.delete('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/observations/'+id).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_observation_deleted');
          return res;
        })
      )
    }


    saveInvestigationProgress(data){
      return this._http.post('/incident-investigations/'+IncidentInvestigationStore.selectedId+'/updates',data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('success','incident_investigation_progress');
          return res;
        })
      )
    }

    getInvestigationStatus(): Observable<IncidentStatusPaginationResponse>{
      return this._http.get<IncidentStatusPaginationResponse>('/incident-investigation-statuses').pipe(
        map((res: IncidentStatusPaginationResponse ) => {
          IncidentInvestigationStore.setInvestigationStatus(res);
          return res;
        })
      );
    }

    

    getUpdateData(id: number): Observable<HistoryData> {
      let params='';
      params = (params=='')?params+`?page=${IncidentInvestigationStore.historyCurrentPage}`:params+`&page=${IncidentInvestigationStore.historyCurrentPage}`;
      params=params+'&order_by=created_at&order=desc&limit=5';
      return this._http.get<HistoryData>('/incident-investigations/'+id+'/updates'+(params?params:'')).pipe(
        map((res: HistoryData) => {
          IncidentInvestigationStore.setTreatmentUpdateData(res);
          // RisksStore.updateRisk(res)
          return res;
        })
      );
    }

}
