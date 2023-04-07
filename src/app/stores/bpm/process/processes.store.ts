import { observable, action, computed } from "mobx-angular";
import { Image } from "src/app/core/models/image.model";
import { Processes, ProcessDetails, ProcessesPaginationResponse, ProcessStatuses, ProcessStatusesPaginationResponse } from '../../../core/models/bpm/process/processes'

class Store {


    @observable
    private _processes: Processes[] = [];

    @observable
    private _processStatus: ProcessStatuses[] = [];

    @observable
    private _processDetails: ProcessDetails

    @observable
    _processFlow: Image[] = [];

    @observable
    _attachement: Image[] = [];


    @observable
    process_id: number = null;

    @observable
    editFlag: boolean = false;

    @observable
    processes_loaded: boolean = false;

    @observable
    process_details_loaded: boolean = false;

    @observable
    add_control_form_modal: boolean = false;

    @observable //form_open and close
    processes_form_modal: boolean = false;

    @observable
    currentPage: number = 1;

    searchText: string;

    @observable
    itemsPerPage: number = null;

    @observable
    _subsidiary: string;

    @observable
    _branch: string;

    @observable
    _department: string;

    @observable
    _division: string;

    @observable
    _section: string;

    @observable
    _sub_section: string;

    @observable
    _designation: string;

    @observable
    _processGroup: string;

    @observable
    _processCategory: string;

    @observable
    preview_url: string;

    @observable
    _msType = [];

    @observable
    _accountableUser = [];

    @observable
    totalItems: number = null;

    //  @observable
    // orderBy: 'asc' | 'desc' = null;


    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'processes.created_at';

    @observable
    document_selection=""

    @observable
    selectedProcessesList: any[] = [];

    @observable
    processesToDisplay: any = [];

    @observable
    saveSelected: boolean=false;

    @action
    setProcesses(response: ProcessesPaginationResponse) {
        this.processes_loaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._processes = response.data;
    }

    @action
    setStatuses(response: ProcessStatusesPaginationResponse) {
        this.processes_loaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        // this.totalItems = response.total;
        this._processStatus = response.data;
    }

    @action
    setProcessDetails(details: ProcessDetails) {
        this.process_details_loaded = true
        this._processDetails = details
    }

    unsetProcessDetails() {
        this._processDetails = null;
        this.process_details_loaded = false;
    }

    // @action
    // setOrderBy(order_by: 'asc' | 'desc') {
    //     this.orderBy = order_by;
    // }

    @action //Clears ProcessFlow Document
    clearProcessFlowDocuments() {
        this._processFlow = [];
    }

    @action //Clears ProcessFlow Document
    clearProcessAtachements() {
        this._attachement = [];
    }



    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setProcessId(id: number) {
        this.process_id = id;

    }

    @action //Sets process-flow or attachement details according to type
    setProcessFlowDocuments(details: Image, url: string) {

        this._processFlow.unshift(details);
        this.preview_url = url;


    }

    @action //Sets process-flow or attachement details according to type
    setAttachements(details: Image, url: string) {

        this._attachement.unshift(details);
        this.preview_url = url;


    }

    setControlAccordion(index) {
        if (this._processDetails.process_controls[index].is_accordion_active == true)
            this._processDetails.process_controls[index].is_accordion_active = false;
        else
            this.processDetails.process_controls[index].is_accordion_active = true;
        this.unsetControlAccordion(index);

    }

    unsetControlAccordion(index) {
        for (let i = 0; i < this._processDetails.process_controls.length; i++) {
            if (i != index) {
                this._processDetails.process_controls[i].is_accordion_active = false;
            }
        }
    }

    @action // When delete is clicked for logo or Actvity
    unsetProcessFlowDocumentss(token?: string) {


        var b_pos = this._processFlow.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._processFlow[b_pos].hasOwnProperty('is_new')) {
                this._processFlow.splice(b_pos, 1);
            }
            else {
                this._processFlow[b_pos]['is_deleted'] = true;
            }
        }


    }

    @action // When delete is clicked for logo or Actvity
    unsetAttachements(token?: string) {


        var b_pos = this._attachement.findIndex(e => e.token == token)
        if (b_pos != -1) {
            if (this._attachement[b_pos].hasOwnProperty('is_new')) {
                this._attachement.splice(b_pos, 1);
            }
            else {
                this._attachement[b_pos]['is_deleted'] = true;
            }
        }


    }

    @action
    unsetFileDetails(type, token?: string) {
        if (type == 'process-flow') {
            var b_pos = this._processFlow.findIndex(e => e.token == token)
            if (b_pos != -1) {
                if (this._processFlow[b_pos].hasOwnProperty('is_new')) {
                    this._processFlow.splice(b_pos, 1);
                }
                else {
                    this._processFlow[b_pos]['is_deleted'] = true;
                }
            }
        } else {

            var b_pos = this._attachement.findIndex(e => e.token == token)
            if (b_pos != -1) {
                if (this._attachement[b_pos].hasOwnProperty('is_new')) {
                    this._attachement.splice(b_pos, 1);
                }
                else {
                    this._attachement[b_pos]['is_deleted'] = true;
                }
            }
        }

    }

    @action
    unsetEditFlag() {
        this.editFlag = false;
    }


    @computed
    get getProcessFlow(): Image[] {
        return this._processFlow;
    }
    @computed
    get getAttachement(): Image[] {
        return this._attachement;
    }

    @computed
    get processList(): Processes[] {
        return this._processes.slice();
    }

    @computed
    get processStatus(): ProcessStatuses[] {
        return this._processStatus.slice();
    }

    @computed
    get processDetails(): ProcessDetails {
        return this._processDetails
    }

    @action
    addSelectedProcesses(processes, processesToDisplay) {
        this.selectedProcessesList = processes;
        this.processesToDisplay = processesToDisplay;
    }

    unsetSelectedProcesses() {
        this.selectedProcessesList = [];
        this.processesToDisplay = [];
    }


}

export const ProcessStore = new Store();