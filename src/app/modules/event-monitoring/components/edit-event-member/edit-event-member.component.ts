import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventTeamService } from 'src/app/core/services/event-monitoring/event-team/event-team.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';

@Component({
  selector: 'app-edit-event-member',
  templateUrl: './edit-event-member.component.html',
  styleUrls: ['./edit-event-member.component.scss']
})
export class EditEventMemberComponent implements OnInit {
  @Input('source') eventMemberSource: any;

  form: FormGroup;
  formErrors :any;
  AppStore = AppStore;
  AuthStore = AuthStore;
  id = null;
  constructor(
    private _utilityService: UtilityService, 
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _eventTeamsService: EventTeamService,
    private _imageService:ImageServiceService,

  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      roles:['',[Validators.required]],
      responsibilities:['',[Validators.required]]
    });
    this.setEditData();
  }
  setEditData(){
      if(this.eventMemberSource){
        this.id = this.eventMemberSource?.id ? this.eventMemberSource.id : null;
        this.form.patchValue({
          roles:this.eventMemberSource.value?.pivot?.roles? this.eventMemberSource.value?.pivot.roles : '',
          responsibilities:this.eventMemberSource.value?.pivot?.responsibilities? this.eventMemberSource.value?.pivot.responsibilities : '',
        }) }
  }

  setSaveData(){
    let saveData = {}
    saveData['roles'] = this.form.value?.roles ? this.form.value?.roles : []
    saveData['responsibilities'] = this.form.value?.responsibilities ? this.form.value?.responsibilities : []
    return saveData;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  save(close?){
    this.formErrors = null;
    let save: any;
    AppStore.enableLoading();
    
      save = this._eventTeamsService.updateEventMember( this.id,this.setSaveData());

    save.subscribe(res=>{
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if(close) this.closeFormModal();
    }, (err: HttpErrorResponse) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        //this.processFormErrors();
        this._utilityService.detectChanges(this._cdr);
      }
    })
  }

  closeFormModal(){
    this._eventEmitterService.dismissEventMemberModel();
    this.formErrors = null;
    this.form.reset();
  }

  cancel(){
    this.form.reset();
    this._eventEmitterService.dismissEventMemberModel();
  }
  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
}
