import { Component, OnInit, ChangeDetectionStrategy, ElementRef, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from "src/app/stores/app.store";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { UnsafeActionStatusService } from 'src/app/core/services/masters/jso/unsafe-action-status/unsafe-action-status.service';
import { UnsafeActionStatusMasterStore } from 'src/app/stores/masters/jso/unsafe-action-status-store';
declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-unsafe-action-status',
  templateUrl: './unsafe-action-status.component.html',
  styleUrls: ['./unsafe-action-status.component.scss']
})
export class UnsafeActionStatusComponent implements OnInit {

  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  
  reactionDisposer: IReactionDisposer;
  UnsafeActionStatusMasterStore = UnsafeActionStatusMasterStore;
  SubMenuItemStore = SubMenuItemStore;
  AuthStore = AuthStore;
  AppStore = AppStore;
  mailConfirmationData = 'share_unsafe_action_status_message';

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
 

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _unsafeActionStatusService: UnsafeActionStatusService) { }

   /**
   * @description
   * Called after the constructor, initializing input properties, and the first call to ngOnChanges.
   * Add 'implements OnInit' to the class.
   *
   * @memberof UnsafeActionStatusComponent
   */
  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'UNSAFE_ACTION_STATUS_LIST', submenuItem: { type: 'search' }},
        {activityName: 'EXPORT_UNSAFE_ACTION_STATUS', submenuItem: {type: 'export_to_excel'}},
        // {activityName: 'SHARE_UNSAFE_ACTION_STATUS', submenuItem: {type: 'share'}},
        {activityName: null, submenuItem: {type: 'close', path: 'jso'}},
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
       
      NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    
          if (SubMenuItemStore.clikedSubMenuItem) {
            switch (SubMenuItemStore.clikedSubMenuItem.type) {
              case "export_to_excel":
                this._unsafeActionStatusService.exportToExcel();
                break;
                case "search":
                  UnsafeActionStatusMasterStore.searchText = SubMenuItemStore.searchText;
                  this.pageChange(1);
                  break;
                case "share":
                  ShareItemStore.setTitle('share_unsafe_action_status_title');
                  ShareItemStore.formErrors = {};
                  break;
              default:
                break;
            }
            // Don't forget to unset clicked item immediately after using it
            SubMenuItemStore.unSetClickedSubMenuItem();
          }
          if(NoDataItemStore.clikedNoDataItem){
            NoDataItemStore.unSetClickedNoDataItem();
          }
          if(ShareItemStore.shareData){
            this._unsafeActionStatusService.shareData(ShareItemStore.shareData).subscribe(res=>{
                ShareItemStore.unsetShareData();
                ShareItemStore.setTitle('');
                ShareItemStore.unsetData();
                $('.modal-backdrop').remove();
                document.body.classList.remove('modal-open');
                setTimeout(() => {
                  $(this.mailConfirmationPopup.nativeElement).modal('show');              
                }, 200);
            },(error)=>{
              if(error.status == 422){
                ShareItemStore.processFormErrors(error.error.errors);
              }
              ShareItemStore.unsetShareData();
              this._utilityService.detectChanges(this._cdr);
              $('.modal-backdrop').remove();
            });
          }
        })

    this.pageChange(1);
  }
  pageChange(newPage: number = null) {
    if (newPage) UnsafeActionStatusMasterStore.setCurrentPage(newPage);
    this._unsafeActionStatusService.getItems(false,null,true).subscribe(() => 
    setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


   // for popup object clearing
   clearPopupObject() {
    this.popupObject.id = null;
  }

    sortTitle(type: string) {
      this._unsafeActionStatusService.sortUnsafeActionStatusList(type, null);
      this.pageChange();
    }
  
   /**
   * @description
   * Called once, before the instance is destroyed.
   * Add 'implements OnDestroy' to the class.
   *
   * @memberof UnsafeActionStatusComponent
   */
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      UnsafeActionStatusMasterStore.searchText = '';
      UnsafeActionStatusMasterStore.currentPage = 1 ;
    }

}
