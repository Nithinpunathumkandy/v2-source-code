import { observable, action, computed } from "mobx-angular";
import {ARCI,ARCIPaginationResponse,ARCIDetails} from '../../../core/models/bpm/arci/arci'

class Store{
    @observable 
    private _arciMatrix: ARCIDetails[] = [];
    
    @observable
    private _arciMatrixDetails: ARCIDetails[] = []
    
    @observable
    private _arciMatrixData: ARCIDetails[] =[]

    @observable 
    loaded:boolean=false;
   
    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

     @observable
    orderBy: string='desc';

    @observable
    orderItem: string = 'ref_no';
    
    searchText: string;

    @action
    setArciMatrix(response:ARCIPaginationResponse){
        this._arciMatrix=response.data;
        this.currentPage=response.meta.current_page;
        this.itemsPerPage=response.meta.per_page;
        this.totalItems=response.meta.total;
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
    setArciMatrixDetails(details) {
        this._arciMatrixDetails = details
    }

    @action
    setArciMatrixData(data) {
        this._arciMatrixData = data
        this.loaded=true;
    }

    clearMatrixData(){
        this._arciMatrixData=[];
        this.loaded=false;
    }

    @computed
    get arciMatrixData(): ARCIDetails[] {
        
        return this._arciMatrix
    }

    

    @computed
    get arciMatrixDetails(): ARCIDetails[] {
        
        return this._arciMatrixDetails
    }

 

}

export const ArciStore = new Store();