import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { DesignationService } from 'src/app/core/services/masters/human-capital/designation/designation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DesignationMasterStore } from 'src/app/stores/masters/human-capital/designation-master.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { DesignationLevelService } from "src/app/core/services/masters/human-capital/designation-level/designation-level.service";
import { DesignationLevelMasterStore } from "src/app/stores/masters/human-capital/designation-level-master.store";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-designation-modal',
  templateUrl: './designation-modal.component.html',
  styleUrls: ['./designation-modal.component.scss']
})
export class DesignationModalComponent implements OnInit {
  @Input('source') CompetencySource: any;

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  DesignationMasterStore = DesignationMasterStore;
  DesignationLevelMasterStore = DesignationLevelMasterStore;
  designationListCurrentPage = null;
  allDesignations: any;
  constructor(private _formBuilder: FormBuilder,
    private _utilityService: UtilityService,
    private _designationService: DesignationService, 
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService: EventEmitterService,
    private _designationLevelService: DesignationLevelService) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      code:['', [Validators.required]],
      previous_designation_id:[''],
      designation_level_id:['']
    });
    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value

    if (this.CompetencySource) {
      this.allDesignations = [];
      this.setFormValues();
    }
    // this.getDesignations();
  }

  ngDoCheck(){
    if (this.CompetencySource && this.CompetencySource.hasOwnProperty('values') && this.CompetencySource.values && !this.form.value.id){
      this.allDesignations = [];
      // this.getDesignations();
      this.setFormValues();
      this.getDesignations();
      this.getDesignationLevels();
    }
    if(!this.designationListCurrentPage)
      this.designationListCurrentPage = JSON.stringify(DesignationMasterStore.currentPage);
  }

  setFormValues(){
    if (this.CompetencySource.hasOwnProperty('values') && this.CompetencySource.values) {
      let { id, title,code,previous_designation_id, designation_level_id } = this.CompetencySource.values
      this.form.setValue({
        id: id,
        title: title,
        code: code,
        previous_designation_id: previous_designation_id ? previous_designation_id : null,
        designation_level_id: designation_level_id ? designation_level_id : null
      })
      if(this.form.value.previous_designation_id) this.searchDesignations({term: this.form.value.previous_designation_id});
      if(this.form.value.designation_level_id) this.searchDesignationLevels({term: this.form.value.designation_level_id});
    }
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

  // getting description count
  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.form.value.description.replace(regex, "");
    return result.length;
  }

  searchDesignations(e){
    // DesignationMasterStore.currentPage = 1;
    this._designationService.getItems(true,'q=' + e.term).subscribe((res) => {
      this.allDesignations = res;
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDesignations(){
    // DesignationMasterStore.currentPage = 1;
    this._designationService.getItems(true,null,false).subscribe(res => {
      this.allDesignations = res;
      this._utilityService.detectChanges(this._cdr);
    })
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


  // for closing the modal
  closeFormModal() {
    this.resetForm();
    DesignationMasterStore.currentPage = JSON.parse(this.designationListCurrentPage);
    if(this._helperService.checkMasterUrl()) this._designationService.getItems(false,null,true).subscribe();
    else this._designationService.getItems().subscribe();
    this._eventEmitterService.dismissHumanCapitalDesignationControlModal();
    this._eventEmitterService.setModalStyle();
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._designationService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._designationService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        if (!this.form.value.id) {
          this.resetForm();
        }
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
