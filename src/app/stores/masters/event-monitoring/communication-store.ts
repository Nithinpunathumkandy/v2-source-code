import { observable, action, computed } from "mobx-angular";
import {Communication,CommunicationPaginationResponse,CommunicationSingle} from '../../../core/models/masters/event-monitoring/communication';

class Store{
    @observable 
    private _communication:Communication[]=[];

    @observable 
    loaded:boolean=false;
   
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    individualLoaded: boolean = false;

    @observable
    individualCommunication: CommunicationSingle;

    @observable
    orderItem: string = 'event_communication_channels.created_at';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    lastInsertedCommunication: number = null;

    searchText: string;


    @observable
    add_conrol_type_modal: boolean = false

    @action
    setCommunication(response:CommunicationPaginationResponse){
        this._communication=response.data;
        this.currentPage=response.current_page;
        this.itemsPerPage=response.per_page;
        this.totalItems=response.total;
        this.from = response.from;
        this.loaded=true;
    }

    @action
    setCurrentPage(current_page:number){
        this.currentPage=current_page;
    }

   
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    updateCommunication(Communication: Communication) {
        const communication: Communication[] = this._communication.slice();
        const index: number = communication.findIndex(e => e.id == Communication.id);
        if (index != -1) {
            Communication[index] = Communication;
            this._communication = communication;
        }
    }
    @action
    setIndividualCommunication(communication: CommunicationSingle) {
       
        this.individualCommunication = communication;
        this.individualLoaded = true;
        
    }

    @computed
    get communication(): Communication[] {
        
        return this._communication.slice();
    }

    @action
    getCommunicationById(id: number): Communication {
        return this._communication.slice().find(e => e.id == id);
    }

    @action
    setLastInsertedcommunication(communicationId: number){
        this.lastInsertedCommunication = communicationId;
    }

    get lastInsertedcommunication():number{
        if(this.lastInsertedCommunication) 
            return this.lastInsertedCommunication;
        else 
            return null;
    }
    get individualCommunicationId(){
        return this.individualCommunication;
    } 

}

export const CommunicationMasterStore = new Store();