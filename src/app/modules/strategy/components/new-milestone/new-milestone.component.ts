import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { InitiativeStore } from '../../initiative.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-new-milestone',
  templateUrl: './new-milestone.component.html',
  styleUrls: ['./new-milestone.component.scss']
})
export class NewMilestoneComponent implements OnInit {
  @Input('source') milestoneSource: any;
  @ViewChild('actionPlanModal', {static: true}) actionPlanModal: ElementRef;
  @ViewChild('otherResponsibleUsers', {static: true}) otherResponsibleUsers: ElementRef;

  StrategyInitiativeStore = StrategyInitiativeStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  AppStore = AppStore

  form: FormGroup;
  formErrors: any;

  otherResponsibleUsersObject = {
    type: null,
    value: null
  }
  actionPlanObject = {
    type: null,
    value: null
  }
  
  mileStoneModalSubscription: any;
  otherResponsibleUsersSubscription: any;
  actionPlanArray: any[] = [];
  constructor(private _eventEmitterService: EventEmitterService, private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _initiativeService : InitiativeService,
    private _renderer2: Renderer2,private _imageService: ImageServiceService,
    private _datePipe : DatePipe,


    ) { }

  ngOnInit(): void {

    this.mileStoneModalSubscription = this._eventEmitterService.actionPlanModal.subscribe(res=>{
      this.closeactionPlanModal();
    });
    this.otherResponsibleUsersSubscription = this._eventEmitterService.otherResponsibleUserModal.subscribe(res=>{
      this.closeResponsibleUsersModal();
    })
    this.form = this._formBuilder.group({
      id: [''],
      strategy_initiative_id:[null],
      title: ['',[Validators.required]],
      description : '',
      start_date : ['',[Validators.required]],
      end_date : ['',[Validators.required]],
      budget : ['',[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    })  
    if(this.milestoneSource.type == "Edit"){
      this.setDataForEdit();    
    }else{
        this.setMileStoneDates()
      }
    // this.setActionPlans()
  }
  setActionPlans(){
    this.actionPlanArray = []
    if(StrategyInitiativeStore.actionPlans.length >0){
      StrategyInitiativeStore.actionPlans.map(data=>{
        this.actionPlanArray.push(data)
      })
    }
  }

  setDataForEdit(){
    if(this.milestoneSource.value){
      this.form.patchValue({
      id : this.milestoneSource.value.id,
      title : this.milestoneSource.value.title,
      description: this.milestoneSource.value.description,
      start_date:this.milestoneSource.value.start_date ? this._helperService.processDate(this.milestoneSource.value.start_date,'split') : [],
      end_date:this.milestoneSource.value.end_date ? this._helperService.processDate(this.milestoneSource.value.end_date,'split') : [],
      budget:this.milestoneSource.value.budget,
      })

    }
  }

  getPopupDetails(user,is_created_by:boolean = false){
    let userDetailObject: any = {};
    if(user){
      userDetailObject['first_name'] = user.first_name ? user.first_name : user.name ? user.name : '';
      userDetailObject['last_name'] = user.last_name;
      userDetailObject['designation'] = user.designation_title? user.designation_title: user.designation ? user.designation.title : null;
      userDetailObject['image_token'] = user.image_token ? user.image_token : user.image?.token ? user.image?.token : null;
      userDetailObject['email'] = user.email ? user.email: null;
      userDetailObject['mobile'] = user.mobile ? user.mobile: null;
      userDetailObject['id'] = user.id;
      userDetailObject['department'] = typeof(user.department) == 'string' ? user.department : user.designation ? user.designation.title : null;
      userDetailObject['status_id'] = user.status_id ? user.status_id : 1;
      if(is_created_by) userDetailObject['created_at'] = new Date();
      return userDetailObject;
    }
  }
  
  setActionPlandata(){
    let plans = [];
    if(StrategyInitiativeStore.actionPlans.length > 0){
      for(let data of StrategyInitiativeStore.actionPlans){
        let obj = {
          id : data.id,
          is_new : data.is_new ? data.is_new : 1,
          is_deleted :data.is_deleted ?  data.is_deleted : 2,
          title : data.title,
          description : data.description,
          start_date : data.start_date,
          end_date : data.end_date,
          target : data.target,
          target_unit_id : data.target_unit_id,
          responsible_user_ids : this._helperService.getArrayProcessed(data.responsible_users,'id')
        }
        if(data.is_deleted == 1){
          delete obj.is_new
        }
        plans.push(obj)
      }
    }
    return plans
  }
  

  processData(){
    let saveData = {
      strategy_initiative_id : StrategyInitiativeStore.selectedInitiativeId,
      title: this.form.value.title ? this.form.value.title : '',
      description : this.form.value.description ? this.form.value.description : '',
      start_date : this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date,'join') : '',
      end_date : this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date,'join') : '',
      budget : this.form.value.budget ? this.form.value.budget : '',
      // strategy_initiative_milestone_action_plans : this.setActionPlandata().length > 0 ? this.setActionPlandata() :  []
    }
    return saveData
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  } 

