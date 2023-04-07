import { observable, action, computed } from "mobx-angular";
import { set } from 'mobx';

import {Role} from 'src/app/core/models/general/role';



class Store {

   

    @observable
    loaded:boolean = false;

    @observable
    private _role_list:Role[];

    @observable
    private roles=[];



    @action
    setRole(response: Role[]) {
        
        this._role_list = response;
        this.loaded = true;
    }

    // @action
    // setSelectedRole(id:number) {
    //     let selected:boolean=false;
    //     for(let i of this.roles){
    //         if(i==id){
    //             selected=true;
    //         }
    //     }
    //     if(selected!=true){
    //         this.roles.push(id);
    //     }
        
    // }

    @action
    unsetSelectedRole() {
        
        this.roles=[];
    }
  

    @computed
    get role(): Role[] {
        
        return this._role_list;
    }



    @computed
    get selectedRole(): Role[] {
        
        return this.roles;
    }


    

   
  
}

export const RoleStore = new Store();