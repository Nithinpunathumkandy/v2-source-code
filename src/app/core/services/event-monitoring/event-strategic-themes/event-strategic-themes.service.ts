import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { StrategicThemesStore } from 'src/app/stores/event-monitoring/events/event-strategic-themes-store';
import {ProjectTheme,ProjectThemePaginationResponse,ProjectThemeSingle} from 'src/app/core/models/masters/project-monitoring/project-theme'
import {ProjectThemeMasterStore} from 'src/app/stores/masters/project-monitoring/project-theme-store';

@Injectable({
  providedIn: 'root'
})
export class EventStrategicThemesService {
  EventsStore=EventsStore;
  StrategicThemesStore=StrategicThemesStore;
  ProjectThemeMasterStore=ProjectThemeMasterStore;
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService,
    ) { }

    saveObjective(item) {
      return this._http.post(`/events/${EventsStore.selectedEventId}/objectives`, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','events_objective_added');
          //console.log(EventsStore.selectedEventId)
           this.getEventObjective().subscribe();
          return res;
        })
      );
    }

    updateObjective(item,id) {
      return this._http.put(`/events/${EventsStore.selectedEventId}/objectives/`+id, item).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','events_objective_updated');
          //console.log(EventsStore.selectedEventId)
           this.getEventObjective().subscribe();
          return res;
        })
      );
    }

    deleteEventObjective(id) {
      return this._http.delete(`/events/${EventsStore.selectedEventId}/objectives/`+id,).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','events_objective_deleted');
          //console.log(EventsStore.selectedEventId)
           this.getEventObjective().subscribe();
          return res;
        })
      );
    }

    deleteEventTheme(id) {
      return this._http.delete(`/events/${EventsStore.selectedEventId}/strategic-themes/`+id,).pipe(
        map(res => {
          this._utilityService.showSuccessMessage('success','event_strategic_theme_deleted');
          //console.log(EventsStore.selectedEventId)
           this.getSingleEventObjectiveDetails(StrategicThemesStore?._selectedEventObjectId).subscribe();
          return res;
        })
      );
    }

    getEventObjective()
    {
      return this._http.get<any>(`/events/${EventsStore.selectedEventId}/objectives`).pipe(
        map((res: any) => {
          StrategicThemesStore.setEventObjectives(res);
          return res;
        })
      );
    }

    getSingleEventObjectiveDetails(id)
    {
      return this._http.get<any>(`/events/${EventsStore.selectedEventId}/objectives/${id}`).pipe(
        map((res: any) => {
        StrategicThemesStore.setSingleEventObjectiveDetails(res);
          return res;
        })
      );
    }

    getEventThemes(getAll: boolean = false, additionalParams?:string,is_all:boolean = false): Observable<ProjectThemePaginationResponse>
    {
        let params = '';
        if (!getAll) {
          params = `?page=${ProjectThemeMasterStore.currentPage}`;
          if (ProjectThemeMasterStore.orderBy)
            params += `&order_by=${ProjectThemeMasterStore.orderItem}&order=${ProjectThemeMasterStore.orderBy}`;
        }
        if(additionalParams) params += additionalParams;
        if(is_all) params += '&status=all'
        if(ProjectThemeMasterStore.searchText) params += (params ? '&q=' : '?q=')+ProjectThemeMasterStore.searchText;

        return this._http
          .get<ProjectThemePaginationResponse>('/project-themes'+(params ? params : ''))
          .pipe(
            map((res: ProjectThemePaginationResponse) => {
              StrategicThemesStore.setEventTheme(res);
              return res;
            })
          );
    }

    getObjectives(id,params?:string){
      return this._http.get<any>('/project-monitor/projects/'+EventsStore.selectedEventId+'/strategic-alignaments/project-themes/'+id + (params? params: '')).pipe(
        map((res: any) => {
          StrategicThemesStore.setThemeObjectives(res['objectives']);
          return res;
        })
      );
    }

    saveStrategicTheme(item,id){
      return this._http.post('/events/'+EventsStore.selectedEventId+'/strategic-themes', item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'strategic_theme_created_successfuly');
          this.getSingleEventObjectiveDetails(id).subscribe();
          return res;
        })
      );
    }

    updateStrategicTheme(item,id,themeId){
      return this._http.put('/events/'+EventsStore.selectedEventId+'/strategic-themes/'+themeId, item).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'strategic_theme_updated_successfuly');
          this.getSingleEventObjectiveDetails(id).subscribe();
          return res;
        })
      );
    }

    updateActualExposure(kpiId,data,id){
      return this._http.put('/events/strategic-themes/kpi/'+kpiId, data).pipe(
        map((res:any )=> {
          this._utilityService.showSuccessMessage('Success!', 'actual_exposure_updated_successfuly');
          this.getSingleEventObjectiveDetails(id).subscribe();
          return res;
        })
      );
    }
}
