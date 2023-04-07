import { observable, action, computed } from "mobx-angular";
import { Users, Subsection, Designation,UserPaginationResponse,Country, UserCount, UserRole } from 'src/app/core/models/human-capital/users/users';
import { IndividualUser,Status } from 'src/app/core/models/human-capital/users/users';
import { Organization } from 'src/app/core/models/human-capital/users/users';
import { Address } from 'src/app/core/models/human-capital/users/users';
import { Branch } from 'src/app/core/models/branch.model';
import { Division } from 'src/app/core/models/division.model';
import { Department } from 'src/app/core/models/department.model';
import { Section } from 'src/app/core/models/section.model';
import { Image } from 'src/app/core/models/image.model';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';

class Store {
   
    @observable
    private _users: Users[] = [];
    
    @observable
    usersRoles: UserRole[] = [];

    @observable
    private _individualUser: IndividualUser;

    @observable
    designation_loaded: boolean = false;

    @observable
    user_loaded: boolean = false;

    @observable
    individual_user_loaded: boolean = false;

    @observable
    user_id: number = null;

    @observable
    private _imageDetails: Image = null;

    @observable
    preview_url: string;

    @observable
    logo_preview_available = false;

    @observable
    usersProfile = false;

    @observable
    currentPage: number = 1;

    @observable
    orderBy: 'asc' | 'desc' = 'asc';

    @observable
    orderItem: string = 'users.first_name';

    @observable
    itemsPerPage: number = 15;

    @observable
    totalItems: number = null;

    @observable
    designation_id:number = null;

    @observable
    designation_index:number = null;

    @observable
    currentDate=new Date();

    @observable
    searchText = null;

    @observable
    _userCount = null;

    @observable
    unfilteredUsers: Users[] = [];

    @observable
    selectedStatus=null;

    @action
    setUsers(response:UserPaginationResponse) {
        this.user_loaded = true;
        this.currentPage = response.current_page;
        this.itemsPerPage = response.per_page;
        this.totalItems = response.total;
        this._users = response.data;
    }

    @computed
    get usersList(): Users[] {
        return this._users;
    }

    @action
    setCurrentPage(current_page: number) {
        this.currentPage = current_page;
    }


    @action
    setIndividualUser(settings: IndividualUser) {
        this.individual_user_loaded = true;
        this._individualUser = settings;
    }

    @action
    setUserId(id: number) {

        this.user_id = id;
    }

    @action
    unsetUserId() {

        this.user_id = null;
        this.individual_user_loaded = false
    }
    

    @action //To give edit and delete option responsive
    setUsersProfile() {
        this.usersProfile = true;
    }

    @action
    setUserCount(count){
        this._userCount = count;
    }

    @action
    unsetUsersProfile() {
        this.usersProfile = false;
    }

    @action
    unsetIndividualUser() {
        this._individualUser = null;
        this.individual_user_loaded = false;
    }

    @action
    getUserById(id: number): Users {
        return this._users.slice().find(e => e.id == id);
    }


    @computed
    get individualUser(): IndividualUser {

        return this._individualUser;
    }

    @computed
    get language(): string {

        return this._individualUser?.language;
    }

    @computed
    get contactAddress(): Address {
        if(this._individualUser?.address){
            for (let i of this._individualUser?.address) {
                if (i.type == 'contact') {
                    return i;
                }
            }
        }
        
    }

    @computed
    get emergencyAddress(): Address {

        for (let i of this._individualUser?.address) {
            if (i.type == 'emergency') {
                return i;
            }
        }
    }



    @computed
    get roles(): string {
        let role = [];
        for (let i of this._individualUser?.roles) {
            role.push(i.title);
        }
        return role.join();

    }

    @computed
    get status(): Status {

        return this._individualUser?.status;
    }

    @computed
    get users(): Users[] {

        return this._users;
    }

    @computed
    get userCount():UserCount{
        return this._userCount;
    }

   
    @action
    setImageDetails(details: Image, url: string, type: string) {
        if (type == 'logo') {
            this._imageDetails = details;//for user profile
            this.preview_url = url;
        }
    }



    @action
    unsetImageDetails(type: string, token?: string) {
        if (type == 'logo') {
            if (this._imageDetails.hasOwnProperty('is_new')) {
                this._imageDetails = null;
                this.preview_url = null;
            }
            else {
                this._imageDetails['is_deleted'] = true;
               
            }
        }

    }


    get getImageDetails(): Image {
        return this._imageDetails; //user profile image details
    }

    // editSubmenu(){
    //     if (UsersStore.individual_user_loaded && this.usersProfile) {
    //         if (UsersStore.individualUser.status.id == 1) {
    //           SubMenuItemStore.addSubMenu({ type: 'deactivate' });
    //         }
    //         else {
    //           SubMenuItemStore.addSubMenu({ type: 'activate' });
    //         }
    //         SubMenuItemStore.addSubMenu({ type: 'close', path: '../' });
    //       }
         
    // }

    @action
    setOrderBy(order_by: 'asc' | 'desc') {
        this.orderBy = order_by;
    }


    @action
    setAllUsers(user: Users[]) {
        this._users = user;
    }

    @action
    unsetUserList(){
        this._users=[];
        this.user_loaded=false;
        this.totalItems = null;
        this.currentPage = null;
        this.itemsPerPage = 15;
    }

}

export const UsersStore = new Store();