import { Component,OnInit, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-human-capital-users-page',
    templateUrl: './human-capital-users.page.html',
    styleUrls: ['./human-capital-users.page.scss']
})
export class HumanCapitalUsersPage implements OnInit,OnDestroy{
    users: Array<any> = new Array(8);

    constructor() { }

    ngOnInit(){
        BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    }

    ngOnDestroy(){
        BreadCrumbMenuItemStore.displayBreadCrumbMenu = false; 
        UsersStore.designation_index=0;
        UsersStore.designation_id = null;
        SubMenuItemStore.userGridSystem=false;
        SubMenuItemStore.gridTitle='list_view';
    }

}
