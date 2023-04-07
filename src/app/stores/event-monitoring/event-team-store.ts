import { action, computed, observable } from "mobx-angular";

class Store {
    @observable
    private _eventAssistantManagers: any[] = [];

    @observable  
    assistantManagersLoaded:boolean=false;
    @observable  
    _eventSecondaryDepartentsDetails:any[]=[];

    @observable  
    secondaryOwnersLoaded:boolean=false;

    @observable  
    _eventSecondaryOwners:any[] = [];

    @observable
    private _eventMembers: any[] = [];

    @observable
    membersLoaded: boolean = false;

    @action
    setAssistantManagers(response: any){
        this._eventAssistantManagers = response;
        this.assistantManagersLoaded = true;
    }

    get assisstantManagers(): any{
        return this._eventAssistantManagers;
    }

    @action
    setMembers(response: any){
        this._eventMembers = response;
        this.membersLoaded = true;
    }

    get members(): any{
        return this._eventMembers;
    }

    @action
    setSecondaryOwners(response: any){
        this._eventSecondaryOwners = response?.secondary_owners;
        this._eventSecondaryDepartentsDetails=response?.secondary_departments
        this.secondaryOwnersLoaded = true;
    }


    @action
    unsetEventsTeamList(){
        this._eventAssistantManagers = [];
        this._eventMembers = [];
        this._eventSecondaryOwners =[];
        this._eventSecondaryDepartentsDetails=[];
        this.assistantManagersLoaded = false;
        this.membersLoaded = false;
        this.secondaryOwnersLoaded=false;
    }

}

export const EventTeamsStore = new Store();