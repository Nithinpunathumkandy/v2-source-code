import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { DesignationGrade,DesignationGradePaginationResponse } from 'src/app/core/models/masters/human-capital/designation-grade';

class Store {
    @observable
    private _designationGrades: DesignationGrade[] = [];

    @observable
    loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'designation_grades.created_at';

    searchText: string;

    @action
    setDesignationGrades(response: DesignationGradePaginationResponse) {
        
        this._designationGrades = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    updateDesignationGrade(grade: DesignationGrade) {
        const grades: DesignationGrade[] = this._designationGrades.slice();
        const index: number = grades.findIndex(e => e.id == grade.id);
        if (index != -1) {
            grades[index] = grade;
            this._designationGrades = grades;
        }
    }

    @computed
    get designationGrades(): DesignationGrade[] {
        
        return this._designationGrades.slice();
    }

    @action
    getGradeById(id: number): DesignationGrade {
        return this._designationGrades.slice().find(e => e.id == id);
    }

}

export const DesignationGradeMasterStore = new Store();