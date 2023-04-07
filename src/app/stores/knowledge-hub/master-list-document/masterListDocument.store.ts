import { observable, action, computed } from "mobx-angular";
import {Documents,DocumentsPageinationResponse, DocumentTypesPaginationResponse} from 'src/app/core/models/knowledge-hub/documents/documents'
import { DocumentDetails,FolderDetails } from 'src/app/core/models/knowledge-hub/documents/documentDetails';
import { Image } from "src/app/core/models/image.model";
import { DocumentTypes } from 'src/app/core/models/masters/knowledge-hub/document-types';
import { ComplianceRegisterDetails } from "src/app/core/models/compliance-management/compliance-register/compliance-register";


class Store {

    @observable
    private _documentsList: Documents[] = [];
    private _searchList: Documents[] = [];
    private _documentTypes: DocumentTypes[] = [];
    private _documentDetails: DocumentDetails;
    private documentHistoryData: ComplianceRegisterDetails[];
    @observable
    private _document: Image = null;
    documentsLoaded: boolean = false;
    documentTypesLoaded: boolean = false;
    currentPage: number = 1;
    itemsPerPage: number = null;
    totalItems: number = null;
    orderBy: string='desc';
    orderItem: string = 'documents.id';
    searchText: string;
    documentId: number = null;
    documentDetailsLoaded: boolean = false;
    documentTypeId: number = null;
    documentVersionId: number = null;
    listStyle: string = 'grid';
    detailsPageClosed: boolean = false;
    breadCrumbStatus: boolean = false;
    breadCrumbItemCheck:boolean=false;
    listLoaded:boolean=false
    documentHistoryLoaded: boolean=false;
    renewPopup:boolean=false;
    addDocumentPopup:boolean=false;
    documentHistoryPopup:boolean=false;
    @observable
    preview_url: string;

    @observable
    private _supportFile: Image[] = [];
    
    @observable
    private _versionFile: Image = null;




    breadCrumbData: any[] = [];
    accessData: any;
    dataId: any;
    versionNumber: string='1';
  selectedSideMenu: any;

    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @action
    setDocuments(response:DocumentsPageinationResponse) {    
        this.documentsLoaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._documentsList = response.data;
    }

    unsetDocuments() {
        this.documentsLoaded = false;
        this._documentsList = [];
    }

    @action
    setDocument(details: Image,url: string) {
        
            this._document = details;
            this.preview_url = url;
        
    }

    @action
    unsetDocument(token?:string){
        
            if (this._document.hasOwnProperty('is_new')) {
                this._document = null;
                this.preview_url = null;
            }
            else {
                this._document['is_deleted'] = true;             
            }   
       
    }
    clearDocument(){
        this._document=null;
        this.preview_url=null;
    }

    @computed
    get docDetails(): Image {
        return this._document;
    }

    
    @action
    setSearchList(response:DocumentsPageinationResponse) {    
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._searchList = response.data;
        this.listLoaded=true
    }

    unsetSearchList() {
        this._searchList = [];
        this.listLoaded=false
    }

    @action
    setDocumentTypes(response:DocumentTypesPaginationResponse) {    
        this.documentTypesLoaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._documentTypes = response.data;
    }

    unsetDocumentTypes() {
        this.documentTypesLoaded = false;
        this._documentTypes = [];
    }


    setDocumentDetails(details: DocumentDetails) {
        this._documentDetails = details
        this.documentDetailsLoaded = true;
    }

    unsetDocumentDetails() {
        this._documentDetails = null;
        this.documentDetailsLoaded = false;
    }

    @action
    setDocumentHistory(items){
        this.documentHistoryData = items
        this.documentHistoryLoaded = true;
    }

    @action
    clearDocumentHistory(){
        this.documentHistoryData = null
        this.documentHistoryLoaded = false;
    }

    @computed
    get documentHistory(){
        return this.documentHistoryData
    }


    @computed
    get documentsList(): Documents[] {
        return this._documentsList
    }

    get searchList(): Documents[] {
        return this._searchList
    }

    get documentDetails(): DocumentDetails {
        return this._documentDetails
    }


    get documentTypes(): DocumentTypes[] {
        return this._documentTypes
    }


    // *** BreadCrumb Funtions Starts Here
    @action
    setBreadcrumb(data) {
        let obj = {
            breadCrumbTitle: data.title,
            id: data.documentId,
            currentPage:data.currentPage
        }

        this.breadCrumbData.push(obj)
    }

    updatebreadCrumb(folderId) {
        
        this.breadCrumbData = this.breadCrumbData.filter(function (data) {
            return data.id==folderId
        })

    }

    clearBreadCrumb() {
        this.breadCrumbData = [];
    }
    
    @computed
    get breadCrumb() {
        return this.breadCrumbData
    }

    // *** BreadCrumb Funtions Ends Here ***

   

    // *** File Upload Functions Starts Here ***

    @action //Sets Support Files
    setSupportFile(details: Image, url: string) {

            this._supportFile.unshift(details);
            this.preview_url = url;
        
        
    }

    @action //Sets Version File
    setVersionFile(details:Image, url: string){
 
            this._versionFile=details
            this.preview_url = url;
        
        
    }

    @action
    unsetFileDetails(type, token?: string) {
        if (type == 'document-file') {
            // Delete Support File
            var b_pos = this._supportFile.findIndex(e => e.token == token)
            if(b_pos != -1){
                if (this._supportFile[b_pos].hasOwnProperty('is_new')) {   
                    this._supportFile.splice(b_pos,1);
                }
                else {                 
                    this._supportFile[b_pos]['is_deleted'] = true;
                }
            }  
        } else {

            // Delete Version File
            if(this._versionFile.hasOwnProperty('is_new')){
                this._versionFile = null;
                this.preview_url = null;
            }
            else{
                this._versionFile['is_deleted'] = true;
                this.preview_url = null;
            }

        }
    
    }

    @action
    clearSupportFiles() {
        this._supportFile = [];
    }
    @action
    clearVersionFile() {
        this._versionFile = null;
    }

    get getVersionFile(): Image{
        return this._versionFile;
    }

    get getSupportFile(): Image[]{
        return this._supportFile;
    }

    @action
    setTotalItems(total){
        this.totalItems = total;
    }
    // *** File Upload Functions Ends Here ***

   

}


export const MasterListDocumentStore = new Store ()