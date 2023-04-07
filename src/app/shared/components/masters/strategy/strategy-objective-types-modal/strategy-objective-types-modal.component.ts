import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DesignationLevelService } from 'src/app/core/services/masters/human-capital/designation-level/designation-level.service';
import { StrategyObjectiveTypeService } from 'src/app/core/services/masters/strategy/strategy-objective-type/strategy-objective-type.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DesignationLevelMasterStore } from 'src/app/stores/masters/human-capital/designation-level-master.store';
import { StrategyObjectiveTypeMasterStore } from 'src/app/stores/masters/strategy/strategy-objective-type-store';

@Component({
  selector: 'app-strategy-objective-types-modal',
  templateUrl: './strategy-objective-types-modal.component.html',
  styleUrls: ['./strategy-objective-types-modal.component.scss']
})
export class StrategyObjectiveTypesModalComponent implements OnInit {

  @Input('source') source: any;
  AppStore = AppStore;
  DesignationLevelMasterStore = DesignationLevelMasterStore;
  StrategyObjectiveTypeMasterStore = StrategyObjectiveTypeMasterStore;
  form: FormGroup;
  formErrors: any;

  constructor( private _formBuilder: FormBuilder, private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,  private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _strategicObjectiveTypeService : StrategyObjectiveTypeService,
    private _designationLevelService: DesignationLevelService,
    // private _strategyObjectiveTypeService:StrategyObjectiveTypeService,
    ) { }

  ngOnInit(): void {

    // Form Object to add Control Category

  this.form = this._formBuilder.group({
    id: [''],
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    designation_level_id:[''],
    child_objective_type_id:[[]]
  });

  this.resetForm();


  // Checking if Source has Values and Setting Form Value

  if (this.source) {
    this.setFormValues();
  }


  }

  ngDoCheck(){
    if (this.source && this.source.hasOwnProperty('values') && this.source.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.source.hasOwnProperty('values') && this.source.values) {
      let { id, title, description,designation_level_id,child_objective_type } = this.source.values
      this.form.setValue({
        id: id,
        title: title,
        description: description,
        designation_level_id: designation_level_id ? designation_level_id : null,
        child_objective_type_id: child_objective_type ? this.getData(child_objective_type) : []
      })
    }
  }

  getData(value, user?) {
    let data = [];
    for(let i of value) {
      if (user)
      data.push(user == 'user' ? i.user : i.id);
      else
      data.push(i);
    }
    return data;
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();
  
  
  }
  
  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissExternalAuditTypesModal();
  }
  
  searchDesignationLevels(e){
    // DesignationMasterStore.currentPage = 1;
    this._designationLevelService.getItems(false,'q=' + e.term).subscribe((res) => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDesignationLevels(){
    // DesignationMasterStore.currentPage = 1;
    this._designationLevelService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  // function for add & update
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
  
      if (this.form.value.id) {
        save = this._strategicObjectiveTypeService.updateItem(this.form.value.id, this.processForDataSave());
      } else {
        delete this.form.value.id
        save = this._strategicObjectiveTypeService.saveItem(this.processForDataSave());
      }
  
      save.subscribe((res: any) => {
         if(!this.form.value.id){
         this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;}
          else if(err.status == 500 || err.status == 403){
            this.closeFormModal();
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
    }
   }

processForDataSave(){
  let saveData = {
    title: this.form.value.title ? this.form.value.title : '',
    description: this.form.value?.description ? this.form.value?.description : '',
    designation_level_id : this.form.value.designation_level_id ? this.form.value.designation_level_id.id : null,
    child_objective_type_id: this.form.value.child_objective_type_id ? this.getData(this.form.value.child_objective_type_id,'id') : [],
  };
  return saveData;
}

searchObjectiveType(e,patchValue:boolean = false){
  this._strategicObjectiveTypeService.getItems(false, '&q=' + e.term).subscribe((res) => {
    if(patchValue){
      for(let i of res.data){
        if(i.id == e.term){
          this.form.patchValue({ child_objective_type_id: i });
          break;
        }
      }
    }
    this._utilityService.detectChanges(this._cdr);
  });
}

openObjectiveType(){
  this._strategicObjectiveTypeService.getAllItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
}

@HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

  if(event.key == 'Escape' || event.code == 'Escape'){     

      this.cancel();

  }

}


//getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  
}
