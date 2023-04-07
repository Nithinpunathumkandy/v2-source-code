import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { IndividualMeetings, MeetingsPaginationResponse } from 'src/app/core/models/mrm/meetings/meetings';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { MeetingsStore } from 'src/app/stores/mrm/meetings/meetings-store';

@Injectable({
  providedIn: 'root'
})
export class UnplannedMeetingService {

  constructor(private _http: HttpClient,
    private _utilityService: UtilityService) { }
  
    saveItem(data): Observable<any> {
    return this._http.post('/unplanned-meetings', data).pipe(
      map(res => {
        this._utilityService.showSuccessMessage('success', 'meeting_is_added');
        return res;
      })
    );
  }
}
