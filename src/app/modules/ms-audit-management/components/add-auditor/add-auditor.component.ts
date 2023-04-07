import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MsAuditors } from 'src/app/core/models/ms-audit-management/ms-audit/ms-audit';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Component({
  selector: 'app-add-auditor',
  templateUrl: './add-auditor.component.html',
  styleUrls: ['./add-auditor.component.scss']
})
export class AddAuditorComponent implements OnInit {
  @Input ('source') auditors: any;

  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  auditArray=[];
  auditUsers: MsAuditors[];

  cancelObject = {
    type: '',
    title: '',
    subtitle: ''
  }

  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _cdr: ChangeDetectorRef,
    private _usersService: UsersService,
    private _imageService: ImageServiceService,
  ) { }

  ngOnInit(): void {
    
    this.form = this._formBuilder.group({
      ms_audit_auditor:[[], [Validators.required]]
    });  

    this.getAllUsers();
  }

  ngOnChanges():void{
    this.auditUsers=this.auditors;
  }

  clearCancelObject() {
    this.cancelObject.type = '';
    this.cancelObject.title = '';
    this.cancelObject.subtitle = '';
  }

  // Returns default image
  getDefaultImage(){
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

   // Get users
   getAllUsers()
   {
     UsersStore.setAllUsers([]);
     this._usersService.getAllItems().subscribe(res=>{
 
       this.auditArray=UsersStore.usersList;
       let ids = new Set(this.auditUsers.map(({ user_id }) => user_id));
 
       this.auditArray = this.auditArray.filter(({ id }) => !ids.has(id));
       
       this._utilityService.detectChanges(this._cdr);
     })
   }

   searchUsers(e){
    this._usersService.searchUsers('?q='+e.term).subscribe(res=>{
      this.auditArray=UsersStore.usersList; 
      let ids = new Set(this.auditUsers.map(({ user_id }) => user_id));
      this.auditArray = this.auditArray.filter(({ id }) => !ids.has(id));      
      this._utilityService.detectChanges(this._cdr);
    })
  }

     // cancel modal
cancel() {
  // FormErrorStore.setErrors(null);
  this.closeFormModal();
}
     // for resetting the form
resetForm() {
  this.form.reset();
  this.form.pristine;
  this.formErrors = null;
  AppStore.disableLoading();
}


  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this._eventEmitterService.dismissAddAuditorModal(this.form.value.ms_audit_auditor);
    
  }
  save(close: boolean = false) {
    this.formErrors = null;
    if (this.form.value) {
      // let save;
      AppStore.enableLoading();
      this._eventEmitterService.dismissAddAuditorModal(this.form.value.ms_audit_auditor);
        this.closeFormModal();
        this._utilityService.showSuccessMessage('success', 'ms_auditor_added');
    
    }
    }

    //getting button name by language
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
}
