import { Component, OnInit, Input, ChangeDetectorRef, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';

import { ControlTypesMasterStore } from "src/app/stores/masters/bpm/control-types.master.store";
import { ControlTypesService } from "src/app/core/services/masters/bpm/control-types/control-types.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
@Component({
  selector: 'app-control-types-modal',
  templateUrl: './control-types-modal.component.html',
  styleUrls: ['./control-types-modal.component.scss']
})
export class ControlTypesModalComponent implements OnInit {

  @Input ('source') ControlTypesSource:any;
  controltypesForm:FormGroup;
  controltypesErros:any;
  AppStore = AppStore;
  ControlTypesMasterStore = ControlTypesMasterStore;

  
  constructor(private _utilityService: UtilityService, 
    private _helperService: HelperServiceService,private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _controlTypesService: ControlTypesService,
    private _eventEmitterService: EventEmitterService) { }

    ngOnInit(): void {

      // Form Object to add Control Category
  
      this.controltypesForm=this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required, Validators.maxLength(255)]],
      })
  
      this.resetForm();
  
      // Checking if Source has Values and Setting Form Value

      if (this.ControlTypesSource) {
        if(this.ControlTypesSource.hasOwnProperty('values') && this.ControlTypesSource.values){
  
          let {id,title}=this.ControlTypesSource.values
    
          this.controltypesForm.setValue({
            id: id,
            title: title,
          })
        }
      }
  
 
  
  
    }
  
    saveControlTypes(close:boolean=false){
      this.controltypesErros=null;
      if(this.controltypesForm.value){
        let save
        AppStore.enableLoading();
  
        if (this.controltypesForm.value.id) {
          save = this._controlTypesService.updateItem(this.controltypesForm.value.id, this.controltypesForm.value);
        } else {
          // Deleting ID before POST
          delete this.controltypesForm.value.id
          save = this._controlTypesService.saveItem(this.controltypesForm.value);
        }
        save.subscribe((res: any) => {
          if(!this.controltypesForm.value.id){
            this.resetForm();}
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.controltypesErros = err.error.errors;}
            else if(err.status == 500 || err.status == 403){
              this.closeFormModal();
            }
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
          
        });
      }
    }
  
  cancel() {
      
    this.closeFormModal();
    }
  
  
    resetForm(){
      this.controltypesForm.reset();
      this.controltypesForm.pristine;
      this.controltypesErros = null;
      AppStore.disableLoading();
    }
  
    closeFormModal(){
      this.resetForm();
      this._eventEmitterService.dismissControlTypesModal();
      // Emitting Event To set the Style in Parent Component(MODAL)
      this._eventEmitterService.setModalStyle();
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
