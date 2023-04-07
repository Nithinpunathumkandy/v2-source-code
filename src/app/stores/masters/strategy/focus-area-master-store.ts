import { Image } from "src/app/core/models/image.model";
import { observable, action, computed } from "mobx-angular";
import { FocusArea, FocusAreaPaginationResponse } from "src/app/core/models/masters/strategy/focus-area.model";
class Store {
    @observable
    private _focusAreas: FocusArea[] = [];

    @observable
    selectedStrategic:FocusArea[]=[]

    @observable 
    loaded:boolean=false;

    @observable
    currentPage: number = 1;z

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'focus_areas.created_by';

    @observable
    totalItems: number = null;

    @observable
    from: number = null;

    @observable
    last_page: number = null;

    @observable
    orderBy: 'asc' | 'desc' = 'desc';

    @observable
    lastInsertedId: number = null;

    @observable
    saveSelected: boolean = false;
    
    @observable
    private _documentDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    objective_select_form_modal:boolean=false;

    searchText: string;
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    addSelectedLocation(issues){
        this.selectedStrategic = issues;
    }

    @action
    setFocusAreas(response: FocusAreaPaginationResponse) {
        

        this._focusAreas = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.from = response.from;
        this.loaded = true;
       
    }

    @action
    clearDocumentDetails() {
        this._documentDetails = null;
        this.preview_url = null;
    }
    @action
    setDocumentDetails(details: Image,url: string) {
            this._documentDetails = details;
            this.preview_url = url;
        
    }

    @action
    unsetDocumentDetails(token?:string){
        
         
                if(this._documentDetails.hasOwnProperty('is_new')){
                    this._documentDetails = null;
                }
                else{
                    this._documentDetails['is_deleted'] = true;
                }
            
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        

       
    }

    @action
    setAllFocusAreas(focusArea: FocusArea[]) {
       
        this._focusAreas = focusArea;
        this.loaded = true;
        
    }


    get docDetails() {
        return this._documentDetails
    }
    
    @computed
    get allItems(): FocusArea[] {
        
        return this._focusAreas.slice();
    }
    @action
    setLastInsertedId(id: number){
        this.lastInsertedId = id;
    }

    @action
    getFocusAreasById(id: number): FocusArea {
        return this._focusAreas.slice().find(e => e.id == id);
    }
}
export const FocusAreaMasterStore = new Store();