import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TaskPrioritiesService } from 'src/app/core/services/masters/project-management/task-priorities/task-priorities.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-task-priorities-modal',
  templateUrl: './task-priorities-modal.component.html'
})
export class ProjectTaskPrioritiesModalComponent implements OnInit {

  @Input('source') TaskPriorities: any;

  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  Savebutton:boolean = false;
  SaveClosebutton:boolean = false;
  CancelButton:boolean = false;
  
        constructor(private _eventEmitterService: EventEmitterService,
          private formBuilder: FormBuilder,
          private _cdr: ChangeDetectorRef,
          private _utilityService: UtilityService,
          private _helperService: HelperServiceService,
          private _taskPrioritiesService: TaskPrioritiesService) { }

        ngOnInit(): void {

          this.form = this.formBuilder.group({
            id: [''],
            title: ['', Validators.required],
            description: ['']
          })

          this.resetForm();
          if (this.TaskPriorities) {
            this.setFormValues();
          }
        }

        closeFormModal() {
          this.CancelButton = true;
          this.resetForm();
          this._eventEmitterService.dismissTaskPrioritiesControlModal();
          this.CancelButton = false;
        }

        resetForm() {
          this.form.reset();
          this.form.pristine;
          this.formErrors = null;
          AppStore.disableLoading();
        }

        setFormValues(){
          if(this.TaskPriorities.hasOwnProperty('values') && this.TaskPriorities.values){
            let {id,title,description} = this.TaskPriorities.values
            this.form.setValue({
              id:id,
              title:title,
              description:description
            })
          }
        }

        ngDoCheck(){
          if (this.TaskPriorities && this.TaskPriorities.hasOwnProperty('values') && this.TaskPriorities.values && !this.form.value.id)
            this.setFormValues();
        }

        Save(close:boolean = false){
    
          this.formErrors = null;
          if (this.form.value) {
            let save;
            AppStore.enableLoading();
      
            this.SaveClosebutton = close ? true:false ;
            this.Savebutton = close ? false:true ;
      
            if (this.form.value.id) {
              save = this._taskPrioritiesService.updateItem(this.form.value.id, this.form.value);
            } else {
              save = this._taskPrioritiesService.saveItem(this.form.value);
            }
            save.subscribe((res: any) =>{
              if(!this.form.value.id){
                this.resetForm();
              }
              AppStore.disableLoading();
      
              this.Savebutton = false;
              this.SaveClosebutton = false;
      
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
            })
          }
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
