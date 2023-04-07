import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { ExcellentDepartment, DepartmentSummary } from 'src/app/core/models/human-capital/assessment/department';
import { GoodDepartment } from 'src/app/core/models/human-capital/assessment/department';
import { AverageDepartment } from 'src/app/core/models/human-capital/assessment/department';
import { BelowAverageDepartment } from 'src/app/core/models/human-capital/assessment/department';



class Store {

    @observable
    private _department_summary: DepartmentSummary;

    @observable
    private _excellent_department: ExcellentDepartment[] = [];

    @observable
    private _good_department: GoodDepartment[] = [];

    @observable
    private _average_department: AverageDepartment[] = [];

    @observable
    private _below_average_department: BelowAverageDepartment[] = [];

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
    total_count: number = null;

    @observable
    excellent_count: number = null;

    @observable
    good_count: number = null;

    @observable
    average_count: number = null;

    @observable
    below_average_count: number = null;

    @observable
    summary_loaded: boolean = false;

    @action
    setDepartmentSummary(response: DepartmentSummary) {

        this._department_summary = response;
        this.total_count = response.total_count;
        this.excellent_count = response.excellent_count;
        this.good_count = response.good_count;
        this.average_count = response.average_count;
        this.below_average_count = response.below_average_count;
        this.summary_loaded = true;
        DepartmentStore.excellent_status = 'Active';
    }

    @action
    setExcellentDepartments(response: ExcellentDepartment[]) {

        this._excellent_department = response;

        this.excellent_loaded = true;
    }

    @action
    setGoodDepartments(response: GoodDepartment[]) {

        this._good_department = response;
        this.good_loaded = true;
    }


    @action
    setAverageDepartments(response: AverageDepartment[]) {

        this._average_department = response;
        this.average_loaded = true;
    }


    @action
    setBelowAverageDepartments(response: BelowAverageDepartment[]) {

        this._below_average_department = response;
        this.below_loaded = true;
    }


    @computed
    get departmentSummary(): DepartmentSummary {

        return this._department_summary;
    }

    @computed
    get excellentDepartment(): ExcellentDepartment[] {

        return this._excellent_department;
    }

    @computed
    get goodDepartment(): GoodDepartment[] {

        return this._good_department;
    }

    @computed
    get averageDepartment(): AverageDepartment[] {

        return this._average_department;
    }

    @computed
    get belowAverageDepartment(): BelowAverageDepartment[] {

        return this._below_average_department;
    }

}

export const DepartmentStore = new Store();