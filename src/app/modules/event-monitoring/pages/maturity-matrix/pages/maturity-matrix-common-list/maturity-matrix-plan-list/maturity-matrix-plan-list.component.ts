import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { Router } from "@angular/router";
import { MaturityMatrixService } from 'src/app/core/services/event-monitoring/event-maturity-matrix/maturity-matrix.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { AppStore } from 'src/app/stores/app.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MaturityMatrixPlanStore } from 'src/app/stores/event-monitoring/event-maturity-matrix/event-maturity-matrix-plan-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-maturity-matrix-plan-list',
  templateUrl: './maturity-matrix-plan-list.component.html',
  styleUrls: ['./maturity-matrix-plan-list.component.scss']
})
export class MaturityMatrixPlanListComponent implements OnInit {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('matrixPlanModal') matrixPlanModal: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  MaturityMatrixPlanStore=MaturityMatrixPlanStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  reactionDisposer: IReactionDisposer;
  AuthStore = AuthStore;
  AppStore = AppStore;
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  matrixPlan = {
    type: null,
    values: null
  };

  deleteMaturityMatrixPlanSubscription: any;
  matrixPlanSubscription: any = null;
  
  constructor(private _maturityMatrixService: MaturityMatrixService,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _helperService: HelperServiceService,private _imageService:ImageServiceService,
    private _eventEmitterService: EventEmitterService, private _renderer2: Renderer2,
    private _router: Router) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_plan'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'MATURITY_MATRIX_PLAN_LIST', submenuItem: { type: 'search' }},
        {activityName: 'MATURITY_MATRIX_PLAN_LIST', submenuItem: {type: 'refresh'}},
        {activityName: 'CREATE_MATURITY_MATRIX_PLAN', submenuItem: {type: 'new_modal'}},
        // {activityName: 'GENERATE_EVENT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_MATURITY_MATRIX_PLAN_ACTIVITY_LOGS', submenuItem: {type: 'export_to_excel'}},
        //{activityName:null, submenuItem: {type: 'close', path: '../'}}
      ]
      if(AuthStore.userPermissionsLoaded && !AuthStore.getActivityPermission(100,'CREATE_MATURITY_MATRIX_PLAN')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createPlan();
            break;
          case "template":
            this._maturityMatrixService.generatePlanTemplate();
            break;
          case "export_to_excel":
            this._maturityMatrixService.exportPlanToExcel();
            break;
          case "search":
            MaturityMatrixPlanStore.searchText  = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            MaturityMatrixPlanStore.unsetMaturityMatrixPlanList();
            this.pageChange(1)
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.createPlan();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      
    })
    this.deleteMaturityMatrixPlanSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deletePlan(item);
    })
    this.matrixPlanSubscription = this._eventEmitterService.matrixPlanModal.subscribe((res)=>{
      this.closeMatrixPlanModal();
    })

    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) MaturityMatrixPlanStore.setCurrentPage(newPage);
    this._maturityMatrixService.getPlanItems(null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  deletePlan(status){
    if (status && this.popupObject.id) {
      this._maturityMatrixService.deletePlan(this.popupObject.id).subscribe(resp => {
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

  clearPopupObject(){
    this.popupObject.id = null;
  }

  createPlan(){
    //this._router.navigateByUrl('/event-monitoring/events/new');
    setTimeout(() => {
      this.matrixPlan.type = 'Add';
      this.matrixPlan.values = null;
      setTimeout(() => {
        $(this.matrixPlanModal.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'display','block');
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeMatrixPlanModal()
  {
    setTimeout(() => {
      this.matrixPlan.type = null;
      this.matrixPlan.values = null;
     $(this.matrixPlanModal.nativeElement).modal('hide');
     this._renderer2.removeClass(this.matrixPlanModal.nativeElement,'show');
     this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'display','none');
     this._utilityService.detectChanges(this._cdr);
      
    }, 200);
  }

  editPlan(event,id: number){
    event.stopPropagation();
    setTimeout(() => {
      this.matrixPlan.type = 'Edit';
      this.matrixPlan.values = {id:id};
      setTimeout(() => {
        $(this.matrixPlanModal.nativeElement).modal('show');
      }, 100);
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'display','block');
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.matrixPlanModal.nativeElement,'z-index',99999);
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  delete(event,id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'delete_matrix_plan';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  

  sortTitle(type: string) {
    this._maturityMatrixService.sortMatrixPlanList(type);
    this.pageChange();
  }

   //passing token to get preview
   createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  //returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  gotoDetails(id)
  {
    MaturityMatrixPlanStore.selectedPlanId = id;
    // this._eventService.getItem(id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    // this._eventService.getOutcome(id).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
    this._router.navigateByUrl(`/event-monitoring/maturity-matrix/maturity-matrix-plan/${id}`)
  
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.deleteMaturityMatrixPlanSubscription.unsubscribe();
    this.matrixPlanSubscription.unsubscribe();
    MaturityMatrixPlanStore.searchText = '';
    MaturityMatrixPlanStore.unsetMaturityMatrixPlanList();
   
  }

}
