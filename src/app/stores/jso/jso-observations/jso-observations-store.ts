import { action, computed, observable } from 'mobx';
import { IndividualJsoObservation, jsoObservations, jsoObservationsPaginationResponse, UnsafeAction } from 'src/app/core/models/jso/jso-observations/jso-observations.model';

class Store{
    @observable
    private _jsoObservations:jsoObservations[] = [];

    @observable
    private _jsoObservationsDetails:IndividualJsoObservation;

    @observable
    public _unsafeActionDetails = [];

    @observable
    private _unsafeActionCategory = [];

    @observable
    private _unsafeActionSubCategory = [];

    @observable
    private _unsafeActionObservedGroups = [];

    @observable
    loaded: boolean = false;

    @observable
    individual_jsoObservations_loaded: boolean = false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    orderItem: string = 'jso_observation_types.title';

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    searchText: string;

    @observable
    jso_id: number = null;

    @observable
    lastCreatedJsoId: number = null;

    @observable
    category_form_modal: boolean = false;

    @observable
    observation_type_form_modal: boolean = false;

    @observable
    sub_category_form_modal: boolean = false;

    @observable
    observed_group_form_modal: boolean = false;


    @computed
    get jsoObservationsList(): jsoObservations[] {
    //    return this._profileKPI.slice();
    return this._jsoObservations;
    }

    @computed
    get unsafeActionCategory() {
    return this._unsafeActionCategory;
    }

    @computed
    get unsafeActionSubCategory() {
    return this._unsafeActionSubCategory;
    }

    @computed
    get unsafeActionObservedGroups() {
    return this._unsafeActionObservedGroups;
    }

    @computed
    get jsoObservationsDetails(): IndividualJsoObservation {
    return this._jsoObservationsDetails;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setJsoObservations(response: jsoObservationsPaginationResponse){
        this._jsoObservations = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
        this.from = response.from;
    }

    @action
    unsetJsoObservations(){
        this._jsoObservations = [];
        this.loaded = false;
    }

    @action
    setIndividualJsoObservations(details) {
        this.individual_jsoObservations_loaded = true;
        this._jsoObservationsDetails=details;
    }

    unsetIndividualJsoObservations(){
        this.individual_jsoObservations_loaded = false;
        this._jsoObservationsDetails = null;
    }
    
    @action
    setCategoryList(response) {
        this.currentPage = response.data;
    }

    @action
    setSubCategory(response) {
        this.currentPage = response.data;
    }

    @action
    setObservedGroups(response) {
        this.currentPage = response.data;
    }

    setControlAccordion(index) {
        if (this._jsoObservationsDetails?.unsafe_actions[index]?.is_accordion_active == true)
            this._jsoObservationsDetails.unsafe_actions[index].is_accordion_active = false;
        else
            this._jsoObservationsDetails.unsafe_actions[index].is_accordion_active = true;
        this.unsetControlAccordion(index);

    }

    unsetControlAccordion(index) {
        for (let i = 0; i < this._jsoObservationsDetails?.unsafe_actions?.length; i++) {
            if (i != index) {
                this._jsoObservationsDetails.unsafe_actions[i].is_accordion_active = false;
            }
        }
    }

    @action
    getJsoObservationsDetails(): IndividualJsoObservation {
        if (this._jsoObservationsDetails.unsafe_actions.length > 0) {
            this._jsoObservationsDetails.unsafe_actions[0].is_accordion_active = true;
            for (let i = 1; i < this._jsoObservationsDetails?.unsafe_actions?.length; i++) {
                this._jsoObservationsDetails.unsafe_actions[i].is_accordion_active = false;

            }
            return this._jsoObservationsDetails;
        }
    }

    // unsafeAction Accordian
    setUnsafeActionAccordion(index) {
        if (this._unsafeActionDetails[index]?.is_accordion_active == true)
            this._unsafeActionDetails[index].is_accordion_active = false;
        else
            this._unsafeActionDetails[index].is_accordion_active = true;
        this.unsetUnsafeActionAccordion(index);

    }

    unsetUnsafeActionAccordion(index) {
        for (let i = 0; i < this._unsafeActionDetails?.length; i++) {
            if (i != index) {
                this._unsafeActionDetails[i].is_accordion_active = false;
            }
        }
    }

    @action
    getUnsafeActionDetails() {
        if (this._unsafeActionDetails?.length > 0) {
            this._unsafeActionDetails[0].is_accordion_active = true;
            for (let i = 1; i < this._unsafeActionDetails?.length; i++) {
                this._unsafeActionDetails[i].is_accordion_active = false;

            }
            return this._unsafeActionDetails;
        }
    }
}

export const JsoObservationStore = new Store();