import { observable, action, computed } from "mobx-angular";
import { BreadCrumbMenuItem } from 'src/app/core/models/general/breadcrumb-menu.model';

class Store {

    @observable
    breadCrumbMenuItems: BreadCrumbMenuItem[] = [];

    @observable
    displayBreadCrumbMenu: boolean = false
    
    @observable
    refreshBreadCrumbMenu: boolean = false;

    @action
    addBreadCrumbMenu(item){
        //var pos = this.breadCrumbMenuItems.findIndex(e=>e.path == item.path);
        //if(pos == -1) this.breadCrumbMenuItems.unshift(item);
        //else{
            // this.breadCrumbMenuItems.splice(pos,1);
            // this.breadCrumbMenuItems.unshift(item);
        // }
        this.breadCrumbMenuItems = [item];
        // console.log(this.breadCrumbMenuItems);
    }

    @action
    removeBreadCrumbMenu(type){
        var pos = this.breadCrumbMenuItems.findIndex(e=>e.name == type);
        if(pos != -1) this.breadCrumbMenuItems.splice(pos,1);
    }

    @action
    makeEmpty() {
        this.breadCrumbMenuItems = [];
    }

}

export const BreadCrumbMenuItemStore = new Store();