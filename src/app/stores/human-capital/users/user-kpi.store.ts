import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { UserKpi, UserKpiPaginationResponse,Process } from 'src/app/core/models/human-capital/users/user-kpi';
import { Image } from "src/app/core/models/image.model";
import { User } from 'src/app/core/models/user.model';
class Store {
    @observable
    private _userKpiList: UserKpi[] = [];


    @observable
    loaded: boolean = false;

    @observable
    private _processes: Process[] = [];


    @observable
    process_loaded: boolean = false;


    @observable
    kpi_preview_available = false;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    selected_preview_url: string;

    @observable
    private _kpiDocumentDetails: Image[] = [];

    @observable
    private _individualKpiDetails: UserKpi;

    @observable
    individual_kpi_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    evaluationStarted:boolean=false;

    @observable
    currentDate=new Date();
    
    @observable
    selected: number = null;

    @action
    setUserKpiDetails(response: UserKpiPaginationResponse) {
        this._userKpiList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    unsetUserKpiDetails() {
        this._userKpiList = [];
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateUserKpi(kpi: UserKpi) {
        const kpis: UserKpi[] = this._userKpiList.slice();
        const index: number = kpis.findIndex(e => e.id == kpi.id);
        if (index != -1) {
            //kpis[index] = kpi;
            //this._userKpiList = kpis;
            this.unsetKpiListAccordion(index);
        }
    }



    @computed
    get userKpiDetails(): UserKpi[] {

        return this._userKpiList.slice();
    }

    @computed
    get initialKpiId():number{
        return this._userKpiList[0].id
    }


    setKpiListAccordion(index) {
        if (this._userKpiList.length > 0) {
            if (this._userKpiList[index].is_accordion_active == true)
                this._userKpiList[index].is_accordion_active = false;
            else
                this._userKpiList[index].is_accordion_active = true;
            this.unsetKpiListAccordion(index);
        }
      
    }

    unsetKpiListAccordion(index) {
        if (this._userKpiList.length > 0) {
            for (let i = 0; i < this._userKpiList.length; i++) {
                if (i != index) {
                    this._userKpiList[i].is_accordion_active = false;
                }
            }
        }
    }

    getUserKpiById(id: number): UserKpi {
        let userKpiList;

        userKpiList = this._userKpiList.slice().find(e => e.id == id);
        UserKpiStore.setIndividualKpiDetails(userKpiList);
        return userKpiList;
    }

    @action
    setIndividualKpiDetails(details) {
        this.individual_kpi_loaded = true;
        this._individualKpiDetails = details;
        this.updateUserKpi(details);

    }

    unsetIndiviudalKpiDetails() {
        this._individualKpiDetails = null;
        this.individual_kpi_loaded = false;
    }

    @action
    clearDocumentDetails() {
        this._kpiDocumentDetails = [];
        this.preview_url = null;
    }

    @action
    setProcesses(details) {
        this.process_loaded = true;
        this._processes = details;

    }

    get userKpiById() {

        return this._individualKpiDetails;
    }



    @computed
    get individualKpiDetails(): UserKpi {
        return this._individualKpiDetails;
    }


    @computed
    get kpiDetails(): Image[] {
        return this._kpiDocumentDetails.slice();
    }

    @action
    setDocumentDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;
            this.preview_url = url;
        }
        else {
            this._kpiDocumentDetails.push(details);
            this.preview_url = url;
        }
    }

    @action
    clearKpiDetails() {
        this._kpiDocumentDetails = [];
        this.preview_url = null;
    }


    getDocumentByType(): Image {

        return this._imageDetails;
        // else
        //     this.getBrochureDetails;
    }

    @action
    unsetDocumentDetails(type: string, token?: string) {
        if (type == 'logo') {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
            }
        }
        else {
            var b_pos = this._kpiDocumentDetails.findIndex(e => e.token == token)
            if (b_pos != -1) {
                if (this._kpiDocumentDetails[b_pos].hasOwnProperty('is_new')) {
                    this._kpiDocumentDetails.splice(b_pos, 1);
                }
                else {
                    this._kpiDocumentDetails[b_pos]['is_deleted'] = true;
                }
            }

        }


    }

    @action
    setSelected(value:number){
        this.selected = value;
    }

    get selectedItem():number{
        return this.selected;
    }



    get KpiImageDetails(): Image {
        return this._imageDetails;
    }


    get processes(): Process[] {
        return this._processes;
    }

    @action
    setSelectedDocumentDetails(imageDetails) {

        this.selected_preview_url = imageDetails;
    }

    @action
    setEvaluationStarted() {
  
      this.evaluationStarted = true;
    }
  
    @action
    unsetEvaluationStarted() {
      this.evaluationStarted = false;
    }



}

export const UserKpiStore = new Store();