import { observable, action, computed } from "mobx-angular";
import { Products, ProductCategories, ProductDetails, ProductsPaginatedResponse } from 'src/app/core/models/organization/business_profile/business-products';
import { Image } from 'src/app/core/models/image.model';

class Store {
    @observable 
    private _productsList: Products[] = [];

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    private _productCategoryList: ProductCategories[] = [];

    @observable
    loaded: boolean = false;

    @observable
    private _imageDetails: Image = null;

    @observable
    private _selectedProductDetails: ProductDetails;

    @observable
    private _brocureDetails: Image[] = [];

    @observable
    saveSelected: boolean = false;

    @observable
    selectedProductList=[];

    @observable
    add_category_modal: boolean = false;

    @observable // Boolean flag to decide form opened for add / edit
    addOrEditFlag = false;

    @observable // Last Created Product Category Id
    lastInsertedProductCategory: number;

    @observable
    product_select_form_modal: boolean=false;

    @action // Sets Products List
    setProductDetails(prod: ProductsPaginatedResponse) {
        this.loaded = true;
        this._productsList = prod.data;
        this.currentPage = prod.current_page;
        this.itemsPerPage = prod.per_page;
        this.totalItems = prod.total;
    }

    @computed // Returns Products List
    get productDetails(): Products[] {
        return this._productsList.slice();
    }

    @action // Set Product Category List
    setProductCategoryDetails(prodCat: ProductCategories[]) {
        this._productCategoryList = prodCat;
    }

    @computed // Return Product Category List
    get productCategoryDetails(): ProductCategories[] {
        return this._productCategoryList.slice();
    }

    @action // Sets current page for pagination
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    // Return Product Details By Id from List
    getProductDetails(id: number): Products {
        return this._productsList.slice().find(e => e.id == id);
    }

    @action // Set Thumbnail Details
    setFileDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            // this.preview_url = url;
        }
        else{
            this._brocureDetails.push(details);
            // this.brochure_preview_url = url;
        }
    }

    @action // Removes Images
    unsetFileDetails(type:string,token?:string){
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){ // If Newly uploaded remove
                this._imageDetails = null;
                // this.preview_url = null;
            }
            else{ // Set is_deleted flag
                this._imageDetails['is_deleted'] = true; 
                // this.preview_url = null;
            }
        }
        else{
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
    }

    getFileDetailsByType(type: string): Image{
        if(type == 'logo')
            return this._imageDetails;
    }

    @action // Set Selected Product Details
    setSelectedProductDetails(productDetails: ProductDetails){
        this._selectedProductDetails = productDetails;
    }

    // Returns Selected Product Details
    get selectedProductDetails(): ProductDetails{
        return this._selectedProductDetails;
    }

    // Returns Brochure Details
    get getBrochureDetails(): Image[]{
        return this._brocureDetails;
    }

    @action // Clear Brochure Details
    clearBrochureDetails(){
        this._brocureDetails = [];
    }

    @action // Set Last Created Product category id
    setLastInsertedProductCategoryId(productCategoryId: number){
        this.lastInsertedProductCategory = productCategoryId;
    }

    get lastInsertedProductCategoryId(): number{
        return this.lastInsertedProductCategory;
    }

    @action
    unsetAllData(){
        this.loaded = false;
        this._productsList = [];
        this.currentPage = 1;
        this.itemsPerPage = null;
        this.totalItems = null;
    }

    addSelectedProduct(product){
        this.selectedProductList=product;
    }


}

export const BusinessProductsStore = new Store();