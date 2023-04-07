import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { Designation } from 'src/app/core/models/masters/human-capital/designation';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { CompetencyService } from 'src/app/core/services/masters/human-capital/competency/competency.service';
import { CompetencyMasterStore } from 'src/app/stores/masters/human-capital/competency-master.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { CompetencyGroupMasterStore } from 'src/app/stores/masters/human-capital/competency-group-master.store';
import { CompetencyGroupService } from 'src/app/core/services/masters/human-capital/competency-group/competency-group.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { ShareItemStore } from "src/app/stores/general/share-item.store";
import { ImportItemStore } from "src/app/stores/general/import-item.store";

declare var $: any;

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-designation-master',
  templateUrl: './designation-master.component.html',
  styleUrls: ['./designation-master.component.scss']
})
export class DesignationMasterComponent implements OnInit, OnDestroy {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('detailModal') detailModal: ElementRef;
  @ViewChild('competencyModal') competencyModal: ElementRef;
  @ViewChild('titleInput') titleInput: ElementRef;
  @ViewChild('codeInput') codeInput: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('mailConfirmationPopup') mailConfirmationPopup: ElementRef;

  form: FormGroup;
  submitted: boolean = false;
  designations: Designation[] = [];
  subMenuItems: { id: number, title: string }[];
  formErrors: any;

  AppStore = AppStore;
  SubMenuItemStore = SubMenuItemStore;
  DesignationMasterStore = DesignationMasterStore;
  reactionDisposer: IReactionDisposer;
  displayArray = [];
  CompetencyMasterStore = CompetencyMasterStore;
  CompetencyGroupMasterStore = CompetencyGroupMasterStore;
  AuthStore = AuthStore;
  mailConfirmationData = 'share_designation_message';


  designationObject = {
    component: 'Master',
    values: null,
    type: null
  };

  
  designationCompetencyObject = {
    component: 'Master',
    values: null,
    type: null
  };


  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  competencyGroupObject = {
    component: 'Master',
    values: null,
    type: null
  };


  designationSubscriptionEvent: any = null;
  popupControlDesignationEventSubscription: any;
  noCompetencyMessage = "No Competeny Has Been Added";


  competencyIndex = 0;
  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  designationCompetencySubscriptionEvent:any;

  constructor(
    private _eventEmitterService: EventEmitterService,
    private _formBuilder: FormBuilder,
    private _designationService: DesignationService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _competencyService: CompetencyService,
    private _renderer2: Renderer2,
    private _competencyGroupService: CompetencyGroupService
  ) { }

