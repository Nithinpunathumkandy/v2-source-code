import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { SystemLog } from 'src/app/core/models/acl/system.logs';
import { SystemLogsService } from 'src/app/core/services/acl/system-logs/system-logs.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SystemLogStore } from 'src/app/stores/acl/system-log.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any

@Component({
  selector: 'app-system-log-list',
  templateUrl: './system-log-list.component.html',
  styleUrls: ['./system-log-list.component.scss']
})
export class SystemLogListComponent implements OnInit {

  @ViewChild('detailPopup', { static: false }) detailPopup: ElementRef;
  SystemLogStore = SystemLogStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  searchText:string;
  page = 1;
  pageSize = 15;
  selectedIndex: number = 0;
  deleteEventSubscription:any;
  filename:string;
  detailObject = {
    filename:'',
    type:''
  };
  constructor(private _systemLogService:SystemLogsService,
    private _helperService:HelperServiceService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _router:Router,
    private _eventEmitterService:EventEmitterService) { }

  ngOnInit(): void {
    
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'MEETING_CATEGORY_LIST', submenuItem: { type: 'search' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        if (SubMenuItemStore.clikedSubMenuItem.type == 'search') {
            this.searchText = SubMenuItemStore.searchText;
            if(this.searchText == '' || !this.searchText)
              this.systemLogDetails();
            else{
              this.page = 1;
              this.search();
            }
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    })


    this.deleteEventSubscription = this._eventEmitterService.detailPopup.subscribe(item => {
      this.closePopup();
    })

    this.systemLogDetails();
  }

  systemLogDetails(){
    this._systemLogService.getSystemLogDetails().subscribe(()=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  changePage(newPage: number = null){
    if(newPage) this.page = newPage;
    else this.page = 1;
    this.selectedIndex = 0;
    this._utilityService.scrollToTop();
  }

  downloadFile(file){
    this._systemLogService.downloadFile(file);
  }
  
   closePopup(){
    $(this.detailPopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
   }

   search(){
    SystemLogStore.initializeArray();
    let searchResults:any = SystemLogStore.systemLogParsed.filter(o => o.date.match(this.searchText));
    SystemLogStore.setSearchResult(searchResults);
    this._utilityService.detectChanges(this._cdr);
   }

  ngOnDestroy() {
    SubMenuItemStore.unSetClickedSubMenuItem();
  }
}
