import { observable, action, computed } from "mobx-angular";
import { Likelihood, LikelihoodPaginationResponse, IndividualLikelihood } from 'src/app/core/models/risk-management/risk-configuration/likelihood';
class Store {
    @observable
    private _likelihoodList: Likelihood[] = [];

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'reference_code';

    @observable
    private _individualLikelihoodDetails: IndividualLikelihood;

    @observable
    individual_likelihood_loaded: boolean = false;

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

    @action
    setLikelihoodDetails(response: LikelihoodPaginationResponse) {
        this._likelihoodList = response.data;
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
    updateLikelihood(likelihood: Likelihood) {
        const likelihoods: Likelihood[] = this._likelihoodList.slice();
        const index: number = likelihoods.findIndex(e => e.id == likelihood.id);
    }


    @computed
    get likelihoodDetails(): Likelihood[] {

        return this._likelihoodList.slice();
    }

    getLikelihoodById(id: number): IndividualLikelihood {
        let likelihoodList;

        likelihoodList = this._likelihoodList.slice().find(e => e.id == id);
        IsmsLikelihoodStore.setIndividualLikelihoodDetails(likelihoodList);
        return likelihoodList;
    }

    @action
    setIndividualLikelihoodDetails(details:IndividualLikelihood) {
        this.individual_likelihood_loaded = true;
        this._individualLikelihoodDetails = details;
        // this.updateLikelihood(details);
    }

    unsetIndiviudalLikelihoodDetails() {
        this._individualLikelihoodDetails = null;
        this.individual_likelihood_loaded = false;
    }

   
    @computed
    get individualLikelihoodDetails(): IndividualLikelihood {
        return this._individualLikelihoodDetails;
    }


}

export const IsmsLikelihoodStore = new Store();