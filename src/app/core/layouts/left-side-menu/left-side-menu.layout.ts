import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef } from "@angular/core";
import { IReactionDisposer, autorun } from 'mobx';
import { Router } from "@angular/router";
import { AppStore } from '../../../stores/app.store';
import { OrganizationModulesStore } from "src/app/stores/settings/organization-modules.store";

import { UtilityService } from "src/app/shared/services/utility.service";
import { ThemeStructureSettingStore } from "src/app/stores/settings/theme/theme-structure.store";

declare var $: any;
@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-left-side-menu-layout',
    templateUrl: './left-side-menu.layout.html',
    styleUrls: ['./left-side-menu.layout.scss']
})
export class LeftSideMenuLayout {
    @ViewChild('scrollDiv',{static:false}) scrollDiv: ElementRef;
    AppStore = AppStore;
    reactionDisposer: IReactionDisposer;
    selectedModule:number = null;
    OrganizationModulesStore = OrganizationModulesStore;
    ThemeStructureSettingStore = ThemeStructureSettingStore;
    constructor(
        private _utilityService: UtilityService,
        private _cdr: ChangeDetectorRef,
        private _route: Router
    ) { }

    ngOnInit(){
        setTimeout(() => {
            $(this.scrollDiv.nativeElement).mCustomScrollbar();
        }, 1000);
    }

    mouseHover(event) {
        AppStore.openLeftSideMenu();
    }

    mouseOut(event) {
        AppStore.closeLeftSideMenu();
    }

    leftSideMenuClicked(event) {
        AppStore.closeRightSidebar();
    }

    ngOnDestroy() {
        if (this.reactionDisposer) this.reactionDisposer();
    }

    checkForPath(path,groupId?:number){
        if(this._route.url.indexOf(path) != -1 && this._route.url.indexOf(path) < 3){
            if(groupId) this.selectedModule = groupId;
            if(path == '/dashboard') this.selectedModule = null;
            return true;
        }
        else
            return false;
    }

    setModuleGroupId(id: number){
        this.selectedModule = id;
    }

}