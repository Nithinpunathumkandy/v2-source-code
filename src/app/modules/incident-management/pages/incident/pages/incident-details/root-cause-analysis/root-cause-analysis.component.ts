import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { IncidentService } from 'src/app/core/services/incident-management/incident/incident.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-root-cause-analysis',
  templateUrl: './root-cause-analysis.component.html',
  styleUrls: ['./root-cause-analysis.component.scss']
})
export class RootCauseAnalysisComponent implements OnInit {
  @ViewChild('rootCause') rootCause:ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  reactionDisposer: IReactionDisposer;

  rootCauseObject= {
    type: null
  };
  AppStore = AppStore;
  AuthStore = AuthStore;
  IncidentStore = IncidentStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  addRootCauseSubscription: any;
  rootCauseCategorySubscriptionEvent: any;
  rootCauseSubCategorySubscriptionEvent: any;
  networkFailureSubscription: any;
	idleTimeoutSubscription: any;
  popupControlRiskEventSubscription: any;
  editOrAdd: string = "add";
  why: number;
  lastItem:any;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  constructor(private _incidentServices : IncidentService, private _renderer2: Renderer2,
              private _utilityService: UtilityService, private  _cdr: ChangeDetectorRef,
              private  _eventEmitterService: EventEmitterService,     private _humanCapitalService: HumanCapitalService,
              private _imageService: ImageServiceService, private _helperService: HelperServiceService,
              ) { }

  ngOnInit(): void {
    this.getRootCauseAnalysis()
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    this.reactionDisposer = autorun(() => {
      if(NoDataItemStore.clikedNoDataItem){
        IncidentStore.clearDocumentDetails();
        this.addRootCause();
       NoDataItemStore.unSetClickedNoDataItem();
     }
    })
    if(IncidentInvestigationStore.investigationItemDetails?.incident_investigation_status?.type == 'approved'){
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_root_cause'});
    }else{
      NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: '', buttonText: ''});
    }

    SubMenuItemStore.setSubMenuItems([
      { type: 'close', path: '../incidents' }

    ]);

    this.addRootCauseSubscription = this._eventEmitterService.incidentRootCauseAddModalControl.subscribe(element=>{
      this.closeRootCause()
    })

    this.popupControlRiskEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteRCA(item);
    })
    
      // for closing the modal
      this.rootCauseCategorySubscriptionEvent = this._eventEmitterService.rootCauseCategoryControl.subscribe(res => {
       this._renderer2.setStyle(this.rootCause.nativeElement, 'z-index', 999999);
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
			if(!status){
			  this.changeZIndex();
			}
		  })
		  this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
			if(!status){
			  this.changeZIndex();
			}
		  })
      
    // for closing the modal
    this.rootCauseSubCategorySubscriptionEvent = this._eventEmitterService.rootCauseSubCategoryControl.subscribe(res => {
       this._renderer2.setStyle(this.rootCause.nativeElement, 'z-index', 999999);
    })
  }

  getRootCauseAnalysis(){
    this._incidentServices.rootCauseAnalysis().subscribe((res)=>{ 
      // this.setWhyValue() 
      let lastWhy = res['data'].length - 1;
      if(lastWhy != -1) this.lastItem = res['data'][lastWhy].why;
      this._utilityService.detectChanges(this._cdr)
    })

    
  }

  // delete function call
  deleteRCA(status: boolean) {
    if (status && this.popupObject.id) {
      this._incidentServices.deleteRCA(this.popupObject.id).subscribe(res=>{
        this.getRootCauseAnalysis();
        this._utilityService.detectChanges(this._cdr);
      });
    } 
    setTimeout(() => {
      ($(this.confirmationPopUp.nativeElement) as any).modal('hide');
    }, 250);
  }

  delete(id:number){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete RCA?';
    this.popupObject.subtitle = 'delete_rca_sub_title';
    ($(this.confirmationPopUp.nativeElement) as any).modal('show');
  }
  
  setWhyValue(){
    this.why = IncidentStore.rootCauseTotalCount + 1;
    this._utilityService.detectChanges(this._cdr);

  }

  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  changeZIndex(){
		if($(this.rootCause.nativeElement).hasClass('show')){
		  this._renderer2.setStyle(this.rootCause.nativeElement,'z-index',999999);
		  this._renderer2.setStyle(this.rootCause.nativeElement,'overflow','auto');
		}
	  }

  addRootCause(){
    this.rootCauseObject.type ='Add';
   
  
      setTimeout(() => {
        $('.modal-backdrop').add();
        document.body.classList.add('modal-open')
          this._renderer2.setStyle(this.rootCause.nativeElement, 'display', 'block');
          // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
          this._renderer2.removeAttribute(this.rootCause.nativeElement, 'aria-hidden');
        this._renderer2.addClass(this.rootCause.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
  }

  closeRootCause() {
    this.rootCauseObject.type = null;
    this.editOrAdd = "add"
    IncidentStore.rootCauseDetails = null;
    this._renderer2.removeClass(this.rootCause.nativeElement, 'show');
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.rootCause.nativeElement, 'display', 'none');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    this._renderer2.setAttribute(this.rootCause.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();
    this.getRootCauseAnalysis()
    this._utilityService.detectChanges(this._cdr)

  
    // setTimeout(() => {
    //   this._renderer2.removeClass(this.rootCause.nativeElement, 'show')
    //   this._utilityService.detectChanges(this._cdr)
    // }, 200);
  
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy(){
      // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.addRootCauseSubscription.unsubscribe();
      this.networkFailureSubscription.unsubscribe();
    	this.idleTimeoutSubscription.unsubscribe();
      this.popupControlRiskEventSubscription.unsubscribe();
      this.rootCauseSubCategorySubscriptionEvent.unsubscribe();
  }

  editRootCause(rootCause){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.editOrAdd = "edit"
    IncidentStore.setRootCauseDetails(rootCause);
    this._utilityService.detectChanges(this._cdr)
    this.addRootCause()

  }

}
