import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Renderer2, } from "@angular/core";
import { SubMenuItemStore } from "src/app/stores/general/sub-menu-item.store";
import { AppStore } from "src/app/stores/app.store";
import { IReactionDisposer, autorun } from "mobx";
import { UtilityService } from "src/app/shared/services/utility.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpErrorResponse, HttpEvent, HttpEventType } from "@angular/common/http";
import { NeedExpectationService } from 'src/app/core/services/bpm/process/need&expecation/need-expectation.service'
import { NeedExpectationStore } from 'src/app/stores/bpm/process/need-exp.store';
import { StakeholderService } from "src/app/core/services/masters/organization/stakeholder/stakeholder.service";
import { StakeholdersStore } from "src/app/stores/organization/stakeholders/stakeholders.store";
import { StakeholderTypeService } from "src/app/core/services/masters/organization/stakeholder-type/stakeholder-type.service";
import { StakeholderTypeMasterStore } from "src/app/stores/masters/organization/stakeholder-type-master.store";
import { NeedsandexpectationsService } from "src/app/core/services/masters/organization/needsandexpectations/needsandexpectations.service";
import { NeedsExpectationsResponse } from 'src/app/core/models/masters/organization/needs-expectations';
import { NeedsExpectationsStore } from "src/app/stores/masters/organization/needs-expectations.store";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store'
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { AuthStore } from 'src/app/stores/auth.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';

declare var $: any;

@Component({
  selector: 'app-need-expectaion',
  templateUrl: './need-expectaion.component.html',
  styleUrls: ['./need-expectaion.component.scss']
})
export class NeedExpectaionComponent implements OnInit {

  @ViewChild('formModal') formModal: ElementRef;
  @ViewChild('deletePopup') deletePopup: ElementRef;
  @ViewChild('needsExpectationsFormModal') needsExpectationsFormModal: ElementRef;
  @ViewChild('stakeholderFormModal') stakeholderFormModal: ElementRef;

  AppStore = AppStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  // New Created
  NeedExpectationStore = NeedExpectationStore;
  StakeholderMasterStore = StakeholdersStore;
  StakeholderTypeMasterStore = StakeholderTypeMasterStore;
  NeedsExpectationsStore = NeedsExpectationsStore;
  ProcessStore = ProcessStore;
  AuthStore= AuthStore;
  
  subscription: any;
  form: FormGroup;
  formErrors: any;
  selectedStakeHolder: any = null;
  needsAndExpectation: any = null;
  need_expt_ids: any = [];
  needsVerification: any = [];
  editCheck: boolean = false;
  saveData: any = null;
  emptyData: boolean = false;
  
  deleteObject = {
    title: "",
    id: null,
    subtitle: "",
    type:"Delete"
  };

