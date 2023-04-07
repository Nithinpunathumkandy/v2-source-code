import { action, computed, observable } from 'mobx';
import { IndividualJsoObservation, jsoObservations, jsoObservationsPaginationResponse, UnsafeAction } from 'src/app/core/models/jso/jso-observations/jso-observations.model';
import { IndividualJsoUnsafeAction, jsoUnsafeActions, jsoUnsafeActionsPaginationResponse } from 'src/app/core/models/jso/jso-unsafe-actions/jso-unsafe-actions.model';

class Store{
    @observable
    private _jsoUnsafeActions:jsoUnsafeActions[] = [];

    @observable
    private _jsoUnsafeActionsDetails:IndividualJsoUnsafeAction;

    @observable
    private _closeUnsafeActions;

    @observable
    private _resolveUnsafeActions;

    @observable
    public _unsafeActionDetails = [];

    @observable
    loaded: boolean = false;

    @observable
    jsoUnsafeActionsDetails_loaded: boolean = false;

    @observable
    closeUnsafeActions_loaded: boolean = false;

    @observable
    resolveUnsafeActions_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'unsafe_action_categories.title';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    searchText: string;

    @observable
    unsafeAction_id: number = null;

    @observable
    category_form_modal: boolean = false;

    @observable
    sub_category_form_modal: boolean = false;

    @observable
    observed_group_form_modal: boolean = false;

    @computed
    get jsoUnsafeActionsList(): jsoUnsafeActions[] {
    return this._jsoUnsafeActions;
    }

    @computed
    get jsoUnsafeActionsDetails(): IndividualJsoUnsafeAction {
    return this._jsoUnsafeActionsDetails;
    }

    @computed
    get closeUnsafeActions() {
    return this._closeUnsafeActions;
    }

    @computed
    get resolveUnsafeActions() {
    return this._resolveUnsafeActions;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setJsoUnsafeActions(response: jsoUnsafeActionsPaginationResponse){
        this._jsoUnsafeActions = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetJsoUnsafeActions(){
        this._jsoUnsafeActions = [];
        this.loaded = false;
    }

    @action
    setIndividualJsoUnsafeAction(details) {
        this.jsoUnsafeActionsDetails_loaded = true;
        this._jsoUnsafeActionsDetails=details;
    }

    unsetIndividualJsoUnsafeAction(){
        this.jsoUnsafeActionsDetails_loaded = false;
        this._jsoUnsafeActionsDetails = null;
    }

    @action
    setCloseUnsafeAction(details) {
        this.closeUnsafeActions_loaded = true;
        this._closeUnsafeActions=details.data;
    }

    @action
    setResolveUnsafeAction(details) {
        this.resolveUnsafeActions_loaded = true;
        this._resolveUnsafeActions=details.data;
    }

    // setControlAccordion(index) {
    //     if (this._jsoUnsafeActionsDetails?.unsafe_actions[index]?.is_accordion_active == true)
    //         this._jsoUnsafeActionsDetails.unsafe_actions[index].is_accordion_active = false;
    //     else
    //         this._jsoUnsafeActionsDetails.unsafe_actions[index].is_accordion_active = true;
    //     this.unsetControlAccordion(index);

    // }

    // unsetControlAccordion(index) {
    //     for (let i = 0; i < this._jsoUnsafeActionsDetails?.unsafe_actions?.length; i++) {
    //         if (i != index) {
    //             this._jsoUnsafeActionsDetails.unsafe_actions[i].is_accordion_active = false;
    //         }
    //     }
    // }

    // @action
    // getJsoObservationsDetails(): IndividualJsoObservation {
    //     if (this._jsoUnsafeActionsDetails.unsafe_actions.length > 0) {
    //         this._jsoUnsafeActionsDetails.unsafe_actions[0].is_accordion_active = true;
    //         for (let i = 1; i < this._jsoUnsafeActionsDetails?.unsafe_actions?.length; i++) {
    //             this._jsoUnsafeActionsDetails.unsafe_actions[i].is_accordion_active = false;

    //         }
    //         return this._jsoUnsafeActionsDetails;
    //     }
    // }

    // unsafeAction Accordian
    // setUnsafeActionAccordion(index) {
    //     if (this._unsafeActionDetails[index]?.is_accordion_active == true)
    //         this._unsafeActionDetails[index].is_accordion_active = false;
    //     else
    //         this._unsafeActionDetails[index].is_accordion_active = true;
    //     this.unsetUnsafeActionAccordion(index);

    // }

    // unsetUnsafeActionAccordion(index) {
    //     for (let i = 0; i < this._unsafeActionDetails?.length; i++) {
    //         if (i != index) {
    //             this._unsafeActionDetails[i].is_accordion_active = false;
    //         }
    //     }
    // }

    // @action
    // getUnsafeActionDetails() {
    //     if (this._unsafeActionDetails?.length > 0) {
    //         this._unsafeActionDetails[0].is_accordion_active = true;
    //         for (let i = 1; i < this._unsafeActionDetails?.length; i++) {
    //             this._unsafeActionDetails[i].is_accordion_active = false;

    //         }
    //         return this._unsafeActionDetails;
    //     }
    // }
}

export const JsoUnsafeActionStore = new Store();