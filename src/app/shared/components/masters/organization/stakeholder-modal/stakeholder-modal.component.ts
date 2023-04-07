import { Component, OnInit, Input, ChangeDetectorRef, ChangeDetectionStrategy, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from "@angular/router";
import { AppStore } from 'src/app/stores/app.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { StakeholdersListService } from 'src/app/core/services/organization/stakeholder/stakeholders-list/stakeholders-list.service';
import { StakeholderTypeMasterStore } from 'src/app/stores/masters/organization/stakeholder-type-master.store';
import { StakeholderTypeService } from 'src/app/core/services/masters/organization/stakeholder-type/stakeholder-type.service';
import { IssueListService } from "src/app/core/services/organization/context/issue-list/issue-list.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stakeholder-modal',
  templateUrl: './stakeholder-modal.component.html',
  styleUrls: ['./stakeholder-modal.component.scss']
})
export class StakeholderModalComponent implements OnInit {
  @Input('source') StakeHolderSource: any;

  form: FormGroup;
  reactionDisposer: IReactionDisposer;
  StakeholderTypeMasterStore=StakeholderTypeMasterStore;
  formErrors: any;
  AppStore = AppStore;

  constructor(private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _router: Router,
    private _helperService: HelperServiceService,
    private _formBuilder: FormBuilder,
    private _stakeholderTypeService: StakeholderTypeService,
    private _stakeholderService: StakeholdersListService,
    private _eventEmitterService: EventEmitterService, private _issueListService: IssueListService) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      stakeholder_type_id: ['',[Validators.required]],
      monitoring_method: [''],
    });

        // restingForm on initial load
     this.resetForm();

     // for opening stakeholderType

     this.getStakeholderype();

     // Checking if Source has Values and Setting Form Value

  if (this.StakeHolderSource) {
    this.setFormValues();
  }

  }

  ngDoCheck(){
    if (this.StakeHolderSource && this.StakeHolderSource.hasOwnProperty('values') && this.StakeHolderSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues(){
    if (this.StakeHolderSource.hasOwnProperty('values') && this.StakeHolderSource.values) {
      let { id, title ,stakeholder_type_id,monitoring_method} = this.StakeHolderSource.values
      this.form.setValue({
        id: id,
        title: title,
        stakeholder_type_id: stakeholder_type_id,
        monitoring_method: monitoring_method
      })
      this.selectStakeHolderType(stakeholder_type_id);
    }
  }

  getStakeholderype(){
    this._stakeholderTypeService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
    
  }

  selectStakeHolderType(id: number){
    this.form.patchValue({
      stakeholder_type_id : id
    })
    // this.form.value.stakeholder_type_id = id;
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

searchStakeholderType(e){
  this._stakeholderTypeService.getItems(false,'&q='+e.term).subscribe(res=>{
    this._utilityService.detectChanges(this._cdr);
  })


}

// for closing the modal
closeFormModal(){
  this.resetForm();
  this._eventEmitterService.dismissStakeHolderModal();
 
}
// getting description count

getDescriptionLength(){
  var regex = /(<([^>]+)>)/ig;
  var result = this.form.value.description.replace(regex,"");
  return result.length;
}

   save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.valid) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._stakeholderService.updateItem(this.form.value.id, this.form.value);
      } else {
        save = this._stakeholderService.saveItem(this.form.value,true);
      }
      save.subscribe((res: any) => {
        if(this._router.url.indexOf('new-issue') != -1 || this._router.url.indexOf('edit-issue') != -1 )this._issueListService.setStakeHolderType(StakeholderTypeMasterStore.getTypeById(this.form.value.stakeholder_type_id));
        AppStore.disableLoading();
        if(!this.form.value.id)
        this.resetForm();
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
