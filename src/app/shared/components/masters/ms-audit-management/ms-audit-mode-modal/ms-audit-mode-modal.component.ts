import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MsAuditModesService } from 'src/app/core/services/masters/ms-audit-management/ms-audit-modes/ms-audit-modes.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';



@Component({
  selector: 'app-ms-audit-mode-modal',
  templateUrl: './ms-audit-mode-modal.component.html',
  styleUrls: ['./ms-audit-mode-modal.component.scss']
})
export class MsAuditModeModalComponent implements OnInit {

  @Input('source') MsAuditModeSource: any;
  AppStore = AppStore;
  formErrors: any;
  form: FormGroup;

  color: any;
  id:any;
  type:any;

  constructor(private _cdr: ChangeDetectorRef,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _msAuditModeService: MsAuditModesService,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      type:[''],
      color_code:[''],
      label:[''],
    });
    this.type=this.MsAuditModeSource.values.type
    this.setFormValues();
  }   
  setFormValues(){
    if (this.MsAuditModeSource.hasOwnProperty('values') && this.MsAuditModeSource.values) {
      
      this.form.patchValue({
        type:this.MsAuditModeSource.values.type,
        color_code:this.MsAuditModeSource.values.color_code,
        label:this.MsAuditModeSource.values.label
      })
      this.color = this.MsAuditModeSource.values.color_code;
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
      if (this.MsAuditModeSource.values.id) {
        save = this._msAuditModeService.updateItem(this.MsAuditModeSource.values.id, this.form.value);
      }
 
      save.subscribe((res: any) => {
        if(!this.MsAuditModeSource.values.type){
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
      this._eventEmitterService.dissmissAmAuditControlMode();
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
