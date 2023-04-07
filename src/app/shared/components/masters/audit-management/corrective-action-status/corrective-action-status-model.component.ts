import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { CorrectiveActionStatusService } from 'src/app/core/services/masters/audit-management/corrective-action-status/corrective-action-status.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';



@Component({
  selector: 'app-corrective-action-status-model',
  templateUrl: './corrective-action-status-model.component.html',
  styleUrls: ['./corrective-action-status-model.component.scss']
})
export class CorrectiveActionStatusModel implements OnInit {

  @Input('source') CorrectiveActionSource: any;
  AppStore = AppStore;
  formErrors: any;
  form: FormGroup;

  color: any;

  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _correctiveActionStatusService: CorrectiveActionStatusService,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      title:[''],
      color_code:[''],
      label:[''],
    });
    //this.title=this.CorrectiveActionSource.values.title
    this.setFormValues();
  }   
  setFormValues(){
    if (this.CorrectiveActionSource.hasOwnProperty('values') && this.CorrectiveActionSource.values) {
      
      this.form.patchValue({
        title:this.CorrectiveActionSource.values.title,
        color_code:this.CorrectiveActionSource.values.color_code,
        label:this.CorrectiveActionSource.values.label
      })
      this.color = this.CorrectiveActionSource.values.color_code;
    }
  }
  resetForm() {
    this.color = '';
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr);
  }

  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      this.form.patchValue({
        color_code:this.color ? this.color : ''
      })
      save = this._correctiveActionStatusService.updateItem(this.CorrectiveActionSource.values.id, this.form.value);
 
      save.subscribe((res: any) => {
        if(!this.CorrectiveActionSource.values.type){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if(err.status == 500 || err.status == 403){
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
         
      });
    }
    }
  

  // cancel modal
  cancel() {
    this.closeFormModal();
  }

    // for closing the modal
    closeFormModal() {      
      this.resetForm();
      this._eventEmitterService.dissmissCorrectiveActionStatus();
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
