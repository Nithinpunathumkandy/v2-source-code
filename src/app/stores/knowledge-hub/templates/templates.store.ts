import { TemplateList,TemplateDetails,Image, TemplatePaginationResponse } from 'src/app/core/models/knowledge-hub/templates/templates'
import { observable, action, computed } from "mobx-angular";

class Store {

    // List Data
    @observable
    private _templatesList: TemplateList[] = [];

    @observable
    private _templateDetails: TemplateDetails
    
    @observable
    private _activeTemplate:TemplateList

    @observable
    templatesLoaded: boolean = false

    activeTemplate:boolean = false;

    @observable
    templateDetailsLoaded:boolean=false

    @observable
    addFlag: boolean = true;

    templatePopup: boolean = false;

    //TemplateFiles
    @observable
    private _imageDetails: Image = null;

    @observable
    private _templateFiles: Image = null;

    @observable
    templateId:number;
    
    @observable
    preview_url: string;

    @observable
    editData: any;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    searchText: string;

    @observable
    orderBy: string='desc';

    @observable
    orderItem: string = 'documents.id';

    @observable
    templateDocumentId: number = null;

    @observable
    enableButtons:boolean=false
    

    // Ends Here
    
    // @action
    // setTemplatesList(data: TemplateList[]) {
    //     this._templatesList = data
    //     this.templatesLoaded = true;
    // }


    @action
    setTemplatesList(data: TemplatePaginationResponse) {

        this.templatesLoaded = true;
        this._templatesList = data.data
        this.currentPage = data.meta.current_page;
        this.itemsPerPage = data.meta.per_page;
        this.totalItems = data.meta.total;
    }


    @computed
    get templateList(): TemplateList[] {
        return this._templatesList
    }

    @action
    unsetTemplate() {
        this._templatesList = [];
        this.templatesLoaded = false;
     }   

    // Template Details

    @action
    setTemplateDetails(details: TemplateDetails) {
        this._templateDetails = details
        this.templateDetailsLoaded = true;
    }

    unsetTemplateDetails(){
        this._templateDetails = null;
        this.templateDetailsLoaded = false;
    }


    @computed
    get templateDetails(): TemplateDetails{
        return this._templateDetails
    }
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setActiveTemplate(details: TemplateList) {   
        this.activeTemplate = true;
        this._activeTemplate = details;   
    }

    unsetActiveTemplate() {
        this._activeTemplate = null;
        this.activeTemplate = false;
    }

    get getActiveTemplate(): TemplateList {
        return this._activeTemplate;
    }


    // File Uplaod Data

    
    @action //Sets Logo or Actvity details according to type
    setTemplateFiles(details: Image, url: string, type: string) {
        if(type == 'logo'){
            this._imageDetails = details;
            this.preview_url = url;
        }
        else{           
            this._templateFiles=details
            // this.brochure_preview_url = url;
        }
    }


    @action // When delete is clicked for logo or Actvity
    unsetTemplateFiles(type: string, token?: string) {
        if(type == 'logo'){
            if(this._imageDetails.hasOwnProperty('is_new')){
                this._imageDetails = null;
                this.preview_url = null;
            }
            else{
                this._imageDetails['is_deleted'] = true;
                this.preview_url = null;
            }
        }
        else {
            
            if(this._templateFiles.hasOwnProperty('is_new')){
                this._templateFiles = null;
                this.preview_url = null;
            }
            else{
                this._templateFiles['is_deleted'] = true;
                this.preview_url = null;
            }
        }
    }

    @action //Clears Activity Document Array
    clearTemplateFiles(){
        this._templateFiles = null;
    }

    // Returns Actvity Documents Array
    get getTemplateFiles(): Image{
        return this._templateFiles;
    }

    // Ends Here

    @action
    setTemplateId(id: number) {
        this.templateId = id;
    }

    @computed
    get getTemplateId(){
        return this.templateId
    }

}

export const TemplateStore = new Store()