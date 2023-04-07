import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { BiaService } from 'src/app/core/services/bcm/bia/bia.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BiaStore } from 'src/app/stores/bcm/bia/bia.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

@Component({
  selector: 'app-bia-processes',
  templateUrl: './bia-processes.component.html',
  styleUrls: ['./bia-processes.component.scss']
})
export class BiaProcessesComponent implements OnInit {

  BiaStore = BiaStore;
  AppStore = AppStore;
  ProcessStore = ProcessStore;
  reactionDisposer: IReactionDisposer;
  emptyTier = "emptyTier";
  sideCollapsed: boolean = false;
  sliderSubscriptionEvent: any = null; 
  biaObject = {
    component: 'BCP',
    values: null,
    type: null
  }; 

  constructor(private _activatedRoute: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,  
    private _router: Router,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _helperService: HelperServiceService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _biaService:BiaService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    NoDataItemStore.setNoDataItems({title:"process_bia_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'close', path: "../"}},
      ]
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal": 
            this.biaObject.type = 'Edit';
            BiaStore.is_edit = true   
            BiaStore.selectedProcessId = ProcessStore.process_id;
            this._router.navigateByUrl('bcm/business-impact-analysis/edit');
            break;
          default:
            break;
        }
  
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    this.getBiaDetails();
  }

  getBiaDetails() {
    BiaStore.ImpactResultLoaded = false;
    this._biaService.getImpactResult(ProcessStore.process_id,true).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy(){
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    SubMenuItemStore.makeEmpty();
    if(this.reactionDisposer) this.reactionDisposer();
  }

}
