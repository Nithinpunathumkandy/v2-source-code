import { observable, action, computed } from "mobx-angular";

import {Controls,ControlDetails,ControlPageinationResponse} from '../../../core/models/bpm/controls/controls'

class Store {

    @observable
    private _controls: Controls[] = [];

    @observable
    private _controlDetails:ControlDetails

    @observable
    control_loaded: boolean = false;
    
    @observable
    control_details_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selectedControlsList = [];

    @observable
    controlsToDisplay: any = [];

    @observable
    processControl: any = [];

    @observable
    controlId:number

    @observable
    saved:boolean=false;

    @observable
    orderItem: string = 'findings.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'desc';
    
    searchText: string;

    @observable
    lastInsertedId:number = null;

    @observable
    control_select_form_modal:boolean=false;

    @observable
    saveSelected:boolean=false;

    @action
    setControls(response:ControlPageinationResponse) {    
        
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._controls = response.data;
        this.control_loaded = true;
    }
    
    @action
    setControlDetails(details: ControlDetails) {
        this.control_details_loaded = true
        this._controlDetails=details
    }

    unsetControlDetails(){
        this.control_details_loaded = false;
        this._controlDetails = null;
    }

    

    @action
    getControlById(id: number): Controls{
        return this._controls.slice().find(e => e.id == id);
    }

    @action
    updateControls(control: Controls) {
        const controls: Controls[] = this._controls.slice();
        const index: number = controls.findIndex(e => e.id == control.id);
        if (index != -1) {
            controls[index] = control;
            this._controls = controls;
        }
    }

    @action
    addSelectedControls(controls, controlsToDisplay) {
        this.selectedControlsList = controls;
        this.controlsToDisplay = controlsToDisplay;
    }

    @action
    unSelectControls(){
        this.selectedControlsList = [];
        this.controlsToDisplay = [];
    }

    @action
    setLastInsertedId(id){
        this.lastInsertedId = id
    }

    @action
    unsetLastInsertedId(){
        this.lastInsertedId = null;
    }

    // @action
    // setOrderBy(order_by: 'asc' | 'desc') {
    //     this.orderBy = order_by;
    // }
   
    @computed
    get controlList(): Controls[] {
        return this._controls.slice();
    }

    @computed
    get controlDetails(): ControlDetails{
        return this._controlDetails
    }
    
    @computed

    get controlObjectives() {
        return this._controlDetails.control_objectives
    }


    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    // Set Control Accordion

    setControlAccordion(index){
        if(this.controlsToDisplay[index].is_accordion_active == true)
            this.controlsToDisplay[index].is_accordion_active = false;
        else
            this.controlsToDisplay[index].is_accordion_active = true;
        this.unsetControlAccordion(index);
      
    }

    unsetControlAccordion(index){
        for(let i=0;i<this.controlsToDisplay.length;i++){
            if(i != index){
                this.controlsToDisplay[i].is_accordion_active = false;
            }
        }
    }

}

export const  ControlStore = new Store();
