import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ControlModeService } from 'src/app/core/services/masters/bpm/control-mode/control-mode.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ControlModeMasterStore } from 'src/app/stores/masters/bpm/control-mode.store';

@Component({
  selector: 'app-control-mode-modal',
  templateUrl: './control-mode-modal.component.html',
  styleUrls: ['./control-mode-modal.component.scss']
})
export class ControlModeModalComponent implements OnInit {
 
  @Input ('source') ControlModeSource:any;
  controlModeForm:FormGroup;
  FormErros:any;
  AppStore = AppStore;
  ControlModeMasterStore = ControlModeMasterStore;

  constructor(private _utilityService: UtilityService,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _controlModeService: ControlModeService,
    private _eventEmitterService: EventEmitterService) { }

  ngOnInit(): void {
    this.controlModeForm=this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
    })

    this.resetForm();

    if (this.ControlModeSource) {
      if(this.ControlModeSource.hasOwnProperty('values') && this.ControlModeSource.values){

        let {id,title}=this.ControlModeSource.values
  
        this.controlModeForm.setValue({
          id: id,
          title: title,
        })
      }
    }

  }

  resetForm(){
    this.controlModeForm.reset();
    this.controlModeForm.pristine;
    this.FormErros = null;
    AppStore.disableLoading();
  }

  closeFormModal() {
   // Emitting Event To set the Style in Parent Component(MODAL)
    this._eventEmitterService.setModalStyle();
    this.resetForm();
    this._eventEmitterService.dismissControlModeModal();
  }

  //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  cancel(){
    this.closeFormModal();
  }

  saveControlMode(close:boolean=false){
    this.FormErros=null;
    if(this.controlModeForm.value){
      let save
      AppStore.enableLoading();

      if (this.controlModeForm.value.id) {
        save = this._controlModeService.updateItem(this.controlModeForm.value.id, this.controlModeForm.value);
      } else {
        // Deleting ID before POST
        delete this.controlModeForm.value.id
        save = this._controlModeService.saveItem(this.controlModeForm.value);
      }
      save.subscribe((res: any) => {
        if(!this.controlModeForm.value.id){
          this.resetForm();}
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.FormErros = err.error.errors;}
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

}
