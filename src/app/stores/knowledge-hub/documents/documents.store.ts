import { observable, action, computed } from "mobx-angular";
import {Documents,DocumentsPageinationResponse,DocumentTypesPaginationResponse , ReviewUpdate , ReviewUpdatePagination} from 'src/app/core/models/knowledge-hub/documents/documents'
import { DocumentDetails,FolderDetails, DocumentMappingDetails } from 'src/app/core/models/knowledge-hub/documents/documentDetails';
import { Image } from "src/app/core/models/knowledge-hub/documents/documents";
import { DocumentTypes } from 'src/app/core/models/masters/knowledge-hub/document-types';
import { any } from "@amcharts/amcharts4/.internal/core/utils/Array";

class Store {

    @observable
    private _documentsList: Documents[] = [];
    private _searchList: Documents[] = [];
    private _documentTypes: DocumentTypes[] = [];
    private _documentDetails: DocumentDetails;
     _documentMappingDetails:DocumentMappingDetails;
    private _folderDetails: FolderDetails;

    private reviewHistory:ReviewUpdate[]=[];

    documentsLoaded: boolean = false;
    documentTypesLoaded: boolean = false;
    documentMappingDetailsLoaded:boolean=false;
    currentPage: number = 1;
    rootCurrentPage: number;
    itemsPerPage: number = null;
    totalItems: number = null;
    orderBy: string='desc';
    orderItem: string = 'documents.id';
    searchText: string;
    departmentId: string;
    documentId: number = null;
    folderId: number = null;
    documentDetailsLoaded: boolean = false;
    folderDetailsLoaded: boolean = false;
    documentVersionId: number = null;
    documentTypeId: number = null;
    selectedDocumentCategoryId: number;
    selectedDocumentSubCategoryId: number;
    quick_upload: boolean = false;
    listStyle: string = 'grid';
    detailsPageClosed: boolean = false;
    breadCrumbStatus: boolean = false;
    selectedSideMenu: any = 'private';
    parentDataStatus: any = false;
    fileUploadType: string;
    renameFolder: boolean = false;
    breadCrumbItemCheck:boolean=false;
    selectedSideMenuType:string;
    listLoaded:boolean=false
    enableButtons:boolean=false;
    enableWorkflow:boolean=false
    reviewLoaded:boolean=false
    reviewcurrentPage: number = 1;    
    reviewitemsPerPage: number = null;
    reviewtotalItems: number = null;
    showNewDesign:boolean=false;

    @observable
    preview_url: string;

    @observable
    private _supportFile: Image[] = [];
    
    @observable
    private _versionFile: Image = null;

    // For Form Preview
    @observable
    _msType = [];

    @observable
    issue_select_form_modal: boolean = false;
    @observable
    processes_select_form_modal: boolean = false;
    @observable
    risk_select_form_modal: boolean = false;


    breadCrumbData: any[] = [];
    accessData: any;
  dataId: any;
  versionNumber: string='1';
  enableChecklistPopup: boolean=false;
    
    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    setRootCurrentPage(pageNumber: number) {
        this.rootCurrentPage=pageNumber
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
    setSearchList(response:DocumentsPageinationResponse) {    
        // this.documentsLoaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._searchList = response.data;
        this.listLoaded=true
    }

    unsetSearchList() {
        // this.documentsLoaded = false;
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

    setDocumentMappingDetails(details: DocumentMappingDetails) {
        this._documentMappingDetails = details
        this.documentMappingDetailsLoaded = true;
    }

    unsetDocumentDetails() {
        this._documentDetails = null;
        this.documentDetailsLoaded = false;
    }
    setFolderDetails(details: FolderDetails) {
        this._folderDetails = details
        this.folderDetailsLoaded = true;
    }

    unsetFolderDetails() {
        this._documentDetails = null;
        this.folderDetailsLoaded = false;
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

    get folderDetails(): FolderDetails {
        return this._folderDetails
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

    // *** Parent Folder Access Details Starts Here *** //

    @action
        
    setParentAccessData(accessData) {
        this.accessData = accessData
        
    }

    clearParentAccessData() {
        this.accessData = null;
        this.parentDataStatus = false;
    }
    
    @computed
    get ParentData() {
        return this.accessData
    }

     // * Checking the parentData Status and accessType to enable | disable click event.

    @action
    
    accessVerification() {
    
    // * Condition where, there is no parent folder(Root Condition)
    if (!DocumentsStore.parentDataStatus)
      return true
    // * Condition where , there is parent folder and parent accessType is private
    if (DocumentsStore.parentDataStatus && DocumentsStore.ParentData.accessId == 1)
      return true;
    
    // * Condition where , there is parent folder and parent accessType is public | shared
    if (DocumentsStore.parentDataStatus && DocumentsStore.ParentData.accessId != 1)
      return false;
    
  }

  // *Checking the parentData Status and accessType to Only View the Data ( fixing the access Parameters ) 

    readOnlyVerification() {

    // * Condition where, there is no parent folder(Root Condition)
    if (!DocumentsStore.parentDataStatus)
      return false;
    // * Condition where, there is parent folder and accessType is Shared
    if (DocumentsStore.parentDataStatus && DocumentsStore.ParentData.accessId == 3)
      return true;
    
     // * Condition where, there is parent folder and accessType is Public | Private
      if (DocumentsStore.parentDataStatus && DocumentsStore.ParentData.accessId != 3)
      return false;
    
  }

    // *** Parent Folder Access Details Ends Here ***

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

    @action
    setReviewUpdate(response:ReviewUpdatePagination){
        this.reviewLoaded = true;
        this.reviewcurrentPage = response.current_page;
        this.reviewitemsPerPage = response.per_page;
        this.reviewtotalItems = response.total;
        this.reviewHistory = response.data;
    }

    @action
    unsetReviewUpdate(){
        this.reviewLoaded = false;
        this.reviewHistory = [];
    }

    @action 
    unsetMappingDetails()
    {
        this._documentMappingDetails = null;
        this.documentMappingDetailsLoaded = false;
    }

    @computed
    get reviewUpdate(){
        return this.reviewHistory
    }

}


export const DocumentsStore = new Store ()