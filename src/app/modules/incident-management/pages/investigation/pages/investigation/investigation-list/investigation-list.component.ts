import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { InvestigationService } from 'src/app/core/services/incident-management/investigation/investigation.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ShareItemStore } from 'src/app/stores/general/share-item.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;


@Component({
  selector: 'app-investigation-list',
  templateUrl: './investigation-list.component.html',
  styleUrls: ['./investigation-list.component.scss']
})
export class InvestigationListComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  IncidentInvestigationStore = IncidentInvestigationStore;
  AuthStore = AuthStore
  AppStore = AppStore
  mailConfirmationData = 'investigation_share_message';


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  popupControlEventSubscription: any;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  constructor(private _investigationService : InvestigationService, private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef, private _imageService:ImageServiceService,
              private _eventEmitterService: EventEmitterService,  private _router: Router,
              private _helperService: HelperServiceService, private _renderer2: Renderer2
    ) { }

  ngOnInit(): void {
    // SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    NoDataItemStore.setNoDataItems({title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'INCIDENT_INVESTIGATION_LIST', submenuItem: {type: 'search'}},
        {activityName:null, submenuItem: {type: 'refresh'}},
        {activityName: 'GENERATE_INVESTIGATION_INCIDENT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_INVESTIGATION_INCIDENT', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'SHARE_INCIDENT_INVESTIGATION', submenuItem: {type: 'share'}}
      ]
    
      this._helperService.checkSubMenuItemPermissions(1900, subMenuItems);
      if(NoDataItemStore.clikedNoDataItem){
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
         
          case "template":
             this._investigationService.generateTemplate();
            break;
          case "export_to_excel":
             this._investigationService.exportToExcel();
            break;
            case "share":
              // this._investigationService.exportToExcel();
              ShareItemStore.setTitle('share_incident_investigation');
              ShareItemStore.formErrors = {};
             break;
          case "search":
            IncidentInvestigationStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
            case "refresh":
              IncidentInvestigationStore.loaded = false;
              IncidentInvestigationStore.searchText = null;
              this.pageChange(1);
              break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(ShareItemStore.shareData){
        this._investigationService.shareData(ShareItemStore.shareData).subscribe(res=>{
            ShareItemStore.unsetShareData();
            ShareItemStore.setTitle('');
            ShareItemStore.unsetData();
            $('.modal-backdrop').remove();
            document.body.classList.remove('modal-open');
            setTimeout(() => {
              $(this.mailConfirmationPopup.nativeElement).modal('show');              
            }, 200);
        },(error)=>{
          if (error.status == 422){
            ShareItemStore.processFormErrors(error.error.errors);
          }
          ShareItemStore.unsetShareData();
          this._utilityService.detectChanges(this._cdr);
          $('.modal-backdrop').remove();
        
        });
      }
    }); 

    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange();
    
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }


  pageChange(newPage: number = null) {
    if (newPage) IncidentInvestigationStore.setCurrentPage(newPage);
    this._investigationService.getAllinvestigation().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }
    // Returns default image
    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

       // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Investigation?';
    this.popupObject.subtitle = 'delete_investigation';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');

  }

    // for popup object clearing
    clearPopupObject() {
      this.popupObject.id = null;
      this.popupObject.title = '';
      this.popupObject.subtitle = '';
      this.popupObject.type = '';
  
    }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteIncident(status)
        break;
    }

  }

  // delete function call
  deleteIncident(status: boolean) {
    if (status && this.popupObject.id) {
      this._investigationService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  gotoInvestigationDetails(investigation) {
    IncidentInvestigationStore.unsetInvestigationDetails();
    IncidentInvestigationStore.setSelectedInvestigationId(investigation.id);
    IncidentStore.setSelectedIncidentId(investigation.incident_id)
    this._router.navigateByUrl('/incident-management/incident-investigations/'+ investigation.id)
    this._utilityService.detectChanges(this._cdr);

  }
  sortTitle(type: string) {
    this._investigationService.sortInvestigationList(type, SubMenuItemStore.searchText);
    this.pageChange()
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    IncidentStore.searchText=null;
    SubMenuItemStore.searchText = '';
    this.popupControlEventSubscription.unsubscribe();
  }

}
