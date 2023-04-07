import { action, computed, observable } from "mobx-angular";
import { BiaMatrixList } from "src/app/core/models/bcm/bia-matrix/bia-matrix";

class Store{
    @observable
    private _BiaMatrixList: BiaMatrixList[] = [];

    @observable
    lastInsertedId: number = null;

    @observable
    loaded: boolean = false;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    orderItem: string = 'bia_scale_categories';


    // @observable
    // individual_impact_category_loaded: boolean = false;

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
    setBiaMatrix(res:BiaMatrixList[]) {
     
        this._BiaMatrixList=res;
        this.loaded = true;
    }

    @computed
    get BiaMatrix(): BiaMatrixList[] {

        return this._BiaMatrixList.slice();
    }
}

export const BiamatrixListStore = new Store()