import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectTaskCategoryService } from 'src/app/core/services/masters/project-management/project-task-category/project-task-category.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-project-task-category-modal',
  templateUrl: './project-task-category-modal.component.html',
  styleUrls: ['./project-task-category-modal.component.scss']
})
export class ProjectTaskCategoryModalComponent implements OnInit {

  @Input('source') TaskCategory: any;

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
          private _taskCategoryService: ProjectTaskCategoryService) { }

        ngOnInit(): void {

          this.form = this.formBuilder.group({
            id: [''],
            title: ['', Validators.required],
            description: ['']
          })

          this.resetForm();
          if (this.TaskCategory) {
            this.setFormValues();
          }
        }

        closeFormModal() {
          this.CancelButton = true;
          this.resetForm();
          this._eventEmitterService.dismissTaskCategoryControlModal();
          this.CancelButton = false;
        }

        resetForm() {
          this.form.reset();
          this.form.pristine;
          this.formErrors = null;
          AppStore.disableLoading();
        }

        setFormValues(){
          if(this.TaskCategory.hasOwnProperty('values') && this.TaskCategory.values){
            let {id,title,description} = this.TaskCategory.values
            this.form.setValue({
              id:id,
              title:title,
              description:description
            })
          }
        }

        ngDoCheck(){
          if (this.TaskCategory && this.TaskCategory.hasOwnProperty('values') && this.TaskCategory.values && !this.form.value.id)
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
              save = this._taskCategoryService.updateItem(this.form.value.id, this.form.value);
            } else {
              save = this._taskCategoryService.saveItem(this.form.value);
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
