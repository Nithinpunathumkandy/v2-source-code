import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExcellentByDepartment, ByDepartmentSummary,GoodByDepartment,AverageByDepartment,BelowAverageByDepartment } from 'src/app/core/models/business-assessments/assessments/by-department';



class Store {

    @observable
    private _by_department_summary: ByDepartmentSummary;

    @observable
    private _excellent_by_department: ExcellentByDepartment[] = [];

    @observable
    private _good_by_department: GoodByDepartment[] = [];

    @observable
    private _average_by_department: AverageByDepartment[] = [];

    @observable
    private _below_average_by_department: BelowAverageByDepartment[] = [];

    @observable
    excellent_loaded: boolean = false;

    @observable
    good_loaded: boolean = false;

    @observable
    average_loaded: boolean = false;

    @observable
    below_loaded: boolean = false;

    @observable
    excellent_status: string = 'Inactive';

    @observable
    good_status: string = 'Inactive';

    @observable
    average_status: string = 'Inactive';

    @observable
    below_status: string = 'Inactive';

    @observable
    summary_loaded: boolean = false;

    @action
    setByDepartmentSummary(response: ByDepartmentSummary) {

        this._by_department_summary = response;
        this.summary_loaded = true;
        ByDepartmentStore.excellent_status = 'Active';
    }

    @action
    unsetByDepartmentSummary() {
        this._by_department_summary = null;
        this.summary_loaded = false;
    }

    @action
    setExcellentByDepartments(response: ExcellentByDepartment[]) {

        this._excellent_by_department = response;

        this.excellent_loaded = true;
    }

    @action
    setGoodByDepartments(response: GoodByDepartment[]) {

        this._good_by_department = response;
        this.good_loaded = true;
    }


    @action
    setAverageByDepartments(response: AverageByDepartment[]) {

        this._average_by_department = response;
        this.average_loaded = true;
    }


    @action
    setBelowAverageByDepartments(response: BelowAverageByDepartment[]) {

        this._below_average_by_department = response;
        this.below_loaded = true;
    }


    @computed
    get byDepartmentSummary(): ByDepartmentSummary {

        return this._by_department_summary;
    }

    @computed
    get excellentByDepartment(): ExcellentByDepartment[] {

        return this._excellent_by_department;
    }

    @computed
    get goodByDepartment(): GoodByDepartment[] {

        return this._good_by_department;
    }

    @computed
    get averageByDepartment(): AverageByDepartment[] {

        return this._average_by_department;
    }

    @computed
    get belowAverageByDepartment(): BelowAverageByDepartment[] {

        return this._below_average_by_department;
    }

}

export const ByDepartmentStore = new Store();