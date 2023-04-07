import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { UserDocument } from 'src/app/core/models/human-capital/users/user-document';
import { Image } from "src/app/core/models/image.model";
import { User } from 'src/app/core/models/user.model';
class Store {
    @observable
    private _userDocumentList: UserDocument[] = [];

    // @observable
    // currentPage: number = 1;

    // @observable
    // itemsPerPage: number = null;

    // @observable
    // totalItems: number = null;

    @observable
    loaded: boolean = false;

    @observable
    document_preview_available = false;

    @observable
    selected_preview_url: string;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    private _documentDetails: Image[] = [];

    @observable
    private _individualDocumentDetails: UserDocument;

    @observable
    individual_document_loaded: boolean=false;

    @observable
    currentDate=new Date();

    @observable
    currentPage:number=1;


    @action
    setUserDocumentDetails(response: UserDocument[]) {
       
        this._userDocumentList = response;
        this.loaded = true;
    }

    @action
    unsetUserDocumentDetails() {
       
        this._userDocumentList = [];
        this.loaded = false;
    }

    // @action
    // setCurrentPage(current_page: number) {
    //     this.currentPage = current_page;
    // }

    @action
    updateUserDocument(document: UserDocument) {
        const documents: UserDocument[] = this._userDocumentList.slice();
        const index: number = documents.findIndex(e => e.id == document.id);
        if (index != -1) {
            documents[index] = document;
            this._userDocumentList = documents;
        }
    }


    @action
    setCurrentPage(page: number) {
        this.currentPage = this.currentPage+page;
    }
    


    @computed
    get userDocumentDetails(): UserDocument[] {
      
        return this._userDocumentList;
    }

    getUserDocumentById(id: number): UserDocument {
        let userDocumentList;
       
        userDocumentList= this._userDocumentList.slice().find(e => e.id == id);
        UserDocumentStore.setIndividualDocumentDetails(userDocumentList);
        return userDocumentList;
    }

    @action
    setIndividualDocumentDetails(details){
        this.individual_document_loaded=true;
        this._individualDocumentDetails = details;
        
    }

    get UserDocumentById() {
        
        return this._individualDocumentDetails;
    }

    

    @computed
    get individualDocumentDetails(): UserDocument{
        return this._individualDocumentDetails;
    }


    @computed
    get getDocumentDetails(): Image[]{
        return this._documentDetails.slice();
    }

    @action
    setDocumentImageDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            this.preview_url = url;
        }
        else{
            this._documentDetails.push(details);
            this.preview_url = url;
        }
    }

    @action
    clearDocumentDetails(){
        this._documentDetails = [];
        this.preview_url = null;
    }

    @action
    setSelectedImageDetails(imageDetails){
        
            this.selected_preview_url = imageDetails;
    }

    getSelectedImageDetails():string {
       
            return this.selected_preview_url;
    }

    
    getDocumentImageDetailsByType(): Image{
       
            return this._imageDetails;
        // else
        //     this.getBrochureDetails;
    }

    @action
    unsetProductImageDetails(type: string,token?:string){
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
        else{
            var b_pos = this._documentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._documentDetails[b_pos].hasOwnProperty('is_new')){
                    this._documentDetails.splice(b_pos,1);
                }
                else{
                    this._documentDetails[b_pos]['is_deleted'] = true;
                }
            }
            //this._brocureDetails = null;
            //this.brochure_preview_url = null;
        }

       
    }

    setDocumentListAccordion(index) {
        if (this._userDocumentList.length > 0) {
            if (this._userDocumentList[index].is_accordion_active == true)
                this._userDocumentList[index].is_accordion_active = false;
            else
                this._userDocumentList[index].is_accordion_active = true;
            this.unsetDocumentListAccordion(index);
        }
    
    }
    
    unsetDocumentListAccordion(index) {
        if (this._userDocumentList.length > 0) {
            for (let i = 0; i < this._userDocumentList.length; i++) {
                if (i != index) {
                    this._userDocumentList[i].is_accordion_active = false;
                }
    
            }
        }
    }

    

    get getDocumentImageDetails(): Image {
        return this._imageDetails;
    }


    
}

export const UserDocumentStore = new Store();