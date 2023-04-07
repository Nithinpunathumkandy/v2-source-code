import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, Renderer2, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { IReactionDisposer, autorun } from "mobx";
import { pipe, Subject, Subscription } from "rxjs";
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { UtilityService } from "src/app/shared/services/utility.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { RightSidebarLayoutStore } from "src/app/stores/general/right-sidebar-layout.store";
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ChangeRequestService } from 'src/app/core/services/knowledge-hub/change-request/change-request.service';
import { RightSidebarFilterService } from "src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service";

declare var $: any;

@Component({
  selector: 'app-change-request-list',
  templateUrl: './change-request-list.component.html',
  styleUrls: ['./change-request-list.component.scss']
})
export class ChangeRequestListComponent implements OnInit, OnDestroy {

  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;


  reactionDisposer: IReactionDisposer;

  AppStore = AppStore;
  AuthStore = AuthStore;
  SubMenuItemStore = SubMenuItemStore;
  changeRequestStore = changeRequestStore;

  filterSubscription: Subscription;
  deleteEventSubscription: Subscription;
  private destroy$ = new Subject();

  userDetailObject = {
    id: null,
    first_name: '',
    last_name: '',
    designation: '',
    image_token: '',
    mobile: null,
    email: '',
    department: '',
    status_id: null
  }

  confirmationObject = {
    title: '',
    id: null,
    subtitle: '',
    type: null
  };

  constructor(
    private _router: Router,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _documentFileService: DocumentFileService,
    private _changeRequestService: ChangeRequestService,
    private _rightSidebarFilterService: RightSidebarFilterService
  ) { }

  ngOnInit(): void {

    //Discussion box on right corner
    AppStore.showDiscussion = true;

    //This is for Right Side filter
    RightSidebarLayoutStore.showFilter = true;

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      //this.changeRequestStore.cRlistLoaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    });

    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'DOCUMENT_CHANGE_REQUEST_LIST', submenuItem: { type: 'search' } },
        { activityName: 'DOCUMENT_CHANGE_REQUEST_LIST', submenuItem: { type: 'refresh' } },
        { activityName: 'CREATE_DOCUMENT_CHANGE_REQUEST', submenuItem: { type: 'new_modal' } },
        { activityName: 'EXPORT_DOCUMENT_CHANGE_REQUEST', submenuItem: { type: 'export_to_excel' } },
      ]
      this._helperService.checkSubMenuItemPermissions(700, subMenuItems);
      NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_new_change_request' });
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.openRequestForm();
            }, 1000);
            break;
          case "refresh":
            changeRequestStore.unsetChangeRequest();
            SubMenuItemStore.searchText = '';
            changeRequestStore.searchText = '';
            this.pageChange(1);
            break;
          case "template":
            this._changeRequestService.generateTemplate();
            break;
          case "export_to_excel":
            this._changeRequestService.exportToExcel();
            break;
          case "search":
            changeRequestStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }

        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if (NoDataItemStore.clikedNoDataItem) {
        this.openRequestForm();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    });


    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
      window.addEventListener('scroll', this.scrollEvent, true);
    }, 1000);

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(status => {
      this.deleteChangeRequest(status)
    })

    SubMenuItemStore.setNoUserTab(true);
    RightSidebarLayoutStore.filterPageTag = 'document-request';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'document_change_request_status_ids',
      'document_change_request_type_ids',
      'user_ids'
    ]);
    this.pageChange(1);//Need to call this function end of the side filter - Important
  }

  //Getting list data
  pageChange(newPage: number = null) {
    if (newPage) changeRequestStore.setCurrentPage(newPage);
    this._changeRequestService.getAllItems(false).pipe(takeUntil(this.destroy$)).subscribe(res =>
      setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  //It goes to details page
  gotoDetails(id) {
    changeRequestStore.documentId = id;
    this._router.navigateByUrl('knowledge-hub/change-requests/' + id)
  }

  //Open change request form
  openRequestForm() {
    this._router.navigateByUrl('/knowledge-hub/change-requests/add-request');
  }

  //Opening delete popup
  openDeletePopup(id: number,event) {
    event.stopPropagation();
    this.confirmationObject.id = id;
    this.confirmationObject.title = 'Delete Change Request?';
    this.confirmationObject.subtitle = 'common_delete_subtitle';
    this.confirmationObject.type = ''
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  //closing delete popup
  closeDeletePopup() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  //Editing change request
  editChangeRequest(id,event) {
    event.stopPropagation();
    changeRequestStore.editCheck = true;
    changeRequestStore.setChangeRequestId(id)
    changeRequestStore.unsetChangeRequestDetails();
    this._changeRequestService.getItemById(id).subscribe(res => {
      this._router.navigateByUrl('knowledge-hub/change-requests/edit-request');
      this._utilityService.detectChanges(this._cdr)
    });
  }

  //Delete Change Request Function
  deleteChangeRequest(status: boolean) {
    if (status && this.confirmationObject.id) {
      this._changeRequestService.delete(this.confirmationObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
        this.closeDeletePopup();
      });
    }
    else {
      this.closeDeletePopup();
      this.clearPopupObject();
    }
  }

  //Sorting items
  setControlSort(type) {    
    this._changeRequestService.sortControlList(type, true);
    this.pageChange();
  }
  
  //Scrol event function
  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  //User details popup object
  getPopupDetails(user) {
    this.userDetailObject.id = user?.created_by_id;
    this.userDetailObject.first_name = user.created_by_first_name;
    this.userDetailObject.last_name = user?.created_by_last_name;
    this.userDetailObject.designation = user?.created_by_designation_title;
    this.userDetailObject.image_token = user?.created_by_image_token;
    this.userDetailObject.email = user?.created_by_email;
    this.userDetailObject.mobile = user?.created_by_mobile;
    this.userDetailObject.department = user?.created_by_department ? user?.created_by_department : null;
    this.userDetailObject.status_id = user?.created_by_status_id ? user?.created_by_status_id : 1;
    return this.userDetailObject;
  }

  //Need to clear after delete
  clearPopupObject() {
    this.confirmationObject.id = null;    
  }

  ngOnDestroy() {
    //Must destroy reaction disposer and Submenu
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.destroy$.next()
    this.destroy$.complete()
    SubMenuItemStore.searchText = '';
    changeRequestStore.searchText = '';
    this.filterSubscription.unsubscribe();
    changeRequestStore.unsetChangeRequest()
    RightSidebarLayoutStore.showFilter = false;
    this.deleteEventSubscription.unsubscribe();
    this._rightSidebarFilterService.resetFilter();
  }

}