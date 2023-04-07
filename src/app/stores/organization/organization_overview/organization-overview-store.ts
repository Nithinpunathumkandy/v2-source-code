
import { observable, action, computed } from "mobx-angular";
import { OrganizationOverviewPaginationResponse,OrganizationOverview } from "src/app/core/models/organization/organization-overview/organization-overview";
import { Image } from "src/app/core/models/image.model";




class Store {

    @computed
    get infoDetails(): OrganizationOverview[] {
        return this._organizationOverview.slice();
    }

    @observable
    private _imageDetails: Image = null;

    @observable
    _organizationOverview: OrganizationOverview[] = [];

    @observable  
    loaded:boolean=false;

    @observable  
    module_id: number = null;

    @observable  
    module_group_id: number = null;

    @observable
    currentPage: number = 1;

    @observable
    selectedModuleId: number = null;

    @observable
    itemsPerPage: number = null;

    @observable
    orderItem: string = 'project_document_title.created_at';

    @observable
    individualLoaded: boolean = false;


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
    preview_url: string;

    @observable
    searchText: string;

    @observable
    logo_preview_available = false;

    @observable
    selectedInfoDetailsLoaded : boolean = false;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable
    selectedInfoDetails: OrganizationOverview;

    @action
    setFileDetails(details:Image, url: string, type: string){
            this._imageDetails = details;
            // this.preview_url = url;
    }

    getFileDetailsByType(type: string): Image{
            return this._imageDetails;
    }

    @action
    unsetFileDetails(type: string,data?){
        console.log(data)
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                this._imageDetails['document_id'] = data ? data : null

                // this.preview_url = null;
            }
        }
        
    }

    @action
    setSelectedInfoDetails(infoDetails: OrganizationOverview){
        this.selectedInfoDetailsLoaded = true;
        this.selectedInfoDetails = infoDetails;
    }

    @action
    unsetSelectedBranchDetails(){
        this.selectedInfoDetailsLoaded = false;
        this.selectedInfoDetails = null;
    }

    get getSelectedInfoDetails(): OrganizationOverview{
        return this.selectedInfoDetails;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setOverview(response: OrganizationOverview[]) {
        this._organizationOverview = response;
        // this.currentPage = response.current_page;
        // this.itemsPerPage = response.per_page;
        // this.totalItems = response.total;
        // this.from = response.from;
        this.loaded = true;
    }
    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }

    @action
    getInfoById(id: number): OrganizationOverview {
        return this._organizationOverview.slice().find(e => e.id == id);
    }


    @computed
    get allItems(): OrganizationOverview[] {
        return this._organizationOverview
    }
  
}


export const OrganizationOverviewStore = new Store();