  deleteEventSubscription: any;
  stakeHolderTypeSubscription: any;
  idleTimeoutSubscription: any;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _stakeholderService: StakeholderService,
    private _stakeholdertypeService: StakeholderTypeService,
    private _renderer2: Renderer2,
    private _needExptService: NeedExpectationService,
    private _formBuilder: FormBuilder,
    private _needsExpectationsService: NeedsandexpectationsService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "need_and_expectation_nodata_title", subtitle: 'need_and_expectation_nodata_subtitle',buttonText: 'add_new_need_and_expectation'});
    AppStore.showDiscussion = false;
    this.setIntialStakeHolderType()
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_PROCESS_STAKEHOLDER', submenuItem: { type: 'new_modal' } },
        {activityName: null, submenuItem: {type: 'close', path: "../"}},
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_PROCESS_STAKEHOLDER')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if (SubMenuItemStore.clikedSubMenuItem) {

        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.resetForm()

              this.formErrors = null;
              this._utilityService.detectChanges(this._cdr);
              this.openFormModal();
            }, 1000);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.openFormModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setNoUserTab(true);


    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'new_modal' },
    //   { type: "close", path: "../" },
    // ]);
    //Event Subscription for handling modal output events
    this.subscription = this._eventEmitterService.modalChange.subscribe(item=>{
      var modalNumber: number = item;
      switch(modalNumber){
        case 5: this.closeStakeholderModal();
          break;
        case 6: this.closeNeedsExpectations();
          break;
      }
      this._utilityService.detectChanges(this._cdr);
    })

    this.stakeHolderTypeSubscription = this._eventEmitterService.stakeHolderType.subscribe(stakeHolderTypeId => {
      
     this.selectStakeHolderType(StakeholderTypeMasterStore.getTypeById(stakeHolderTypeId),true);
      
    })

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(
      (item) => {
        this.deleteActivity(item);
      }
    );

    this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
      if(!status){
        if($(this.formModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
        } 
        if($(this.needsExpectationsFormModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.needsExpectationsFormModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.needsExpectationsFormModal.nativeElement,'overflow','auto');
        }  
        if($(this.stakeholderFormModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.stakeholderFormModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.stakeholderFormModal.nativeElement,'overflow','auto');
        }  
      }
    })


    // this.getAllData();

    this.form = this._formBuilder.group({
      id:[''],
      // stakeholder_id: [''],
      // need_and_expectation_ids: ['']
      stakeholders: ['']
    });



    // this._needExptService.getAllItems().subscribe()
    this.getNeedExp();
    this.getNeedExpectation(1);
  }

  getNeedExpectation(newpage: number) {
    if (newpage) NeedExpectationStore.setCurrentPage(newpage);
    this._needExptService.getAllItems().subscribe(() => {

      if (NeedExpectationStore.loaded && NeedExpectationStore.needExptList.length > 0) {
        this.getNeedExptDetails(NeedExpectationStore.needExptList[0].id, 0,);

      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  // Gets initial data to be displayed in form elements
  getAllData(){
    NeedExpectationStore.selectedStakeHolderType = null;
    NeedExpectationStore.selectedNeedsExpectations = [];

    this._needsExpectationsService.getItems().subscribe(res => {
      
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 1000);
    });

  }

  getNeedExp() {
    this._needExptService.getAllItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
    /**
   * form for adding  or editing document
   */
    openFormModal() {
    this.formErrors = null;
    AppStore.disableLoading();
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 250);
  }

  setIntialStakeHolderType(editFlag: boolean = false, data?) {

    // To Set Intial StakeHolder Type When Loading the Form

    if (!editFlag) {
      this._stakeholdertypeService.getAllItems().subscribe(res => {
        this.selectStakeHolderType(res[0]);
      });
    } else {
      
      this.selectStakeHolderType(data)

    }
 
  }

    /**closing the document form */
    closeFormModal() {
      this.resetForm()
      $(this.formModal.nativeElement).modal('hide');
  
      AppStore.disableLoading();
  }

  resetForm() {
    this.form.reset();
    this.form.markAsPristine();
    this.need_expt_ids = [];
    NeedExpectationStore.selectedNeedsExpectations = [];
    this.editCheck = false;
    this.needsAndExpectation = null;
    this.selectedStakeHolder = null;
    this.setIntialStakeHolderType()

  }

  // Opens Modal to add New Stakeholder
  addStakeholder(){
    NeedExpectationStore.stakeholder_form_modal = true;
    $(this.stakeholderFormModal.nativeElement).modal('show');
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Close Modal to add New Stakeholder.
   * If new stakeholder created, search for stakeholder by id and patches the form
   */
  closeStakeholderModal(){
    // this.selectStakeHolderType(this.getSelectedStakeholderType(),true);
    setTimeout(() => {
      NeedExpectationStore.stakeholder_form_modal = false;
      $(this.stakeholderFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }


  selectStakeHolderType(stype, patchValue: boolean = false) {

    this.selectedStakeHolder = null;

    // if (!this.editCheck) {
    //   this.need_expt_ids = [];
    //   this.selectedStakeHolder = null;
    //   NeedExpectationStore.selectedNeedsExpectations=[]
    // }

    this._needExptService.setStakeHolderType(stype);
    this._stakeholderService.getItems(false,'&stakeholder_type_ids='+stype.id)
    .subscribe(res=>{
      if(patchValue) this.selectedStakeHolder = this.StakeholderMasterStore.lastInsertedId;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  

  verifyItems(stakeHolderId) { 


    this.needsVerification = []
    this._needExptService.getItemById(stakeHolderId).subscribe(res => {

      let stakeHolderDetails = res['data'];
      stakeHolderDetails.forEach(element => {
          this.needsVerification.push(element.need_and_expectation_id)
      });

    })

  }



  // / Adds Needs and Expectations to the list
  addNeedsExpectations() {

    this.emptyData = false;
    var itemPresent = false;

  
    if (this.needsVerification.length > 0) {
      
      if (this.needsVerification.includes(this.needsAndExpectation)) {
        itemPresent = true;
        this._utilityService.showErrorMessage('Item Present','Sorry Item already added');
        this.needsAndExpectation = null;
        this._utilityService.detectChanges(this._cdr);
      }

    }

    
    
    // if (this.needsVerification.includes(this.needsAndExpectation)) {
    //   this._utilityService.showErrorMessage("Error!","Item Already Added")
    //     verified=true
    // } else {
    //   verified=false
    // }
    // if (!verified) {
    //   var result = this._needExptService.addNeedsandExpectations(this._needsExpectationsService.getNeedsAndExpectationsById(this.needsAndExpectation), this._stakeholderService.getStakeHolderDetailsById(this.selectedStakeHolder));
    // if (result)
    //  this.need_expt_ids.push(this.needsAndExpectation)
    // else
    // this._utilityService.showErrorMessage("Error!","Item Already Added")
    //   this._utilityService.detectChanges(this._cdr);
    // }
    if (!itemPresent) {
    var result = this._needExptService.addNeedsandExpectations(this._needsExpectationsService.getNeedsAndExpectationsById(this.needsAndExpectation), this._stakeholderService.getStakeHolderDetailsById(this.selectedStakeHolder));
    if (NeedExpectationStore.selectedNeedsExpectations) {
      this.form.patchValue({
        stakeholders:NeedExpectationStore.selectedNeedsExpectations
      })
    }
    if(!result)
      this._utilityService.showErrorMessage('Item Present','Sorry Item already added');
    this.needsAndExpectation = null;
      this._utilityService.detectChanges(this._cdr);
    }

  }

  /**
   * To handle accordion list of Needs and Expectation Display
   * @param position Position of Needs & Expectation Array
   */
  showhideNeedsExpectations(position) {
    this._needExptService.showOrHideNeedsExpectations(position);
    this._utilityService.detectChanges(this._cdr);
  }

  // Returns Selected Stakeholder Type
  getSelectedStakeholderType(){
    return this._needExptService.getStakeHolderType();
  }

  
   /**
   * Search Stakeholder
   * @param e e.term - character to search
   */
  searchStakeHolder(e){
    this._stakeholderService.getItems(false,'&stakeholder_type_ids='+this._needExptService.getStakeHolderType().id+'&q='+e.term)
    .subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // Get Stakeholders
  getStakeHolder(){
    this.selectStakeHolderType(this._needExptService.getStakeHolderType());
  }

  // Get Needs and Expectations
  getNeedsAndExpectations(){
    this._needsExpectationsService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    });
  }

   /**
   * Search Needs and Expectations
   * @param e e.term - character to search
   * @param patchValue boolean value - to patch form value
   */
  searchNeedsAndExpectations(e,patchValue:boolean = false){
    this._needsExpectationsService.getItems('&q='+e.term).subscribe((res: NeedsExpectationsResponse)=>{
      if(res.data.length > 0 && patchValue){
        for(let i of res.data){
          if(i.id == e.term){
            this.needsAndExpectation = i.id
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  addNeedsExpectation() {
    NeedExpectationStore.needs_expectation_form_modal = true;
    this._renderer2.setStyle(this.formModal.nativeElement,'z-index','99999');
    $(this.needsExpectationsFormModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);
  }

  /**
   * Close Modal to add Needs and Expectations.
   * If new Needs and Expectations is created, search for Needs and Expectations by id and patches the form
   */
  closeNeedsExpectations(){
    NeedExpectationStore.needs_expectation_form_modal = false;
    if(NeedsExpectationsStore.lastInsertedId){
      this.searchNeedsAndExpectations({term: NeedsExpectationsStore.lastInsertedId},true);
    }
    setTimeout(() => {
      $(this.needsExpectationsFormModal.nativeElement).modal('hide');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }
  save(close: boolean = false) {
    this.formErrors = null;
    let save;
    AppStore.enableLoading();
    if (this.form.value.id) {
      this.createStakeholderSaveData('Update')
      save = this._needExptService.updateItem(ProcessStore.process_id,this.form.value.id, this.saveData);
    } else {
      this.createStakeholderSaveData('Save')
      save = this._needExptService.saveItem(ProcessStore.process_id,this.saveData);
    }
    save.subscribe((res: any) => {
      this.resetForm()
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      this.form.reset();
      
      setTimeout(() => {

        if (close) {
          this.closeFormModal();
          this.form.reset();
        }
      }, 300);
    }, (err: HttpErrorResponse) => {
           AppStore.disableLoading();
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        }       
    });
  }

  createStakeholderSaveData(type) {

    this.saveData = {
      "stakeholders":[]
    }


    if (type == 'Update') {
      if(this.NeedExpectationStore.selectedNeedsExpectations && this.NeedExpectationStore.selectedNeedsExpectations.length > 0){
        for(let i of this.NeedExpectationStore.selectedNeedsExpectations){
          let st = { "stakeholder_id":i.stakeholder,
            "need_and_expectation_ids":i.values };
          this.saveData.stakeholders.push(st);
        }
      }
      

    }
    else {

      if(this.form.value.stakeholders && this.form.value.stakeholders.length > 0){
        for(let i of this.form.value.stakeholders){
          let st = { "stakeholder_id":i.stakeholder,
            "need_and_expectation_ids":i.values };
          this.saveData.stakeholders.push(st);
        }
      }
      else {
        this.emptyData = true;
        this.saveData.stakeholders = [];
      }


    }
  }

  delete(id: number) {
    this.deleteObject.id = id;
    this.deleteObject.title = "Delete Stakeholder?";
    this.deleteObject.subtitle = "This action cannot be undone";

    $(this.deletePopup.nativeElement).modal("show");
  }

  /**
   * Delete Control
   * @param id -Control id
   */
  deleteActivity(status) {
    if (status) {
      this._needExptService
        .delete(ProcessStore.process_id, this.deleteObject.id)
        .subscribe((resp) => {
          this.getNeedExp();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          this.clearDeleteObject();
        });
    } else {
      this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal("hide");
    }, 250);
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    this.deleteObject.title = "";
    this.deleteObject.subtitle = "";
  }

  editStakeholder(id) {
    NeedExpectationStore.selectedNeedsExpectations=[]
    this.need_expt_ids = [];
    NeedExpectationStore.Editflag = true;
    this.form.reset();
    this.form.markAsPristine();
    this.editCheck = true
    this.formErrors = null;

    this._needExptService.getItemById(id).subscribe((res) => {
      setTimeout(() => {
        let stakeHolderDetails = res['data'];

        let stype = {
          id:stakeHolderDetails[0].stakeholder_type_id,
          title:stakeHolderDetails[0].stakeholder_type_title
        }
        this.setIntialStakeHolderType(true, stype)
        // stakeHolderDetails.forEach(element => {
        //   this.need_expt_ids.push(element.need_and_expectation_id)
        // });


        let obj = { stakeholder: stakeHolderDetails[0].stakeholder_id, 
          stakeholder_title: stakeHolderDetails[0].stakeholder_title, 
          values: this.getValues(stakeHolderDetails,'values'),
          needs_title:this.getValues(stakeHolderDetails,'needs'),
          type : stakeHolderDetails[0].stakeholder_type_title,
          active: true
        };

     
    
        this.selectedStakeHolder = stakeHolderDetails[0].stakeholder_id

        NeedExpectationStore.selectedNeedsExpectations.push(obj)
        this

        this.form.patchValue({
          id:stakeHolderDetails[0].stakeholder_id,
          // stakeholder_id: stakeHolderDetails[0].stakeholder_id,
        });

        this._utilityService.detectChanges(this._cdr);
        this.openFormModal();
      }, 300);

     
    });
  }
  
  deleteNeedExpectaion(indexOfName, Name, data) {

    
    let needsId=data.values[indexOfName]
    let needsTitle = Name;

    NeedExpectationStore.selectedNeedsExpectations.forEach(data => {

      data.needs_title.forEach(title => { 
        if (title == needsTitle)
          data.needs_title.pop(needsTitle)
      });
      data.values.forEach(Id => {
        if (Id == needsId)
        data.values.pop(needsId)
      });

      if (!(data.needs_title.length > 0) && !(data.values.length > 0)) {
        this.emptyData = true;
      }
    })

    // if (this.need_expt_ids.includes(needsId)) {
    //   this.need_expt_ids.pop(needsId)
    // }
    
  }

  getValues(data,type) {
    
    let values = []
    let needs_title=[]
    
    data.forEach(element => {
      values.push(element.need_and_expectation_id)
      needs_title.push(element.need_and_expectation_title)
    });

    if(type=='values')
      return values
    else
      return needs_title

  }


  stakeSwitch(e) {
    this.needsVerification = []
    this.needsAndExpectation = null
    this.need_expt_ids = []
    NeedExpectationStore.selectedNeedsExpectations=[]
    this._needExptService.getItemById(e).subscribe(res => {

      let stakeHolderDetails = res['data'];

      stakeHolderDetails.forEach(element => {
          this.needsVerification.push(element.need_and_expectation_id)
      });

    })

  }
  
    // Function to Dynamicallly Set Class to Accordion List

  getNeedExptDetails(id: number, index: number, initial: boolean = false) {
    NeedExpectationStore.unsetNeedExpDetails()
      
      for (let i = 0;i < NeedExpectationStore.needExptList.length;i++) {
        if ((NeedExpectationStore.needExptList[i].is_accordion_active ==false &&i == index) ||initial) {
          this._needExptService.getItemById(id).subscribe((res) => {
            this._utilityService.detectChanges(this._cdr);
          });
          break;
        }
      }
      this.NeedExpectationStore.setNeedExpAccordion(index);
      this._utilityService.detectChanges(this._cdr);
  }
  
  // Single Need and Expectation Delete

  singleDelete(processId, needsId) {
    this._needExptService.singleNeedsDelete(processId, needsId).subscribe(res => {
        this._utilityService.detectChanges(this._cdr)
      })
    }
  
    ngOnDestroy() {
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
      this.deleteEventSubscription.unsubscribe();
      this.stakeHolderTypeSubscription.unsubscribe();
      this.idleTimeoutSubscription.unsubscribe();
    }


}
