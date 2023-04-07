import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { autorun, IReactionDisposer } from 'mobx';
import { MasterMenuService } from "src/app/core/services/masters/general/master-menu/master-menu.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MasterMenuItemsStore } from "src/app/stores/masters/general/master-menu-store";

@Component({
  selector: 'app-master-menu',
  templateUrl: './master-menu.component.html',
  styleUrls: ['./master-menu.component.scss']
})
export class MasterMenuComponent implements OnInit {

  MasterMenuItemsStore = MasterMenuItemsStore;
  reactionDisposer: IReactionDisposer;
  constructor(private _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,
    private _masterMenuService: MasterMenuService) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close', path: 'masters'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
    
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })
    this.pageChange();
  }

  pageChange(newPage?:number){
    this._masterMenuService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy(){
    SubMenuItemStore.makeEmpty();
    if (this.reactionDisposer) this.reactionDisposer();
  }

}
