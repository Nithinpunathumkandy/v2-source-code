import { action, computed, observable } from "mobx";
import { FindingDepartmentPagination, FindingDepartmentPage, } from "src/app/core/models/internal-audit/dashboard/dashboard";

class Store {

    @observable
    totalItemsDepartmentFindingsPage: number = null;

    @observable
    DepartmentFindingsPagefrom: number = null;

    @observable
    DepartmentFindingsPageLoaded: boolean = false;

    @observable
    currentPageDepartmentFindingsPage: number = 1;

    @observable
    itemsPerPageDepartmentFindingsPage: number = null;

    @observable
    private _DepartmentFindingsPage: FindingDepartmentPagination[] = [];

    @action // Sets current page for pagination
    setDepartmentFindingsPagination(current_page: number) {
        this.currentPageDepartmentFindingsPage = current_page;
    }

    @action
    setDepartmentFindingsPage(res: FindingDepartmentPage) {
        this._DepartmentFindingsPage = res.data; 
        this.currentPageDepartmentFindingsPage = res.current_page;
        this.itemsPerPageDepartmentFindingsPage = res.per_page;
        this.totalItemsDepartmentFindingsPage = res.total;
        this.DepartmentFindingsPageLoaded = true;
        this.DepartmentFindingsPagefrom = res.from;
    }

    @action
    unsetDepartmentFindingsPage() {
        this._DepartmentFindingsPage = [];
        this.currentPageDepartmentFindingsPage = 1;
        this.DepartmentFindingsPageLoaded = false;
    }

    @computed
    get DepartmentFindingsPage():FindingDepartmentPagination[]{
        return this._DepartmentFindingsPage?.slice();
    }
}

export const IADepartmentRiskStore = new Store();