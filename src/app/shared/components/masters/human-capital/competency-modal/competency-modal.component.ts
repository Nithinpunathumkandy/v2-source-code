import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { CompetencyService } from 'src/app/core/services/masters/human-capital/competency/competency.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CompetencyGroupMasterStore } from 'src/app/stores/masters/human-capital/competency-group-master.store';
import { CompetencyGroupService } from 'src/app/core/services/masters/human-capital/competency-group/competency-group.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CompetencyTypesService } from 'src/app/core/services/masters/human-capital/competency-types/competency-types.service';
import { CompetencyTypesMasterStore } from 'src/app/stores/masters/human-capital/competency-types-master.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-competency-modal',
  templateUrl: './competency-modal.component.html',
  styleUrls: ['./competency-modal.component.scss']
})
export class CompetencyModalComponent implements OnInit {

  @Input('source') CompetencySource: any;
  @Input('CompetencyGroup') CompetencyGroup: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  CompetencyTypesMasterStore = CompetencyTypesMasterStore;
  CompetencyGroupMasterStore = CompetencyGroupMasterStore;

  constructor(private _formBuilder: FormBuilder, private _helperService: HelperServiceService,
    private _competencyService: CompetencyService,
    private _competencyType : CompetencyTypesService,
    private _utilityService: UtilityService,
    private _competencyGroupService: CompetencyGroupService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      competency_group_id: ['', [Validators.required]],
      competency_type_id: ['', [Validators.required]],
      description:['']
    });

         // restingForm on initial load
         this.resetForm();
         this.competencyGroups();

         // Checking if Source has Values and Setting Form Value
      if (this.CompetencySource) {
        this.setFormValues();
      }
      this.setCompetencyGroup();
   
  }

  ngDoCheck(){
    if (this.CompetencySource && this.CompetencySource.hasOwnProperty('values') && 
      this.CompetencySource.values && !this.form.value.id)
        this.setFormValues();
    if (!this.form.value.competency_group_id && this.CompetencyGroup)
      this.setCompetencyGroup();
  }

  setCompetencyGroup() {
    if (this.CompetencyGroup)
    this.setGroup();
  }

  setFormValues(){
    if (this.CompetencySource.hasOwnProperty('values') && this.CompetencySource.values) {
      let { id, title, competency_type_id, competency_group_id,description} = this.CompetencySource.values
      this.form.setValue({
        id: id,
        title: title,
        description: description,
        competency_group_id: competency_group_id ? competency_group_id : null,
        competency_type_id: competency_type_id ? competency_type_id : null
      })
      if(competency_group_id) this.searchCompetencyGroups({term: competency_group_id});
      if(competency_type_id) this.searchCompetency({term: competency_type_id});
    }
  }

  setGroup() {
    this.form.patchValue({
      competency_group_id: this.CompetencyGroup
    })
    this.searchCompetencyGroups({term: this.CompetencyGroup})
  }

  competencyGroups(){
    this._competencyGroupService.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getCompetency(){
    this._competencyType.getItems().subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })

  }

  // seraching

  searchCompetencyGroups(event){
    this._competencyGroupService.getItems(false,'&q='+event.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchCompetency(event){
    this._competencyType.getItems(false,'&q='+event.term).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
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
closeFormModal(){
  this.resetForm();
  this._eventEmitterService.dismissHumanCaptitalCompetencyControlModal();
 
}

save(close: boolean = false) {
  this.formErrors = null;
  if (this.form.value) {
    let save;
    AppStore.enableLoading();

    if (this.form.value.id) {
      save = this._competencyService.updateItem(this.form.value.id, this.form.value);
    } else {
      delete this.form.value.id
      save = this._competencyService.saveItem(this.form.value);
    }

    save.subscribe((res: any) => {
       if(!this.form.value.id){
       this.form.controls['title'].reset();}
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
