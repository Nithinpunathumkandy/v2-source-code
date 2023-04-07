import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { map } from 'rxjs/operators';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { FocusAreaResponse, InduvalObjectives, InduvalStrategyProfile, KpiResponse, NoteDetails, ObjectiveResponse, StrategyInduvalProfileNote, StrategyProfileNotesResponse, StrategyProfileResponse, Strategy, historyPaginationData } from 'src/app/core/models/strategy-management/strategy.model';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { Observable } from 'rxjs';
import { HelperServiceService } from '../../general/helper-service/helper-service.service';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class StrategyService {

  constructor(private _http: HttpClient, private _helperService: HelperServiceService,
    private _utilityService: UtilityService) { }

  getItems(getAll: boolean = false, additionalParams?: string, is_all: boolean = false): Observable<StrategyProfileResponse> {
    let params = '';
    if (!getAll) {
      params = `?page=${StrategyStore.currentPage}`;
      if (StrategyStore.orderBy) params += `&order_by=${StrategyStore.orderItem}&order=${StrategyStore.orderBy}`;

    }
    if (additionalParams) params += additionalParams;
    if (StrategyStore.searchText) params += (params ? '&q=' : '?q=') + StrategyStore.searchText;
    if (is_all) params += '&status=all';
    if (RightSidebarLayoutStore.filterPageTag == 'strategy_profile' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<StrategyProfileResponse>('/strategy-profiles' + (params ? params : '')).pipe(
      map((res: StrategyProfileResponse) => {
        StrategyStore.setProfiles(res);
        return res;
      })
    );

  }

  getAllItems(additionalParams?) {
    let params = '';
    if (additionalParams) params += additionalParams;
    if (RightSidebarLayoutStore.filterPageTag == 'strategy`' && RightSidebarLayoutStore.filtersAsQueryString)
      params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    return this._http.get<Strategy[]>('/strategy-profiles' + (params ? params : '')).pipe(
      map((res: Strategy[]) => {
        StrategyStore.setAllProfiles(res);
        return res;
      })
    );
  }

  deleteStrategyProfile(id) {
    return this._http.delete('/strategy-profiles/' + id).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_profile_delete_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  closeStrategyProfile(id) {
    return this._http.put('/strategy-profiles/' + id + '/close', '').pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_profile_close_message');
        this.getItems().subscribe();
        return res;
      })
    );
  }

  activateStrategyProfile(id, item) {
    return this._http.put('/strategy-profiles/' + id + '/activate', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_profile_activate_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  passiveStrategyProfile(id, item) {
    return this._http.put('/strategy-profiles/' + id + '/passivate', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_profile_passivate_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getItem(id) {
    return this._http.get<InduvalStrategyProfile>('/strategy-profiles/' + id).pipe((
      map((res) => {
        StrategyStore.setIndividualStrategyProfile(res);
        return res;
      })
    ))
  }

  saveStrategyProfiles(item) {
    return this._http.post('/strategy-profiles', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_profile_create_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }
  updateStrategyProfiles(item, id) {
    return this._http.put('/strategy-profiles/' + id, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_profile_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  addNotes(item) {
    return this._http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/notes', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_notes_create_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  updateNotes(item, id) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/notes/' + id, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_notes_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  strategyProfileNotsList() {
    return this._http.get<StrategyProfileNotesResponse>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/notes').pipe(
      map((res: StrategyProfileNotesResponse) => {
        StrategyStore.setProfileNots(res['data']);
        return res;
      })
    );
  }

  updateStrategyWhiteSheet(item) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/white-sheets', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_whitesheet_create_message');
        // this.getItems().subscribe();
        return res;
      })
    );

  }

  getInduvalNote(id) {
    return this._http.get<StrategyInduvalProfileNote>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/notes/' + id).pipe((
      map((res: NoteDetails) => {
        StrategyStore.setNoteDetails(res);
        return res;
      })
    ))
  }

  deleteNotes(id) {
    return this._http.delete('/strategy-profiles/' + StrategyStore.strategyProfileId + '/notes/' + id).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_notes_delete_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  addFocusArea(item) {
    return this._http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_focusarea_create_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  focusAreaList(is_all: boolean = false, additionalParams?: string) {
    let params = additionalParams ? additionalParams : '';
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_kpi_scorecard' && RightSidebarLayoutStore.filtersAsQueryString)
    params = (params == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (params + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if (is_all) params += '?status=all';
    return this._http.get<FocusAreaResponse>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas' + (params ? params : '')).pipe(
      map((res: FocusAreaResponse) => {
        StrategyStore.setFocusAreas(res['data']);
        return res;
      })
    );
  }

  focusAreaListForFilter() {
    return this._http.get<FocusAreaResponse>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas').pipe(
      map((res: FocusAreaResponse) => {
        StrategyStore.setFocusAreasForFilter(res['data']);
        return res;
      })
    );
  }

  induvalFocusArea(id) {
    return this._http.get('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + id).pipe(
      map((res) => {
        // StrategyStore.setFocusAreas(res['data']);
        return res;
      })
    );
  }
  updateFocusArea(item, id) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + id, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_focusarea_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  deleteFocusArea(id) {
    return this._http.delete('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + id).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_focusarea_delete_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  closeFocusArea(id) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + id + '/close', '').pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_focusarea_close_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  activateFocusArea(id, item) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + id + '/activate', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_focusarea_activate_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  passivateFocusArea(id, item) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + id + '/passivate', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_focusarea_passivate_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  saveObjectives(item) {
    return this._http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_objective_create_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  updateObjectives(item, id) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + id, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_objective_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );


  }
  objectivesList(id, is_all: boolean = false, additionalParams?: string) {
    let params = additionalParams ? additionalParams : '';
    if (is_all) params += '?status=all';
    return this._http.get<ObjectiveResponse>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + id + '/objectives' + (params ? params : '')).pipe(
      map((res: ObjectiveResponse) => {
        StrategyStore.setObjectives(res['data']);
        return res;
      })
    );
  }

  getObjectiveList(additionalParams?: string){
    let params = '';
    if(additionalParams) params += additionalParams;
    return this._http.get<any>('/strategy-profile-objectives' +(params?params:'')).pipe((
      map((res:any)=>{
        StrategyStore.setObjectives(res['data']);
        return res;
      })
    ))
  }
  
  induvalObjectives(id, focusAreaId) {
    return this._http.get('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + focusAreaId + '/objectives/' + id).pipe(
      map((res: InduvalObjectives) => {
        StrategyStore.setInduvalObjectives(res);
        return res;
      })
    );
  }

  deleteObjective(id) {
    return this._http.delete('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + id).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_objective_delete_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  closeObjective(id) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + id + '/close', '').pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_objective_close_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }
  addKpi(item,) {
    return this._http.post('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_kpi_create_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  updateKpi(item, id) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis/' + id, item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_kpi_update_message');
        // this.getItems().subscribe();
        return res;
      })
    );
  }

  getAllKpis(is_all: boolean = false, additionalParams?: string) {
    let params = additionalParams ? additionalParams : '';
    if (is_all) params += '?status=all';
    return this._http.get<KpiResponse>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis' + (params ? params : '')).pipe(
      map((res: KpiResponse) => {
        StrategyStore.setKpis(res['data']);
        return res;
      })
    );
  }

  induvalKpi(id) {
    return this._http.get('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis/' + id).pipe(
      map((res) => {
        StrategyStore.setInduvalKpi(res);
        return res;
      })
    );
  }

  deleteKpi(id) {
    return this._http.delete('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis/' + id).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_kpi_delete_message');
        // StrategyStore.setFocusAreas(res['data']);
        return res;
      })
    );
  }

  closeKpi(id) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis/' + id + '/close', '').pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_kpi_close_message');
        // StrategyStore.setFocusAreas(res['data']);
        return res;
      })
    );
  }

  activateKpi(id, item) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis/' + id + '/activate', item).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_kpi_activate_message');
        // StrategyStore.setFocusAreas(res['data']);
        return res;
      })
    );
  }

  passivateKpi(id, item) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis/' + id + '/passivate', item).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_kpi_passivate_message');
        // StrategyStore.setFocusAreas(res['data']);
        return res;
      })
    );
  }

  activateObjectives(id, item) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/activate', item).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_objective_activate_message');
        // StrategyStore.setFocusAreas(res['data']);
        return res;
      })
    );
  }

  passivateObjectives(id, item) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/passivate', item).pipe(
      map((res) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_objective_passivate_message');
        // StrategyStore.setFocusAreas(res['data']);
        return res;
      })
    );
  }

  generateTemplate() {
    this._http.get('/strategy-profiles/template', { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Strategy Profile') + ".xlsx");
      }
    )
  }

  exportToExcel(params: string = '') {
    let sortparams = '';
    if (StrategyStore.orderBy) sortparams += `?order=${StrategyStore.orderBy}`;
    if (StrategyStore.orderItem) sortparams += `&order_by=${StrategyStore.orderItem}`;
    // if (StrategyStore.searchText) params += `&q=${StrategyStore.searchText}`;
    if(RightSidebarLayoutStore.filterPageTag == 'strategy_profile' && RightSidebarLayoutStore.filtersAsQueryString)
      sortparams = (sortparams == '') ? ('?' + RightSidebarLayoutStore.filtersAsQueryString) : (sortparams + '&' + RightSidebarLayoutStore.filtersAsQueryString);
    if(params)sortparams=sortparams+params
    this._http.get('/strategy-profiles/export' + sortparams, { responseType: 'blob' as 'json' }).subscribe(
      (response: any) => {
        this._utilityService.downloadFile(response, this._helperService.translateToUserLanguage('Strategy Profile') + ".xlsx");
      }
    )
  }

  getThumbnailPreview(type, token, h?: number, w?: number) {
    // +(h && w)?'&h='+h+'&w='+w:''
    switch (type) {
      case 'profile': return environment.apiBasePath + '/strategy-management/files/strategy-profiles/thumbnail?token=' + token;
        break;
    }
  }

  setDocumentDetails(imageDetails, url) {
    StrategyStore.setDocumentDetails(imageDetails, url);
  }

  getSelectedNotes(profileId) {
    return this._http.get('/strategy-profiles/' + profileId + '/notes').pipe(
      map((res) => {
        StrategyStore.setSelectedProfileNotes(res);
        return res;
      })
    );
  }

  getObjectiveTargetBreakdown() {
    return this._http.get('/strategy-profiles/' + StrategyStore._strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/review-targets').pipe(
      map((res) => {
        StrategyStore.setObjectiveTargetBreakdown(res);
        return res;
      })
    );
  }

  getObjectiveInduvalReview(id) {
    return this._http.get('/strategy-profiles/' + StrategyStore._strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/review-target/' + id).pipe(
      map((res) => {
        // StrategyStore.setObjectiveTargetBreakdown(res);
        return res;
      })
    );
  }

  updateObjectiveTargetBreakdown(item) {
    return this._http.put('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/target-breakdown', item).pipe(
      map((res: any) => {
        this._utilityService.showSuccessMessage('Success!', 'sm_objective_target_breakdown_update_message');
        return res;
      })
    );
  }

  getProfileActivityHistory(id: number): Observable<historyPaginationData>{
    return this._http.get<historyPaginationData>('/strategy-profiles/' + id + '/activity-history').pipe(
      map((res :historyPaginationData ) => {
        StrategyStore.setHistory(res);
        return res;
      })
    );
  }

  getFocusAreaActivityHistory(id: number): Observable<historyPaginationData>{
    return this._http.get<historyPaginationData>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + id + '/activity-history').pipe(
      map((res :historyPaginationData ) => {
        StrategyStore.setHistory(res);
        return res;
      })
    );
  }

  getObjectiveActivityHistory(id: number): Observable<historyPaginationData>{
    return this._http.get<historyPaginationData>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + id + '/activity-history').pipe(
      map((res :historyPaginationData ) => {
        StrategyStore.setHistory(res);
        return res;
      })
    );
  }

  getKPIActivityHistory(id: number): Observable<historyPaginationData>{
    return this._http.get<historyPaginationData>('/strategy-profiles/' + StrategyStore.strategyProfileId + '/focus-areas/' + StrategyStore.focusAreaId + '/objectives/' + StrategyStore.objectiveId + '/kpis/' + id + '/activity-history').pipe(
      map((res :historyPaginationData ) => {
        StrategyStore.setHistory(res);
        return res;
      })
    );
  }

  sortStrategyProfiles(type: string, text: string) {
    if (!StrategyStore.orderBy) {
      StrategyStore.orderBy = 'asc';
      StrategyStore.orderItem = type;
    }
    else {
      if (StrategyStore.orderItem == type) {
        if (StrategyStore.orderBy == 'asc') StrategyStore.orderBy = 'desc';
        else StrategyStore.orderBy = 'asc'
      }
      else {
        StrategyStore.orderBy = 'asc';
        StrategyStore.orderItem = type;
      }
    }
  }


}

