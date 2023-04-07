import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';
import { AclRole, AclRolePaginationResponse,Acl } from 'src/app/core/models/acl/acl';

class Store {
    @observable
    private _aclRoleList: AclRole[] = [];
   
    @observable
    loaded: boolean = false;

    @observable
    role_preview_available = false;

    @observable
    private _individualRoleDetails: AclRole;

    @observable
    individual_role_loaded: boolean=false;

    @observable
    acl_list_loaded: boolean=false;

    @observable
    currentPage: number = 1;

    @observable
    itemsPerPage: number = null;

    @observable
    totalItems: number = null;

    @observable
    private roles=[];

    @observable
    private _roleId = null;

    @observable
    private _roleActivities:Acl[] = [];

    @observable
    role_loaded:boolean = false;


    @action
    setAclRoleDetails(response: AclRolePaginationResponse) {
        this._aclRoleList = response.data;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this.loaded = true;
    }

    @action
    unsetAclRoleDetails() {
        this._aclRoleList = null;
        this.loaded = false;
    }

    @action
    setRoleActivities(response: Acl[]) {
        this._roleActivities = response;
        this.role_loaded = true;
       
    }



    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }

    @action
    updateAclRole(role: AclRole) {
        const roles: AclRole[] = this._aclRoleList.slice();
        const index: number = roles.findIndex(e => e.id == role.id);
        if (index != -1) {
            roles[index] = role;
            this._aclRoleList = roles;
        }
    }

    @computed
    get selectedRole(): AclRole[] {
        
        return this.roles;
    }

    @computed
    get roleActivities(): Acl[] {
        
        return this._roleActivities;
    }

    @action
    unsetSelectedRole() {
        
        this.roles=[];
    }
  

    

    @computed
    get aclRoles(): AclRole[] {
      
        return this._aclRoleList
    }

    getAclRoleById(id: number): AclRole {
        let aclRoleList;
       
        aclRoleList= this._aclRoleList.slice().find(e => e.id == id);
        AclStore.setIndividualRoleDetails(aclRoleList);
        return aclRoleList;
    }

    @action
    setIndividualRoleDetails(details){
        this.individual_role_loaded=true;
        this.acl_list_loaded=true;
        this._individualRoleDetails = details;
        
    }

    @action
    setRoleId(id){
        this._roleId = id;
        
    }

    @action
    unsetRoleId(){
        this._roleId = null;

    }

    get selectedRoleId(){
        return this._roleId;
    }


    unsetIndiviudalRoleDetails(){
        this._individualRoleDetails = null;
        this.individual_role_loaded = false;
        this.acl_list_loaded = false;
    }

    get aclRoleById() {
        
        return this._individualRoleDetails;
    }

    

    @computed
    get individualRoleDetails(): AclRole{
        return this._individualRoleDetails;
    }

    
}

export const AclStore = new Store();