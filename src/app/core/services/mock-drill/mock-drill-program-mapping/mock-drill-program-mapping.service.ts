import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProgramMapping } from 'src/app/core/models/mock-drill/mock-drill-program/mock-drill-program';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';

@Injectable({
  providedIn: 'root'
})
export class MockDrillProgramMappingService {
  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }


  getMockDrillMapping(id) {
    return this._http.get<ProgramMapping>('/mock-drill/mock-drill-programs/' + id + '/mapping').pipe((
      map((res: any) => {
        // var data = { id: res.id, title: res.title, projects: res.project, process: res.process, events: res.event, events: res.event }

        // events;
        // locations;
        // site;
        MockDrillProgramStore.setProgramMappingItems(res);
        return res;
      })
    ))

  }

  saveProcessForMapping(saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/process-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  saveProjectForMapping(saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/project-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );

  }
  saveLocationForMapping(saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/locations-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );

  }
  saveSiteForMapping(saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/site-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }
  saveEventForMapping(saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/event-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );

  }

  saveProductsForMapping(saveData): Observable<any> {
    return this._http.post('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/product-mapping', saveData).pipe(
      map(res => {
        return res;
      })
    );
  }

  deleteProcessMapping(id) {

    return this._http.delete('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/process-mapping/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'process_deleted_successfully');
        this.getMockDrillMapping(MockDrillProgramStore.mock_drill_program_id).subscribe();
        return res;
      })
    );
  }

  deleteProjectMapping(id) {
    return this._http.delete('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/project-mapping/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'project_deleted_successfully');
        this.getMockDrillMapping(MockDrillProgramStore.mock_drill_program_id).subscribe();
        return res;
      })
    );
  }

  deleteEventMapping(id) {
    return this._http.delete('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/event-mapping/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'event_deleted_successfully');
        this.getMockDrillMapping(MockDrillProgramStore.mock_drill_program_id).subscribe();
        return res;
      })
    );
  }
  deleteLocationMapping(id) {
    return this._http.delete('/mock-drill/mock-drill-programs/' + MockDrillProgramStore.mock_drill_program_id + '/locations-mapping/' + id).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('Success!', 'location_deleted_successfully');
        this.getMockDrillMapping(MockDrillProgramStore.mock_drill_program_id).subscribe();
        return res;
      })
    );
  }

}
