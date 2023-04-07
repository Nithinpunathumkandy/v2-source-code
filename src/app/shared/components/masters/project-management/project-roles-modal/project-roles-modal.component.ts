import { ChangeDetectorRef, Component, HostListener, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ProjectRolesService } from 'src/app/core/services/masters/project-management/project-roles/project-roles.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-project-roles-modal',
  templateUrl: './project-roles-modal.component.html',
  styleUrls: ['./project-roles-modal.component.scss']
})
export class ProjectRolesModalComponent implements OnInit {
  @Input('source') ProjectRolesTypeSource: any;

  AppStore=AppStore;
  form:FormGroup;
  formErrors:any;

  constructor( private _eventEmitterService: EventEmitterService,
    private _projectRolesService:ProjectRolesService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    
    this.form = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]]  
    });

    this.resetForm();
   
    if (this.ProjectRolesTypeSource) {

      this.setFormValues();
    }

  }

  setFormValues(){
    if (this.ProjectRolesTypeSource.hasOwnProperty('values') && this.ProjectRolesTypeSource.values) {
    
      let { id, title } = this.ProjectRolesTypeSource.values

      this.form.setValue({
        id: id,
        title: title,
      //  description: description
      })
    }
  }
  
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }
  
  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissProjectRolesControlModal();
  }
  
  getDescriptionLength(){
      var regex = /(<([^>]+)>)/ig;
      var result = this.form.value.description.replace(regex,"");
    return result.length;
  }
  
  save(close: boolean = false) {

    this.formErrors = null;
    
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      
      if (this.form.value.id) {
        save=this._projectRolesService.updateItem(this.form.value.id,this.form.value);
      } else {
        save = this._projectRolesService.saveItem(this.form.value);
      }

      save.subscribe((res: any) => {

          if(!this.form.value.id){
            this.resetForm();
          }
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
