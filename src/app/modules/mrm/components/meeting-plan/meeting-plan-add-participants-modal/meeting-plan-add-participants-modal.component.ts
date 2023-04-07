import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Input } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { MeetingPlanService } from 'src/app/core/services/mrm/meeting-plan/meeting-plan.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MeetingPlanStore } from 'src/app/stores/mrm/meeting-plan/meeting-plan-store';

@Component({
  selector: 'app-meeting-plan-add-participants-modal',
  templateUrl: './meeting-plan-add-participants-modal.component.html',
  styleUrls: ['./meeting-plan-add-participants-modal.component.scss']
})
export class MeetingPlanAddParticipantsModalComponent implements OnInit {
  @Input('source') source: any;

  form: FormGroup;
  formErrors: any;
  saveData = {};
  
  participants = [];
  currentParticipants = [];
  
  AppStore = AppStore;
  UsersStore = UsersStore;
  reactionDisposer: IReactionDisposer;
  MeetingPlanStore = MeetingPlanStore;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _meetingPlanService: MeetingPlanService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {

    this.form = this._formBuilder.group({
      meeting_plan_users: [[], [Validators.required]]
    });

    this.getAllUsers();
  }

  getAllUsers() {
    this.currentParticipants = MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_users;

    let ids = new Set(this.currentParticipants?.map(({ user }) => user.id));

    UsersStore.setAllUsers([]);
    this._usersService.getAllItems().subscribe(res => {
      this.participants = UsersStore.usersList;
      this.participants = this.participants.filter(({ id }) => !ids.has(id));
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchUers(e) {
    this.currentParticipants = MeetingPlanStore.individualMeetingPlanDetails?.meeting_plan_users;

    let ids = new Set(this.currentParticipants?.map(({ user }) => user.id));

    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this.participants = UsersStore.usersList;
      this.participants = this.participants.filter(({ id }) => !ids.has(id));
      this._utilityService.detectChanges(this._cdr);
    })
  }

  searchListclickValueClear(event) {
    return event.searchTerm = '';
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
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

  closeFormModal(close:boolean=false) {
    this.resetForm();
    this._eventEmitterService.dismissMeetingPlanAddParticipantsModal(close);
  }

  getData() {
    let user = [];
    for (let i of this.form.value.meeting_plan_users) {
      user.push({ "user_id": i.id });
    }

    return user;
  }

  setData() {
    this.saveData = {
      meeting_plan_users: this.getData(),
    }
  }

  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
  
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
  
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
  
    return isWordThere.every(all_words);
  }

  save(close: boolean = false) {
    this.setData();
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.source) {
        save = this._meetingPlanService.savePartcipation(this.saveData, this.source);
      } 
      save.subscribe((res: any) => {
          this.resetForm();
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal(true);
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.formErrors = err.error.errors;
        }
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);

      });
    }
  }

}
