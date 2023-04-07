import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { Policies, PolicyDetails } from 'src/app/core/models/organization/business_profile/policies/policies';
import { Image } from "src/app/core/models/image.model";

class Store {
    @observable
    private _policiesList: Policies[] = [];

    @observable
    loaded: boolean = false;

    @observable
    individualLoaded: boolean = false;

    $observable
    selected: number = null;

    @observable
    selectedPolicyDetails: PolicyDetails;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable
    private _brocureDetails: Image[] = [];

    @action
    setPolicyList(policy: Policies[]) {
        this.loaded = true;
        this._policiesList = policy;
    }

    @action
    unsetPolicyList() {
        this.loaded = false;
        this._policiesList = null;
    }

    @computed
    get policyDetails(): Policies[] {
        if(this._policiesList) return this._policiesList.slice();
        else return [];
    }

    @action
    setSelected(value:number){
        this.selected = value;
    }

    getPolicyById(id: number): Policies {
        return this._policiesList.slice().find(e => e.id == id);
    }

    @computed
    get initialPolicyId():number{
        if(this._policiesList.length > 0)
            return this._policiesList[0].id;
        else
            return null;
    }

    get selectedItem():number{
        return this.selected;
    }

    @action
    setSelectedPolicyDetails(policyDetails: PolicyDetails){
        this.selectedPolicyDetails = policyDetails;
        this.individualLoaded = true;
    }

    setBrochureDetails(details){
        if(this.selectedPolicyDetails)
            this.selectedPolicyDetails.documents = details;
    }

    get getSelectedPolicyDetails(): PolicyDetails{
        return this.selectedPolicyDetails;
    }

    @action
    unsetSelectedPolicyDetails(){
        this.selectedPolicyDetails = null;
        this.individualLoaded = false;
    }

    @action //Sets Logo or Brochure details according to type
    setFileDetails(details:Image, url: string, type: string){
        this._brocureDetails.unshift(details);
    }

    @action // When delete is clicked for logo or brochure
    unsetFileDetails(type: string,token?:string){
        var b_pos = this._brocureDetails.findIndex(e => e.token == token)
        if(b_pos != -1){
            if(this._brocureDetails[b_pos].hasOwnProperty('is_new')){
                this._brocureDetails.splice(b_pos,1);
            }
            else{
                this._brocureDetails[b_pos]['is_deleted'] = true;
            }
        }
    }

    // Returns Brochures Array
    get getBrochureDetails(): Image[]{
        return this._brocureDetails;
    }

    @action
    unsetBrochureDetails(){
        this._brocureDetails = [];
    }

    clearPolicyList(){
        this._policiesList = [];
        this.loaded = false;
    }

}

export const PolicyStore = new Store();