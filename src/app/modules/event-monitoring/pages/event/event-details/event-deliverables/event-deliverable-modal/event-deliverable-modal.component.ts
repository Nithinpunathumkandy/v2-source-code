import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit , Input , ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventDeliverableService } from 'src/app/core/services/event-monitoring/event-deliverable/event-deliverable.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DeliverableMasterStore } from 'src/app/stores/event-monitoring/events/event-deliverable-store';

@Component({
  selector: 'app-event-deliverable-modal',
  templateUrl: './event-deliverable-modal.component.html',
  styleUrls: ['./event-deliverable-modal.component.scss']
})



export class EventDeliverableModalComponent implements OnInit {

  form: FormGroup;
  formErrors: any;
  AppStore = AppStore ;
  DeliverableMasterStore = DeliverableMasterStore;
  selectedId: any = null;
  Loaded = false

  @Input('source') DeliverableSource: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _eventDeliverableService: EventDeliverableService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {

    
    //console.log(this.DeliverableSource)

    this.form = this._formBuilder.group({

      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      actual_deliverables: [''],
      closure_comments: [''],
      
    });  

    if(this.DeliverableSource.type=='Edit' || this.DeliverableSource.type=='Edit from closure'){
      this.setFormValues();
    }
  }

  processSaveData() {
    let saveData = {
      title : this.form.value.title ? this.form.value.title : null,
      description : this.form.value.description ? this.form.value.description : null,
      actual_deliverables : this.form.value.actual_deliverables ? this.form.value.actual_deliverables : null,
      closure_comments : this.form.value.closure_comments ? this.form.value.closure_comments : null,
    }
    
    return saveData;
  }

  save(close: boolean = false) {

			
		
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();



      if (this.form.value.id || this.DeliverableSource.type == "Edit" || this.DeliverableSource.type == "Edit from closure") {
        let id = this.selectedId ? this.selectedId : this.DeliverableSource.values.id
        save = this._eventDeliverableService.updateItem(id, this.processSaveData());
      } else {
        save = this._eventDeliverableService.saveDeliverable(this.processSaveData());
      }
      save.subscribe((res: any) => {
        if (this.DeliverableSource.type == "Add") {
          this.resetForm();
        }
        AppStore.disableLoading();

        setTimeout(() => {
          if (close) {this.closeFormModal()};
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        // if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      })
    }

    
    
  }

  closeFormModal() {

    this.resetForm();
    this._eventEmitterService.dismissEventDeliverableModal();

  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }


  setFormValues() {
    if (this.DeliverableSource.values) {
      let { title, description, id,  actual_deliverables, closure_comments } = this.DeliverableSource.values
      console.log(this.DeliverableSource.values)
      this.form.patchValue({
        title: title,
        description: description,
        id: id,
        actual_deliverables : actual_deliverables,
        closure_comments : closure_comments,
      })
      

    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }



  cancel(){
    this._eventEmitterService.dismissEventDeliverableModal();
   }

}
