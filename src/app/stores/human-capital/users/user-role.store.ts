import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { UserRole, UserRolePaginationResponse } from 'src/app/core/models/human-capital/users/user-role';
import { Image } from "src/app/core/models/image.model";
import { User } from 'src/app/core/models/user.model';
class Store {
    @observable
    private _userRoleList: UserRole[] = [];

   
    @observable
    loaded: boolean = false;

    @observable
    role_preview_available = false;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    selected_preview_url: string;

    @observable
    private _roleDocumentDetails: Image[] = [];

    @observable
    private _individualRoleDetails: UserRole;

    @observable
    individual_role_loaded: boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;


    @action
    setUserRoleDetails(response: UserRolePaginationResponse) {
        this._userRoleList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    unsetUserRoleDetails() {
        this._userRoleList = [];
        this.loaded = false;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateUserRole(role: UserRole) {
        const roles: UserRole[] = this._userRoleList.slice();
        const index: number = roles.findIndex(e => e.id == role.id);
        if (index != -1) {
            roles[index] = role;
            this._userRoleList = roles;
            this.unsetRoleListAccordion(index);
        }
    }
    


    @computed
    get userRoleDetails(): UserRole[] {
      
        return this._userRoleList.slice();
    }

    setRoleListAccordion(index){
        //if(this._userRoleList[index].hasOwnProperty('is_accordion_active')){
        if(this._userRoleList[index].is_accordion_active == true)
            this._userRoleList[index].is_accordion_active = false;
        else
            this._userRoleList[index].is_accordion_active = true;
        // }
        // else{
        //     this._userRoleList[index].is_accordion_active == true
        // }
        this.unsetRoleListAccordion(index);
        // for(let i=0;i<this._userRoleList.length;i++){
        //     if(i != index){
        //         this._userRoleList[i].is_accordion_active == false;
        //     }
        // }
    }

    unsetRoleListAccordion(index){
        for(let i=0;i<this._userRoleList.length;i++){
            if(i != index){
                this._userRoleList[i].is_accordion_active = false;
            }
        }
    }

    getUserRoleById(id: number): UserRole {
        let userRoleList;
       
        userRoleList= this._userRoleList.slice().find(e => e.id == id);
        UserRoleStore.setIndividualRoleDetails(userRoleList);
        return userRoleList;
    }

    @action
    setIndividualRoleDetails(details){
        this.individual_role_loaded=true;
        this._individualRoleDetails = details;
        
    }

    unsetIndiviudalRoleDetails(){
        this._individualRoleDetails = null;
        this.individual_role_loaded = false;
    }

    @action
    clearDocumentDetails(){
        this._roleDocumentDetails = [];
        this.preview_url = null;
    }

    get userRoleById() {
        
        return this._individualRoleDetails;
    }

    

    @computed
    get individualRoleDetails(): UserRole{
        return this._individualRoleDetails;
    }


    @computed
    get roleDetails(): Image[]{
        return this._roleDocumentDetails.slice();
    }

    @action
    setDocumentDetails(details:Image, url: string, type: string){
        if(type == 'logo'){
            this._imageDetails = details;
            this.preview_url = url;
        }
        else{
            this._roleDocumentDetails.push(details);
            this.preview_url = url;
        }
    }

    @action
    clearRoleDetails(){
        this._roleDocumentDetails = [];
        this.preview_url = null;
    }

    
    getDocumentByType(): Image{
       
            return this._imageDetails;
        // else
        //     this.getBrochureDetails;
    }

    @action
    unsetDocumentDetails(type: string,token?:string){
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
            var b_pos = this._roleDocumentDetails.findIndex(e => e.token == token)
            if(b_pos != -1){
                if(this._roleDocumentDetails[b_pos].hasOwnProperty('is_new')){
                    this._roleDocumentDetails.splice(b_pos,1);
                }
                else{
                    this._roleDocumentDetails[b_pos]['is_deleted'] = true;
                }
            }
           
        }

       
    }

    

    get RoleImageDetails(): Image {
        return this._imageDetails;
    }

    @action
    setSelectedDocumentDetails(imageDetails){
        
            this.selected_preview_url = imageDetails;
    }


    
}

export const UserRoleStore = new Store();