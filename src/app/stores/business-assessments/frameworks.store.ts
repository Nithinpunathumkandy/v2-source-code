import { observable, action, computed } from "mobx-angular";
import { Frameworks, FrameworkPaginationResponse, IndividualFramework } from 'src/app/core/models/business-assessments/frameworks';
class Store {
    @observable
    private _frameworkList: Frameworks[] = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'business_assessment_frameworks.reference_code';

    @observable
    private _individualFrameworkDetails: IndividualFramework;

    @observable
    individual_framework_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selected: number = null;

    @observable
    searchText: string;

    @observable
    frameworkId:number = null;

    @observable
    view_more: boolean = false;

    @observable
    lastInsertedId:number = null;

    @action
    setFrameworkDetails(response: FrameworkPaginationResponse) {
        this._frameworkList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        //this.updateUserJob(response.data);
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateFramework(framework: Frameworks) {
        const frameworks: Frameworks[] = this._frameworkList.slice();
        const index: number = frameworks.findIndex(e => e.id == framework.id);
    }


    @computed
    get frameworkDetails(): Frameworks[] {

        return this._frameworkList?.slice();
    }

    getFrameworkById(id: number): IndividualFramework {
        let frameworkList;

        frameworkList = this._frameworkList.slice().find(e => e.id == id);
        this.setIndividualFrameworkDetails(frameworkList);
        return frameworkList;
    }

    @action
    setIndividualFrameworkDetails(details:IndividualFramework) {
        this.individual_framework_loaded = true;
        this._individualFrameworkDetails = details;
        // this.updateFramework(details);
    }

    unsetFrameworkDetails() {
        this._frameworkList = null;
        this.loaded = false;
    }

    unsetIndiviudalFrameworkDetails() {
        this._individualFrameworkDetails = null;
        this.individual_framework_loaded = false;
    }

    setFrameworkId(id){
        this.frameworkId = id;
    }

    unsetFrameworkId(){
        this.frameworkId = null;
    }

   
    @computed
    get individualFrameworkDetails(): IndividualFramework {
        return this._individualFrameworkDetails;
    }




}

export const FrameworksStore = new Store();