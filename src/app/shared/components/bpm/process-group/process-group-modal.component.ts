import { Component, OnInit, ChangeDetectorRef, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { HttpErrorResponse } from '@angular/common/http';

import { AppStore } from 'src/app/stores/app.store';

import { ProcessGroupsMasterStore } from "src/app/stores/masters/bpm/process-groups-master.store";
import { ProcessGroupsService } from "src/app/core/services/masters/bpm/process-groups/process-groups.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-process-group-modal',
  templateUrl: './process-group-modal.component.html',
  styleUrls: ['./process-group-modal.component.scss']
})
export class ProcessGroupModalComponent implements OnInit {

  @Input ('source') ProcessGroupSource:any;
  processGroupForm:FormGroup;
  processGrpFormErros:any;
  AppStore = AppStore;
  ProcessGroupsMasterStore = ProcessGroupsMasterStore;

  constructor(private _utilityService: UtilityService,
    private _helperService: HelperServiceService, private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder, public _processGroupService: ProcessGroupsService,
    private _eventEmitterService: EventEmitterService) { }

    ngOnInit(): void {

      // Form Object to add Control Category
  
      this.processGroupForm=this._formBuilder.group({
        id: [''],
        title: ['', [Validators.required, Validators.maxLength(255)]],
        description: ['']
      })

      this.resetForm();
  
      // Checking if Source has Values and Setting Form Value
      if (this.ProcessGroupSource) {
        if(this.ProcessGroupSource.hasOwnProperty('values') && this.ProcessGroupSource.values){
  
          let {id,title,description}=this.ProcessGroupSource.values
    
          this.processGroupForm.setValue({
            id: id,
            title: title,
            description:description
          })
        }
      }
  
    
  
  
    }
  
    saveProcessGroup(close:boolean=false){
      this.processGrpFormErros=null;
      if(this.processGroupForm.value){
        let save
        AppStore.enableLoading();
  
        if (this.processGroupForm.value.id) {
          save = this._processGroupService.updateItem(this.processGroupForm.value.id, this.processGroupForm.value);
        } else {
          // Deleting ID before POST
          delete this.processGroupForm.value.id
          save = this._processGroupService.saveItem(this.processGroupForm.value);
        }
        save.subscribe((res: any) => {
          if(!this.processGroupForm.value.id){
            this.resetForm();}
          AppStore.disableLoading();
          setTimeout(() => {
            this._utilityService.detectChanges(this._cdr);
          }, 500);
          if (close) this.closeFormModal();
        }, (err: HttpErrorResponse) => {
          if (err.status == 422) {
            this.processGrpFormErros = err.error.errors;}
            else if(err.status == 500 || err.status == 403){
              this.closeFormModal();
            }
            AppStore.disableLoading();
            this._utilityService.detectChanges(this._cdr);
          
        });
      }
    }
  
    cancel(){
      this.closeFormModal();
    }
  
  
    resetForm(){
      this.processGroupForm.reset();
      this.processGroupForm.pristine;
      this.processGrpFormErros = null;
      AppStore.disableLoading();
    }
  
    closeFormModal() {
      this.resetForm();
      this._eventEmitterService.dismissProcessGroupModal()
    }

    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {

      if(event.key == 'Escape' || event.code == 'Escape'){     
  
          this.closeFormModal();
  
      }
  
    }

     //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