  save(close :  boolean =  false){

    AppStore.enableLoading()

    let save 
    AppStore.enableLoading();
    if(this.milestoneSource.type == "Edit"){
      save = this._initiativeService.updateMileston(this.processData(),this.form.value.id)
    }else{
      save = this._initiativeService.saveMileston(this.processData())
    }
    save.subscribe(res=>{
      this.resetForm();
      AppStore.disableLoading();
      this.actionPlanArray = [];
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if(close) this.cancel();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
         this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    });
  }

  cancel(){
    AppStore.disableLoading()
    this._eventEmitterService.dismissMileStoneModal();
  }

  
  resetForm() {
    this.form.reset();
    StrategyInitiativeStore._actionPlans = [];
  }


  openActionPlanModal(){
    this.actionPlanObject.type = 'Add';
    this.openActionPlan()

  }

  
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  openActionPlan(){
    StrategyInitiativeStore.selectedEndDate = this.form.value.end_date;
    StrategyInitiativeStore.selectedStrartDate = this.form.value.start_date;
    // $(this.milestoneModal.nativeElement).modal('show');
    this._renderer2.addClass(this.actionPlanModal.nativeElement,'show');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'display','block');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement,'z-index',99999);
  }

  closeactionPlanModal(){
    this.setActionPlans()
    setTimeout(() => {
      // $(this.actionPlanModal.nativeElement).modal('hide');
      this.actionPlanObject.type = null;
      this.actionPlanObject.value = null;
      this._renderer2.removeClass(this.actionPlanModal.nativeElement,'show');
      this._renderer2.setStyle(this.actionPlanModal.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  editActionPlan(plan){
    this.actionPlanObject.value = plan;
    this.actionPlanObject.type = "Edit";
    this.openActionPlan()

  }

  endDateChange(event){
    StrategyInitiativeStore.selectedEndDate = event
  }

  startDateChange(event){
    StrategyInitiativeStore.selectedStrartDate = event
  }


  setMileStoneDates(){
    let date = new Date(this._helperService.processDate(StrategyInitiativeStore.mileStoneEndDate,'join')) 
     let newDate = new Date(date) 
     newDate.setDate(date.getDate() + 1)
    if(StrategyInitiativeStore.milesstones.length > 0){
      this.form.patchValue({
        start_date : this._helperService.processDate(this._datePipe.transform(newDate,"yyyy-MM-dd"),'split')  
      })
    }
    this._utilityService.detectChanges(this._cdr);
  }


  deletePlan(plans,num){
    var pos = this.actionPlanArray.findIndex(e => e.title == plans.title);
    if (pos != -1)
    this.actionPlanArray.splice(pos, 1);

  for(let data of StrategyInitiativeStore.actionPlans){
      if(plans.title == data.title && data.id){
        data.is_deleted = 1
      }else if(plans.title == data.title && !data.id){
        var pos = StrategyInitiativeStore.actionPlans.findIndex(e => e.title == plans.title);
       if (pos != -1)
        StrategyInitiativeStore.actionPlans.splice(pos, 1);
      }
    }
  }

  responsibleOthers(users){
    let item = users.slice(0,3)
  return item
 }

 
 openResponsibleUsersModal(users){
  this.otherResponsibleUsersObject.type = 'Add';
  this.otherResponsibleUsersObject.value = users
  this.openResponsibleUsers()
}
openResponsibleUsers(){
  // $(this.milestoneModal.nativeElement).modal('show');
  this._renderer2.addClass(this.otherResponsibleUsers.nativeElement,'show');
  this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'display','block');
  this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'z-index',99999);
}

closeResponsibleUsersModal(){
  setTimeout(() => {
    // $(this.otherResponsibleUsers.nativeElement).modal('hide');
    this.otherResponsibleUsersObject.type = null;
    this.otherResponsibleUsersObject.value = null;
    this._renderer2.removeClass(this.otherResponsibleUsers.nativeElement,'show');
    this._renderer2.setStyle(this.otherResponsibleUsers.nativeElement,'display','none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }, 200);
}

  ngOnDestroy(){
    this.mileStoneModalSubscription.unsubscribe();
    StrategyInitiativeStore._actionPlans = []
    this.otherResponsibleUsersSubscription.unsubscribe();

  }

}
