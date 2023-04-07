import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, ChangeDetectionStrategy, OnDestroy, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NeedsandexpectationsService } from 'src/app/core/services/masters/organization/needsandexpectations/needsandexpectations.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-add-needs-expectation',
  templateUrl: './add-needs-expectation.component.html',
  styleUrls: ['./add-needs-expectation.component.scss']
})
export class AddNeedsExpectationComponent implements OnInit {

  @Input('source') NeedExpectationSource: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  constructor(private _formBuilder: FormBuilder,
    private _needsExpectationsService: NeedsandexpectationsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService) { }

    ngOnInit(): void {
      this.form = this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required, Validators.maxLength(255)]]
      });


      this.resetForm();


  // Checking if Source has Values and Setting Form Value

  if (this.NeedExpectationSource) {
    if (this.NeedExpectationSource.hasOwnProperty('values') && this.NeedExpectationSource.values) {

      let { id, title  } = this.NeedExpectationSource.values

      this.form.setValue({
        id: id,
        title: title
      })
    }
  }

    }
  
    save(close: boolean = false) {
      this.formErrors = null;
      if (this.form.valid) {
        let save;
        AppStore.enableLoading();
        if (this.form.value.id) {
          save = this._needsExpectationsService.updateItem(this.form.value.id, this.form.value);
        } else {
          save = this._needsExpectationsService.saveItem(this.form.value,true);
        }
        save.subscribe((res: any) => {
          AppStore.disableLoading();
          if(!this.form.value.id)
            this.resetForm();
          this._utilityService.detectChanges(this._cdr);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.formErrors = err.error.errors;}
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
          
        });
      }
    }
  
    closeFormModal(){
      this._eventEmitterService.dismissNeedsModal();
    }

    cancel(){
      this.closeFormModal();
    }

    resetForm(){
      this.form.setValue({
        id:'',
        title: ''
      });
      this.form.reset();
      this.form.pristine;
      this.formErrors = null;
      AppStore.disableLoading();
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
