import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExcellentSubsidiary, SubsidiarySummary } from 'src/app/core/models/human-capital/assessment/subsidiary';
import { GoodSubsidiary} from 'src/app/core/models/human-capital/assessment/subsidiary';
import { AverageSubsidiary} from 'src/app/core/models/human-capital/assessment/subsidiary';
import { BelowAverageSubsidiary} from 'src/app/core/models/human-capital/assessment/subsidiary';



class Store {

    @observable
    private _subsidiary_summary: SubsidiarySummary;
    
    @observable
    private _excellent_subsidiary: ExcellentSubsidiary[]=[];

    @observable
    private _good_subsidiary: GoodSubsidiary[]=[];

    @observable
    private _average_subsidiary: AverageSubsidiary[]=[];

    @observable
    private _below_average_subsidiary: BelowAverageSubsidiary[]=[];

   
    @observable
    excellent_loaded:boolean = false;

    @observable
    good_loaded:boolean = false;

    @observable
    average_loaded:boolean = false;

    @observable
    below_loaded:boolean = false;

    @observable
    excellent_status: string='Inactive';

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
    setSubsidiarySummary(response: SubsidiarySummary) {
        
        this._subsidiary_summary = response;
        this.total_count = response.total_count;
        this.excellent_count = response.excellent_count;
        this.good_count = response.good_count;
        this.average_count = response.average_count;
        this.below_average_count = response.below_average_count;
        this.summary_loaded = true;
        SubsidiaryStore.excellent_status = 'Active';
    }
    
    @action
    setExcellentSubsidiaries(response: ExcellentSubsidiary[]) {
        
        this._excellent_subsidiary = response;
        
        this.excellent_loaded = true;
        
    }

    @action
    setGoodSubsidiaries(response: GoodSubsidiary[]) {
        
        this._good_subsidiary = response;
        
        this.good_loaded = true;
    }


    @action
    setAverageSubsidiaries(response: AverageSubsidiary[]) {
        
        this._average_subsidiary = response;
      
        this.average_loaded = true;
    }


    @action
    setBelowAverageSubsidiaries(response: BelowAverageSubsidiary[]) {
        
        this._below_average_subsidiary = response;
        
        this.below_loaded = true;
    }


    @computed
    get subsidiarySummary(): SubsidiarySummary {
        
        return this._subsidiary_summary;
    }

    @computed
    get excellentSubsidiary(): ExcellentSubsidiary[] {
        
        return this._excellent_subsidiary;
    }

    @computed
    get goodSubsidiary(): GoodSubsidiary[] {
        
        return this._good_subsidiary;
    }

    @computed
    get averageSubsidiary(): AverageSubsidiary[] {
        
        return this._average_subsidiary;
    }

    @computed
    get belowAverageSubsidiary(): BelowAverageSubsidiary[] {
        
        return this._below_average_subsidiary;
    }
  
}

export const SubsidiaryStore = new Store();