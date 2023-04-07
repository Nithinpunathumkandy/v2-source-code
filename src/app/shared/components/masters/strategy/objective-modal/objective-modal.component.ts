import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { FocusAreaService } from 'src/app/core/services/masters/strategy/focus-area/focus-area.service';
import { ObjectiveService } from 'src/app/core/services/masters/strategy/objective/objective.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { FocusAreaMasterStore } from 'src/app/stores/masters/strategy/focus-area-master-store';
import { ObjectiveMasterStore } from 'src/app/stores/masters/strategy/objective.store';

@Component({
  selector: 'app-objective-modal',
  templateUrl: './objective-modal.component.html',
  styleUrls: ['./objective-modal.component.scss']
})
export class ObjectiveModalComponent implements OnInit {
  @Input('categoryId') incidentCategoryId: number;
  @Input('source') ObjectiveSource: any;
  focus_area_id:number;
  AppStore = AppStore;
  UsersStore = UsersStore;
  ObjectiveMasterStore = ObjectiveMasterStore;
  FocusAreaMasterStore = FocusAreaMasterStore
  form: FormGroup;
  formErrors: any;
  incidentCatId: number = null;
  constructor(
    private _formBuilder:FormBuilder,
    private _eventEmitterService:EventEmitterService,
    private _objectiveService:ObjectiveService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _focusAreaService : FocusAreaService
  ) { }

  ngOnInit(): void {

    
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required]],
      focus_area_id: ['']
    });


    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.ObjectiveSource) {
      this.setFormValues();
    }
  }

  ngDoCheck(){
    if (this.ObjectiveSource && this.ObjectiveSource.hasOwnProperty('values') && this.ObjectiveSource.values && !this.form.value.id)
      this.setFormValues();
    if(typeof(this.ObjectiveSource) == 'number' && !this.form.value.focus_area_id){
      this.form.patchValue({focus_area_id: this.ObjectiveSource});
      this.searchFocusArea({term: this.ObjectiveSource});
    }
    
  }

  setFormValues(){
    if (this.ObjectiveSource.hasOwnProperty('values') && this.ObjectiveSource.values) {
      let { id, title, focus_area_id } = this.ObjectiveSource.values
      this.form.setValue({
        id: id,
        title: title,
        focus_area_id: focus_area_id
      })
    }
  }

  getFocusArea() {
    this._focusAreaService.getItems(false).subscribe(res => {
    this._utilityService.detectChanges(this._cdr);
  })
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
    this._eventEmitterService.dismissObjectiveModalControl();
  }

  // for save
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._objectiveService.updateItem(this.form.value.id, this.form.value);
      } else {
        delete this.form.value.id
        save = this._objectiveService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {
        ObjectiveMasterStore.setLastInsertedId(res.id);
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

  searchFocusArea(e){
    this._focusAreaService.getItems(false,'&q='+e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
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
