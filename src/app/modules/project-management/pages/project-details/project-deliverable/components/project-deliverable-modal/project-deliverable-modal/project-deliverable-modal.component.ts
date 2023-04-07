import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ProjectDeliverableService } from 'src/app/core/services/project-management/project-details/project-deliverable/project-deliverable.service'
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';

@Component({
  selector: 'app-project-deliverable-modal',
  templateUrl: './project-deliverable-modal.component.html',
  styleUrls: ['./project-deliverable-modal.component.scss']
})
export class ProjectDeliverableModalComponent implements OnInit {

  @Input('source') Deliverable: any;

  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;



  UsersStore = UsersStore


  constructor(private _eventEmitterService: EventEmitterService,
    private formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _deliverableService: ProjectDeliverableService,
    private _userService: UsersService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService) { }


  ngOnInit(): void {

    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      responsible_user_id: ['', Validators.required],
      target_date: [''],
      id: ['']
    })



    this.resetForm();
    if (this.Deliverable) {
      this.setFormValues();
    }


  }

  closeFormModal() {

    this.resetForm();
    this._eventEmitterService.dismissDeliverableControlModal();

  }

  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }

  setFormValues() {
    if (this.Deliverable.hasOwnProperty('values') && this.Deliverable.values) {

      let { title, responsible_user_id, target_date, id } = this.Deliverable.values
      this.form.setValue({
        title: title,
        responsible_user_id: responsible_user_id,
        target_date: this._helperService.processDate(target_date, 'split'),
        id: id
      })
      this.getUsers({ term: this.form.value.responsible_user_id })
    }
  }

  ngDoCheck() {
    if (this.Deliverable && this.Deliverable.hasOwnProperty('values') && this.Deliverable.values && !this.form.value.id)
      this.setFormValues();
  }
  createSaveData() {
    let saveData = this.form.value
    saveData['target_date'] = this._helperService.processDate(this.form.value.target_date, 'join')
    return saveData
  }
  Save(close: boolean = false) {

    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();



      if (this.form.value.id) {
        save = this._deliverableService.updateItem(this.form.value.id, this.createSaveData());
      } else {
        save = this._deliverableService.saveItem(this.createSaveData());
      }
      save.subscribe((res: any) => {
        if (!this.form.value.id) {
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
        else if (err.status == 500 || err.status == 403) {
          this.closeFormModal();
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }
  getUsers(type?) {
    this._userService
      .searchUsers(type ? '?q=' + type.term : '')
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }
  customSearchFn(term: string, item: any) {
    term = term.toLowerCase();
    // Creating and array of space saperated term and removinf the empty values using filter
    let splitTerm = term.split(' ').filter(t => t);
    let isWordThere = [];
    // Pushing True/False if match is found
    splitTerm.forEach(arr_term => {
      item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
      let search = item['searchLabel'].toLowerCase();
      isWordThere.push(search.indexOf(arr_term) != -1);
    });

    const all_words = (this_word) => this_word;
    // Every method will return true if all values are true in isWordThere.
    return isWordThere.every(all_words);
  }
  createImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }
  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }


  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