  ngOnInit() {
    // This will run whenever the store observable or computed which are used in this function changes.
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_designation' });
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        { activityName: 'DESIGNATION_LIST', submenuItem: { type: 'search' } },
        { activityName: 'CREATE_DESIGNATION', submenuItem: { type: 'new_modal' } },
        { activityName: 'GENERATE_DESIGNATION_TEMPLATE', submenuItem: { type: 'template' } },
        { activityName: 'EXPORT_DESIGNATION', submenuItem: { type: 'export_to_excel' } },
        // { activityName: 'DESIGNATION_SHARE', submenuItem: { type: 'share'}},
        {activityName: 'IMPORT_DESIGNATION', submenuItem: {type: 'import'}},
        { activityName: null, submenuItem: { type: 'close', path: 'human-capital' } },
      ]
      if(!AuthStore.getActivityPermission(1100,'CREATE_DESIGNATION')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addNewItem();
            }, 1000);
            break;
          case "template":
            this._designationService.generateTemplate();
            break;
          case "export_to_excel":
            this._designationService.exportToExcel();
            break;
          case "search":
            DesignationMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "share":
            ShareItemStore.setTitle('share_designation_title');
            ShareItemStore.formErrors = {};
            break;
          case "import":
            ImportItemStore.setTitle('import_designation');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.addNewItem();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ShareItemStore.shareData){
        this._designationService.shareData(ShareItemStore.shareData).subscribe(res=>{
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
          console.log(error);
        });
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._designationService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })


    // for deleting/activating/deactivating using delete modal
    this.popupControlDesignationEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    // for closing the modal
    this.designationSubscriptionEvent = this._eventEmitterService.designationControl.subscribe(res => {
      this.closeFormModal();
    })

     this.designationCompetencySubscriptionEvent = this._eventEmitterService.designationDetailControl.subscribe(res => {
      this.closeDetailModal();
    })

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status => {
      if (!status)
        this.processZIndex();
    })

    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status => {
      if (!status)
        this.processZIndex();
    })


    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      code: ['', [Validators.required, Validators.maxLength(255)]],
      order: [''],
      designation_level_id: [''],
      designation_grade_id: [''],
      designation_zone_id: [''],
      competencies: ['']
    });



    DesignationMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }

  addNewItem() {
    this.designationObject.type = 'Add';
    this.designationObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  pageChange(newPage: number = null) {
    if (newPage) DesignationMasterStore.setCurrentPage(newPage);
    this._designationService.getItems(false, null, true)
      .subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }


  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 50);
  }

  processZIndex() {
    if ($(this.formModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.detailModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
    }
    else if ($(this.competencyModal.nativeElement).hasClass('show')) {
      this._renderer2.setStyle(this.competencyModal.nativeElement, 'z-index', 999999);
      this._renderer2.setStyle(this.competencyModal.nativeElement, 'overflow', 'auto');
    }
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');

    this.designationObject.type = null;
  }


  closeDetailModal() {
    this.form.reset();
    this.pageChange();
    this._renderer2.setStyle(this.detailModal.nativeElement, 'display', 'none');
    $('.modal-backdrop').remove();
    // this._renderer2.setStyle(this.detailModal.nativeElement, 'z-index', '9999');
    $(this.detailModal.nativeElement).modal('hide');
    this.designationCompetencyObject.type = null;

  }



  // updateCompetency(item){



  //   this.competencyForm.value.competency_id = item.id

  //   this.competencyArray['competencies'].push({competency_id:this.competencyForm.value.competency_id,required:this.form.value.required})
  // }

  /**
   * Save & update designation
   * @param close  close modal if parameter is true
   */
  /* save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._designationService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._designationService.saveItem(this.form.value);
      }
      save.subscribe((res: any) => {
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
          AppStore.disableLoading();
        }
      });
    }
  }*/



  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteDesignation(status)
        break;

      case 'Activate': this.activateDesignation(status)
        break;

      case 'Deactivate': this.deactivateDesignation(status)
        break;

    }

  }

  // delete function call
  deleteDesignation(status: boolean) {

    if (status && this.popupObject.id) {
      this._designationService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopUp();
        this.clearPopupObject();
      }, (error => {
        if (error.status == 405 && DesignationMasterStore.getDesignationById(this.popupObject.id).status_id == AppStore.activeStatusId) {
          let id = this.popupObject.id;
          this.closeConfirmationPopUp();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivate(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else {
          this.closeConfirmationPopUp();
          this.clearPopupObject();
        }
      })
      );
    }
    else {
      this.closeConfirmationPopUp();
      this.clearPopupObject();
    }

  }

  closeConfirmationPopUp() {
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }


  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
    // this.popupObject.type = '';

  }

  // calling activcate function

  activateDesignation(status: boolean) {
    if (status && this.popupObject.id) {

      this._designationService.activate(this.popupObject.id).subscribe(resp => {
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

  // calling deactivate function

  deactivateDesignation(status: boolean) {
    if (status && this.popupObject.id) {

      this._designationService.deactivate(this.popupObject.id).subscribe(resp => {
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

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Activate';
    this.popupObject.id = id;
    this.popupObject.title = 'Activate  Designation?';
    this.popupObject.subtitle = 'are_you_sure_activate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.popupObject.type = 'Deactivate';
    this.popupObject.id = id;
    this.popupObject.title = 'Deactivate  Designation?';
    this.popupObject.subtitle = 'are_you_sure_deactivate';

    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete  Designation?';
    this.popupObject.subtitle = 'are_you_sure_delete';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }


  /**
   * Get particular designation item
   * @param id  id of designation 
   */
  getDesignation(id: number) {
    this._designationService.getItem(id).subscribe(res => {
      // console.log(res);
      this.designationObject.values = {
        id: res.id,
        title: res.title,
        code: res.code,
        previous_designation_id: res.previous_designation ? res.previous_designation?.id : null,
        designation_level_id: res.designation_level ? res.designation_level?.id : null
      }
      this.designationObject.type = 'Edit';
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
    })
    // const designation: Designation = DesignationMasterStore.getDesignationById(id);
    //set form value
  }


  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
    this.form.reset();
    this.form.markAsPristine();
  }

  viewDesignation(id) {

    // this._designationService.getItem(id).subscribe(res => {
      this.form.patchValue({
        id: id

      });
      this.designationCompetencyObject.values = {
        designation_id: id,
        // competencies: this.form.value.competencies,
        
      }
      this.competencyIndex = 0;
      this.getCompetency();
      this.designationCompetencyObject.type = 'View';
      this._renderer2.setStyle(this.detailModal.nativeElement, 'display', 'block');
      // this._renderer2.setStyle(this.detailModal.nativeElement, 'z-index', '99999');
      // this._renderer2.setStyle(this.detailModal.nativeElement, 'overflow', 'auto');
      $(this.detailModal.nativeElement).modal('show');
    // })
  }


  getIndex() {
    this.competencyIndex = this.competencyIndex + 1;
  }


  // addCompetency() {
  //   this.displayArray = [];
  //   this._designationService.getCompetencies(this.form.value.id).subscribe((res) => {
  //     for (let i of res) {
  //       for (let j of i.competencies) {
  //         console.log(j);
  //         this.displayArray.push({
  //           competency: j, required: j.required
  //         })
  //       }
  //     }
  //     this._utilityService.detectChanges(this._cdr);
  //   });
  //   this.getCompetencies();
  //   this.getCompetencyGroups();
  //   this.addCompetencyFlag = true;
  //   setTimeout(() => {
  //     this._renderer2.setStyle(this.competencyModal.nativeElement, 'z-index', '99999');
  //     this._renderer2.setStyle(this.competencyModal.nativeElement, 'overflow', 'auto');
  //     $(this.competencyModal.nativeElement).modal('show');
  //   }, 200);

  // }

  getCompetency() {

    this._designationService.getCompetencies(this.form.value.id).subscribe((res) => {

      this._utilityService.detectChanges(this._cdr);
    });
  }





  getArrayFormatedString(type, items) {
    return this._helperService.getArraySeperatedString(',', type, items);
  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.designationSubscriptionEvent.unsubscribe();
    this.popupControlDesignationEventSubscription.unsubscribe();
    DesignationMasterStore.searchText = '';
    DesignationMasterStore.currentPage = 1 ;
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
  }

  sortTitle(type) {
    let order = null;
    DesignationMasterStore.orderItem = type;
    if (DesignationMasterStore.orderBy == null || DesignationMasterStore.orderBy == 'desc') {
      order = 'asc';
    }
    else {
      order = 'desc';
    }
    DesignationMasterStore.setOrderBy(order);
    this.pageChange();
  }
}
