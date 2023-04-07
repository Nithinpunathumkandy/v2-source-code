import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import {ExcellentTeam } from 'src/app/core/models/human-capital/assessment/team';
import {GoodTeam } from 'src/app/core/models/human-capital/assessment/team';
import {AverageTeam } from 'src/app/core/models/human-capital/assessment/team';
import {BelowAverageTeam } from 'src/app/core/models/human-capital/assessment/team';
import { TeamSummary } from 'src/app/core/models/human-capital/assessment/team';

import { map } from 'rxjs/operators';
import { TeamStore } from 'src/app/stores/human-capital/assessment/team.store';
import { Observable } from 'rxjs';
import { UtilityService } from 'src/app/shared/services/utility.service';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  constructor(
    private _http: HttpClient,
    private _utilityService: UtilityService,
  ) { }

  getTeamSummary(): Observable<TeamSummary> {
    
    return this._http.get<TeamSummary>('/assessments/team-summary').pipe(
      map((res: TeamSummary) => {

        TeamStore.setTeamSummary(res);
        return res;
      })
    );
  }

  getExcellentTeams(): Observable<ExcellentTeam[]> {
    return this._http.get<ExcellentTeam[]>('/assessments/teams?performance=excellent').pipe(
      map((res: ExcellentTeam[]) => {

        TeamStore.setExcellentTeams(res);
        return res;
      })
    );
  }

  getGoodTeams(): Observable<GoodTeam[]> {
    

    return this._http.get<GoodTeam[]>('/assessments/teams?performance=good').pipe(
      map((res: GoodTeam[]) => {

        TeamStore.setGoodTeams(res);
        return res;
      })
    );
  }

  getAverageTeams(): Observable<AverageTeam[]> {
    
    return this._http.get<AverageTeam[]>('/assessments/teams?performance=average').pipe(
      map((res: AverageTeam[]) => {

        TeamStore.setAverageTeams(res);
        return res;
      })
    );
  }

  getBelowAverageTeams(): Observable<BelowAverageTeam[]> {

    return this._http.get<BelowAverageTeam[]>('/assessments/teams?performance=below_average').pipe(
      map((res: BelowAverageTeam[]) => {

        TeamStore.setBelowAverageTeams(res);
        return res;
      })
    );
  }
}
