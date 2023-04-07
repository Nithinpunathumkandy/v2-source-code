import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UnitService } from 'src/app/core/services/masters/human-capital/unit/unit.service';
import { InitiativeService } from 'src/app/core/services/strategy-management/initiatives/initiative.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { UnitMasterStore } from 'src/app/stores/masters/human-capital/unit-store';
import { StrategyInitiativeStore } from 'src/app/stores/strategy-management/initiative.store';
import { InitiativeStore } from '../../initiative.store';

declare var $: any;

@Component({
  selector: 'app-add-action-plan',
  templateUrl: './add-action-plan.component.html',
  styleUrls: ['./add-action-plan.component.scss']
})
export class AddActionPlanComponent implements OnInit {
  @Input('source') actionPlanSource: any;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  UsersStore = UsersStore
  AppStore = AppStore
  form: FormGroup;
  formErrors: any;
  actionPlanObject = {
    type: null,
    value: null
  }
  unitObject = {
    component: 'Master',
    values: null,
    type: null
  };
  InitiativeStore = InitiativeStore;
  UnitMasterStore = UnitMasterStore
  StrategyInitiativeStore = StrategyInitiativeStore
  isItemExist: boolean = false;
  unitSubscriptionEvent: any;
  constructor(private _eventEmitterService: EventEmitterService, private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _initiativeService : InitiativeService,
    private _renderer2: Renderer2,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
    private _unitService: UnitService,


    ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      is_deleted : null,
      is_new : null,
      strategy_initiative_id:[null],
      title: ['',[Validators.required]],
      description : '',
      start_date : ['',[Validators.required]],
      end_date : ['',[Validators.required]],
      target :  ['',[Validators.required,Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      responsible_user_id : [null,[Validators.required]],
      responsible_user : [null],
      target_unit_id : [null,[Validators.required]],
      minimum: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      maximum: [null,[Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
    })  

      // for closing the modal
      this.unitSubscriptionEvent = this._eventEmitterService.humanCapitalUnitControl.subscribe(res => {
        this.closeFormModal();
      })

    if(this.actionPlanSource.type == "Edit"){
      this.setEditData()
    }
    this.getUsers();
    this.openTargetUnit();
  }

  setEditData(){
    this.form.patchValue({
      is_new : 1,
      is_deleted : 2,
      id : this.actionPlanSource.value.id ? this.actionPlanSource.value.id : null,
      title: this.actionPlanSource.value.title ? this.actionPlanSource.value.title : '',
      description : this.actionPlanSource.value.description ? this.actionPlanSource.value.description : '',
      start_date : this.actionPlanSource.value.start_date ? this._helperService.processDate(this.actionPlanSource.value.start_date,'split') : '',
      end_date : this.actionPlanSource.value.end_date ? this._helperService.processDate(this.actionPlanSource.value.end_date,'split') : '',
      target :  this.actionPlanSource.value.target ? this.actionPlanSource.value.target : '',
      responsible_user_id : this.actionPlanSource.value.responsible_users ? this.getEditValue(this.actionPlanSource.value.responsible_users) : [],
      responsible_user : this.actionPlanSource.value.responsible_users ? this.actionPlanSource.value.responsible_users : [],
     target_unit_id : this.actionPlanSource.value.target_unit_id ? this.actionPlanSource.value.target_unit_id : null,
     minimum: this.actionPlanSource.value?.minimum ? this.actionPlanSource.value?.minimum: '',
      maximum:  this.actionPlanSource.value?.maximum ?  this.actionPlanSource.value?.maximum: '',
    })
    this._utilityService.detectChanges(this._cdr);
  }

  getEditValue(fields) {
    var returnValues = [];
    for (let i of fields) {  
        returnValues.push(i);
    }
    return returnValues;
  }
  processData(){
    let saveData = {
      strategy_initiative_id : StrategyInitiativeStore.selectedInitiativeId,
      is_new : this.form.value.is_new ? this.form.value.is_new : 1,
      is_deleted : this.form.value.is_deleted ? this.form.value.is_deleted : 2,
      id : this.form.value.id ? this.form.value.id : null,
      title: this.form.value.title ? this.form.value.title : '',
      description : this.form.value.description ? this.form.value.description : '',
      start_date : this.form.value.start_date ? this._helperService.processDate(this.form.value.start_date,'join') : '',
      end_date : this.form.value.end_date ? this._helperService.processDate(this.form.value.end_date,'join') : '',
      target :  this.form.value.target ? this.form.value.target : '',
      responsible_user_ids : this.form.value.responsible_user_id ? this._helperService.getArrayProcessed(this.form.value.responsible_user_id,'id') : [],
      responsible_users : this.form.value.responsible_user_id ? this.form.value.responsible_user_id : [],
      target_unit_id : this.form.value.target_unit_id ? this.form.value.target_unit_id : [],
      minimum: this.form.value.minimum ? this.form.value.minimum: '',
      maximum: this.form.value.maximum ? this.form.value.maximum: '',
      strategy_initiative_milestone_id : this.actionPlanSource.milestoneID ? this.actionPlanSource.milestoneID : null
    }
    return saveData
  }

  save(close :  boolean =  false){ 
    AppStore.enableLoading()
    let save 
    if(this.actionPlanSource.type == "Edit")
    save = this._initiativeService.updateActionPlans(this.processData(),this.form.value.id);
    else 
    save = this._initiativeService.saveActionPlans(this.processData());

      save.subscribe(res => {
        this.resetForm();
        StrategyInitiativeStore._actionPlans = [];
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if(close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
           this.cancel();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      })
    // if(this.actionPlanSource.type == "Edit"){
    //   var pos = StrategyInitiativeStore.actionPlans.findIndex(e => e.title == this.actionPlanSource.value.title);
    //   if (pos != -1)
    //   StrategyInitiativeStore.actionPlans.splice(pos, 1);
    //   StrategyInitiativeStore.setActionPlan(this.processData())
    // }else{
    //     if(StrategyInitiativeStore.actionPlans.length > 0){
          
    //         for(let data of  StrategyInitiativeStore.actionPlans){
    //         if(data.title == this.processData().title){
    //           this.isItemExist = true
    //           AppStore.disableLoading();

    //         }else{
    //           StrategyInitiativeStore.setActionPlan(this.processData())
    //           this.isItemExist = false;
    //           break

    //         }
    //       }
    //     }else{
    //       StrategyInitiativeStore.setActionPlan(this.processData())
    //     }
       
    // }
    // if(!this.isItemExist){
    //   this.resetForm();
    //   setTimeout(() => {
    //     AppStore.disableLoading();
    //     this._utilityService.detectChanges(this._cdr);
    //   }, 1000);
    // if(close) this.cancel();
    // } 
  }

  getUsers() {
    let params = ''
    this._usersService.getAllItems(params).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  searchUsers(searchTerm: any) {
    this._usersService.getAllItems('?q='+searchTerm.term).subscribe(res=>{
        this._utilityService.detectChanges(this._cdr);
    });
  }

  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  createImageUrl(type,token){
    return this._imageService.getThumbnailPreview(type,token);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name']+''+item['last_name']+''+item['email']+''+item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      if(search) isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  } 


  cancel(){
    AppStore.disableLoading()
    this._eventEmitterService.dismissActionPlansModal();
  }

  openTargetUnit(){
    this._unitService.getItems(false,null,true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));

  }

  addNewUnitItem(){
    this.unitObject.type = 'Add';
    this.unitObject.values = null; // for clearing the value
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

    // for opening modal
    openFormModal() {

      setTimeout(() => {
        $(this.formModal.nativeElement).modal('show');
      }, 100);
    }
    // for close modal
    closeFormModal() {
      $(this.formModal.nativeElement).modal('hide');
      this.unitObject.type = null;
      this.searchUnit({term : UnitMasterStore.lastInsertedId},true)

    }

    searchUnit(e,patchValue:boolean = false){
      this._unitService.getItems(false, '&q=' + e.term).subscribe((res) => {
        if(patchValue){
          for(let i of res.data){
            if(i.id == e.term){
              this.form.patchValue({ target_unit_id: i });
              break;
            }
          }
          // _incidentDamageTypesService.lastIsertedId = null;
        }
        this._utilityService.detectChanges(this._cdr);
      });
  
    }
  
  resetForm() {
    this.form.reset();
    this.isItemExist = false;
  }
  ngOnDestroy(){
    this.unitSubscriptionEvent.unsubscribe();
  }

}
