import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExcellentTeam, TeamSummary } from 'src/app/core/models/human-capital/assessment/team';
import { GoodTeam} from 'src/app/core/models/human-capital/assessment/team';
import { AverageTeam} from 'src/app/core/models/human-capital/assessment/team';
import { BelowAverageTeam} from 'src/app/core/models/human-capital/assessment/team';



class Store {

    @observable
    private _team_summary: TeamSummary;
    
    @observable
    private _excellent_team: ExcellentTeam[]=[];

    @observable
    private _good_team: GoodTeam[]=[];

    @observable
    private _average_team: AverageTeam[]=[];

    @observable
    private _below_average_team: BelowAverageTeam[]=[];

    @observable
    excellent_loaded:boolean = false;

    @observable
    good_loaded:boolean = false;

    @observable
    average_loaded:boolean = false;

    @observable
    below_loaded:boolean = false;

    @observable
    excellent_status: string='Active';

    @observable
    good_status: string='Inactive';

    @observable
    average_status: string='Inactive';

    @observable
    below_status: string='Inactive';

    @observable
    total_count:number = null;

    @observable
    excellent_count:number = null;

    @observable
    good_count:number = null;

    @observable
    average_count:number = null;

    @observable
    below_average_count:number = null;

    @observable
    summary_loaded:boolean = false;

    @action
    setTeamSummary(response: TeamSummary) {
        
        this._team_summary = response;
        this.total_count = response.total_count;
        this.excellent_count = response.excellent_count;
        this.good_count = response.good_count;
        this.average_count = response.average_count;
        this.below_average_count = response.below_average_count;
        this.summary_loaded = true;
    }
    
    @action
    setExcellentTeams(response: ExcellentTeam[]) {
        
        this._excellent_team = response;
        
        this.excellent_loaded = true;
    }

    @action
    setGoodTeams(response: GoodTeam[]) {
        
        this._good_team = response;
        this.good_loaded = true;
    }

   


    @action
    setAverageTeams(response: AverageTeam[]) {
        
        this._average_team = response;
        this.average_loaded = true;
    }


    @action
    setBelowAverageTeams(response: BelowAverageTeam[]) {
        
        this._below_average_team = response;
        this.below_loaded = true;
    }


    @computed
    get teamSummary(): TeamSummary {
        
        return this._team_summary;
    }

    @computed
    get excellentTeam(): ExcellentTeam[] {
        
        return this._excellent_team;
    }

    @computed
    get goodTeam(): GoodTeam[] {
        
        return this._good_team;
    }

    @computed
    get averageTeam(): AverageTeam[] {
        
        return this._average_team;
    }

    @computed
    get belowAverageTeam(): BelowAverageTeam[] {
        
        return this._below_average_team;
    }
  
}

export const TeamStore = new Store();