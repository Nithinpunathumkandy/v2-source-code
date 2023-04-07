import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild,Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { MaturityModalService } from 'src/app/core/services/business-assessments/maturity-modal/maturity-modal.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { MaturityModalStore } from 'src/app/stores/business-assessments/maturity-modal/maturity-modal-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AppStore } from 'src/app/stores/app.store';
declare var $: any;
@Component({
  selector: 'app-maturity-modal-list',
  templateUrl: './maturity-modal-list.component.html',
  styleUrls: ['./maturity-modal-list.component.scss']
})
export class MaturityModalListComponent implements OnInit,OnDestroy {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  deleteEventSubscription: any;
  deleteObject = {
    id: null,
    type: '',
    subtitle:''
  };
  maturityModalObject = {
    component: 'maturity_modal',
    values: null,
    type: null
  };
  maturityModalSubscriptionEvent: any = null;
  NoDataItemStore=NoDataItemStore;
  MaturityModalStore=MaturityModalStore;
  AuthStore=AuthStore;
  AppStore=AppStore;
  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _router: Router,
    private _renderer2:Renderer2,
    private _imageService:ImageServiceService,
    private _humanCpitalService:HumanCapitalService,
    private _maturityModalService: MaturityModalService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_MATURITY_MODEL', submenuItem: { type: 'new_modal' } },
        { activityName: 'MATURITY_MODEL_LIST', submenuItem: { type: 'refresh' } },
        // { activityName: 'GENERATE_BUSINESS_ASSESSMENT_FRAMEWORK_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_MATURITY_MODEL', submenuItem: { type: 'export_to_excel' } },
        { activityName: 'MATURITY_MODEL_LIST', submenuItem: { type: 'search' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "maturity_modal_nodata_title", subtitle: 'maturity_modal_nodata_subtitle',buttonText: 'add_new_maturity_modal'});
     
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
              this.addNewMaturityModal();
            }, 1000);
            break;
          case "refresh":
            MaturityModalStore.loaded = false;
              this.pageChange(1)
              break;
          case "template":
            this._maturityModalService.generateTemplate();
            break;
          case "export_to_excel":

            this._maturityModalService.exportToExcel();
            break;
          case "search":
            MaturityModalStore.searchText = SubMenuItemStore.searchText;
            this.searchMaturityModalList();
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addNewMaturityModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.pageChange(1)
    this.maturityModalSubscriptionEvent = this._eventEmitterService.maturityModalControl.subscribe(res => {
      this.closeFormModal();
    })
    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.delete(item);
    })

  }

  searchMaturityModalList() {
    MaturityModalStore.setCurrentPage(1);
    this._maturityModalService.getItems(false).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  addNewMaturityModal(){
    this.maturityModalObject.type = 'Add';
    this.maturityModalObject.values=null;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
 
  }

  pageChange(newPage: number = null) {

    if (newPage) MaturityModalStore.setCurrentPage(newPage);
    this._maturityModalService.getItems(false,'status=all').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  gotoDetails(id) {
    MaturityModalStore.setMaturityModalId(id);
    this._router.navigateByUrl('/business-assessments/maturity-models/' + id)
  }

  createImageUrl(type, token) {

    return this._humanCpitalService.getThumbnailPreview(type, token);
  }
  
  
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  closeFormModal() {
    this.pageChange(1);
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('hide');
    }, 100);
    this.maturityModalObject.type = null;
  }

  setMaturityModalSort(type, callList: boolean = true) {
    this._maturityModalService.sortmaturityModalList(type, callList);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.subtitle = '';
  }
  editMaturityModal(id,event)
  {
    event.stopPropagation();
    this._maturityModalService.getItem(id).subscribe(res => {

      this.maturityModalObject.values = {
        id: res['id'],
        title: res['title'],
        description: res['description'],
        option: res['maturity_model_levels']
      }
      this.maturityModalObject.type = 'Edit';

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {
        this.openFormModal();
      }, 100);

    })
  }
  deleteMaturityModal(id,event)
  {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = '';
    this.deleteObject.subtitle = 'delete_maturity_modal_subtitle';

    $(this.deletePopup.nativeElement).modal('show');
  }

  deactivate(id,event) {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.subtitle = 'Are you sure you want to deactivate this maturity model?';
    $(this.deletePopup.nativeElement).modal('show');

  }
  activate(id,event) {
    event.stopPropagation();
    this.deleteObject.id = id;
    this.deleteObject.type = 'Activate';
    this.deleteObject.subtitle = 'Are you sure you want to activate this maturity model?';
    $(this.deletePopup.nativeElement).modal('show');
  }

  delete(status) {
    let type;
    if (status && this.deleteObject.id) {
      switch (this.deleteObject.type) {
        case '': type = this._maturityModalService.delete(this.deleteObject.id);
          break;
        case 'Deactivate': type = this._maturityModalService.deactivate(this.deleteObject.id);
          break;
        case 'Activate': type = this._maturityModalService.activate(this.deleteObject.id);
          break;
      }

      type.subscribe(resp => {
        this.closeConfirmationPopUp();
        this.pageChange(MaturityModalStore.currentPage);
        // setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
        this.clearDeleteObject();
      }, (error => {
        this.closeConfirmationPopUp();
        setTimeout(() => {
          if (error.status == 405) {
            // this.deactivate(this.deleteObject.id);
    
            this._utilityService.detectChanges(this._cdr);
          }
        }, 100);

      }));
    }
    else {
      this.closeConfirmationPopUp();
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
    }, 250);

  }
  closeConfirmationPopUp() {
    // setTimeout(() => {
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
    // }, 250);
  }
  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }
  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    //this.deleteEventSubscription.unsubscribe();
    this.maturityModalSubscriptionEvent.unsubscribe();
    SubMenuItemStore.searchText = '';
    MaturityModalStore.searchText = '';
    MaturityModalStore.unsetMaturityModalDetails();
  }

}
