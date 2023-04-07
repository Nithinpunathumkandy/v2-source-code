import { observable, action, computed } from "mobx-angular";
import { NeedsExpectaion,NeedExpectationDetails,NeedsExpectaionPaginationResponse ,NeedExpectationResponse} from 'src/app/core/models/bpm/process/need-expectation'

class Store {

    @observable //Store Subsidiary List
    private _needExptList: NeedsExpectaion[] = [];
    @observable //Sets whether subsidiary list is stored or not
    loaded: boolean = false;

    
    @observable //Store Subsidiary List
    private _needExpResponse: NeedExpectationResponse[]=[];


    @observable
    private _needExpDetails: NeedExpectationDetails[] = [];
    
    @observable // Boolean flag to decide form opened for add / edit
    Editflag = false;

    @observable
    needexp_details_loaded = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    selectedStakeHolderType = null;

    
    @observable
    needs_expectation_form_modal: boolean = false;

    @observable
    stakeholder_form_modal: boolean = false;

    @observable
    selectedNeedsExpectations: any[] = [];

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @action
    setNeedExpectation(response:NeedExpectationResponse[]) {
        this.loaded = true;
        this._needExpResponse = response
    }

    get needExptList(): NeedExpectationResponse[] {
        return this._needExpResponse;
    }

       // Set NeedExp Details
    @action
    setNeedExpDetails(details: NeedExpectationDetails[]) {
        this.needexp_details_loaded = true
        this._needExpDetails = details['data']
    }

    get needExptDetails(): NeedExpectationDetails[] {
        return this._needExpDetails;
    }
   
    unsetNeedExpDetails(){
        this.needexp_details_loaded = false;
        this._needExpDetails = [];
    }
    unsetNeedsExpectations() {
        this.loaded = false;
        this._needExpResponse = [];
    }
    
       // Setting Accordion Status For Activity
       setNeedExpAccordion(index){
        if(this._needExpResponse[index].is_accordion_active == true)
            this._needExpResponse[index].is_accordion_active = false;
        else
            this._needExpResponse[index].is_accordion_active = true;
        this.unsetNeedSetAccordion(index);
      
    }
    unsetNeedSetAccordion(index){
        for(let i=0;i<this._needExpResponse.length;i++){
            if(i != index){
                this._needExpResponse[i].is_accordion_active = false;
            }
        }
    }

    @action
    setStakeHolderType(stype){
        this.selectedStakeHolderType = stype;
    }

    getSelectedStakeholderType(){
        return this.selectedStakeHolderType;
    }

    
    @action
    newNeedsExpectations(need,stakeholder,edit:boolean = false){
        var returnValue: boolean = true;
        if(this.selectedNeedsExpectations.length == 0){
            let obj = { stakeholder: stakeholder.id, 
                stakeholder_title: stakeholder.title, 
                values : [need.id], 
                needs_title: [need.title],
                type : !(edit)?this.selectedStakeHolderType.title:stakeholder.stakeholder_type.title,
                active: true
            };
            this.selectedNeedsExpectations.push(obj);
        }
        else{
            var foundFlag = false;
            var foundPosition = null;
            this.selectedNeedsExpectations.forEach(element => {
                if(element.stakeholder == stakeholder.id){
                    foundPosition = this.selectedNeedsExpectations.findIndex(e => e.stakeholder == stakeholder.id);
                    var needFound = false;
                    for(let i of element.values){
                        if(i == need.id){
                            needFound = true;
                            break;
                        }
                    }
                    foundFlag = true;
                    if(!needFound){
                        element.values.push(need.id);
                        element.needs_title.push(need.title)
                        element.active = true;
                    }
                    else{
                        returnValue = false;
                    }
                    this.setNeedsAndExpectationsAccordion(foundPosition);
                }
            });
            if(!foundFlag){
                // let obj = { stakeholder: stakeholder, values : [need], type : this.selectedStakeHolderType.title };
                this.setNeedsAndExpectationsAccordion();
                let obj = { stakeholder: stakeholder.id, 
                    stakeholder_title: stakeholder.title, 
                    values : [need.id], 
                    needs_title: [need.title],
                    type : !(edit)?this.selectedStakeHolderType.title:stakeholder.stakeholder_type.title,
                    active: true
                };
                this.selectedNeedsExpectations.push(obj);
            }
        }
        return returnValue;
    }
    // newNeedsExpectations(need, stakeholder, edit: boolean = false) {
    //     var returnValue: boolean = true;
    //     if(this.selectedNeedsExpectations.length == 0){
    //         let obj = { stakeholder: stakeholder.id, 
    //             stakeholder_title: stakeholder.title, 
    //             values : [need.id], 
    //             needs_title: [need.title],
    //             type : !(edit)?this.selectedStakeHolderType.title:stakeholder.stakeholder_type.title,
    //             active: true
    //         };
    //         this.selectedNeedsExpectations.push(obj);
    //     }
    //     else{
    //         var foundFlag = false;
    //         this.selectedNeedsExpectations.forEach(element => {
    //             if(element.stakeholder == stakeholder.id){
    //                 var needFound = false;
    //                 for(let i of element.values){
    //                     if (i == need.id) {              
    //                         needFound = true;
    //                         break;
    //                     }
    //                 }
    //                 foundFlag = true;
    //                 if(!needFound){
    //                     element.values.push(need.id);
    //                     element.needs_title.push(need.title)
    //                 }
    //                 else{
    //                     returnValue = false;
    //                 }
    //             }
    //         });
    //         if (!foundFlag) {
    //             this.selectedNeedsExpectations.pop()

    //             let obj = { stakeholder: stakeholder.id, 
    //                 stakeholder_title: stakeholder.title, 
    //                 values : [need.id], 
    //                 needs_title: [need.title],
    //                 type : !(edit)?this.selectedStakeHolderType.title:stakeholder.stakeholder_type.title,
    //                 active: true
    //             };
                
    //             this.selectedNeedsExpectations.push(obj)
    //         }
    //     }
    //     return returnValue;
    // }

    setNeedsAndExpectationsAccordion(position?:number){
        if(position != null){
            for(var i = 0; i < this.selectedNeedsExpectations.length; i++){
                if(i != position)
                    this.selectedNeedsExpectations[i].active = false;
                else
                    this.selectedNeedsExpectations[i].active = true;
            }
        }
        else{
            for(var i = 0; i < this.selectedNeedsExpectations.length; i++){
                this.selectedNeedsExpectations[i].active = false;
            }
        }
    }
    @action
    showhideNeedsExpectations(pos){
        if(pos < this.selectedNeedsExpectations.length){
            if(this.selectedNeedsExpectations[pos].hasOwnProperty('active')){
                if(this.selectedNeedsExpectations[pos].active == true){
                    this.selectedNeedsExpectations[pos]['active'] = false;
                }
                else{
                    this.selectedNeedsExpectations[pos]['active'] = true;    
                }
            }
            else{
                this.selectedNeedsExpectations[pos]['active'] = true;
            }
        }
        for(let i = 0; i < this.selectedNeedsExpectations.length; i++){
            if(i != pos)
                this.selectedNeedsExpectations[i]['active'] = false;
        }
    }

}

export const NeedExpectationStore = new Store();