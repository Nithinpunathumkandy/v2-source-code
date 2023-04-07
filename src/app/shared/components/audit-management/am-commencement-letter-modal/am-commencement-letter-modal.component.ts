import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AmAuditCommencementLetterService } from 'src/app/core/services/audit-management/am-audit/am-audit-commencement-letter/am-audit-commencement-letter.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
declare var $: any;
@Component({
  selector: 'app-am-commencement-letter-modal',
  templateUrl: './am-commencement-letter-modal.component.html',
  styleUrls: ['./am-commencement-letter-modal.component.scss']
})
export class AmCommencementLetterModalComponent implements OnInit {
  @Input('source') auditCommencementLetterSource: any;
  @ViewChild('cancelPopup') cancelPopup: ElementRef;

  formErrors = null;
  form: FormGroup;

  UsersStore = UsersStore;

  AppStore = AppStore;
  cancelEventSubscription: any;

  deleteObject = {
    id: null,
    type: '',
    subtitle: ''
  };

  config = {
		toolbar: [
			'undo',
			'redo',
			'|',
			'heading',

			'|',

			'bulletedList',
			'numberedList',
      '|',
      'insertTable'
			
		],
		language: 'id',
		
	};

	public Editor;


  constructor(
    private _formBuilder: FormBuilder,
    private _usersService: UsersService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService: HumanCapitalService,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _auditCommencementLetterService:AmAuditCommencementLetterService) { 
      this.Editor = myCkEditor;
    }
    public onReady(editor: any) {
			editor.ui.getEditableElement().parentElement.insertBefore(
			  editor.ui.view.toolbar.element,
			  editor.ui.getEditableElement()
			);
		  }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id: [null],
      date: ['',[Validators.required]],
      to_user_id: [null,[Validators.required]],
      user_ids: [[],[Validators.required]],
      subject: ['',[Validators.required]],
      body: ['',[Validators.required]]
    })
    if (this.auditCommencementLetterSource) {
      this.setFormValues();
    }

    this.cancelEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.cancel(item);
    })


  }



  clear(type) {
    if (type == 'date') {
      this.form.patchValue({
        date: null
      })
    }

  }


  getUsers() {
    var params = '?page=1';

    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }

  searchUsers(e) {
    let params = '?page=1';
    if (params) params = params + '&q=' + e.term;
    else params = '?q=' + e.term;
    this._usersService.searchUsers(params ? params : '').subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getTypes(types) {
    let type = [];
    for (let i of types) {
      type.push(i.id);
    }
    return type;
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

  descriptionValueChange(event) {
		this._utilityService.detectChanges(this._cdr);
	}


  createImageUrl(token) {
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }


  getSaveData() {
    let saveData = {

      date: this._helperService.processDate(this.form.value.date, 'join'),
      user_ids: this.getTypes(this.form.value.user_ids),
      to_user_id: this.form.value.to_user_id?.id,
      subject: this.form.value.subject,
      body: this.form.value.body

    }
    return saveData;
  }


  save(close: boolean = false) {

    this.formErrors = null;
    AppStore.enableLoading();
 
  
      this._auditCommencementLetterService.updateItem(this.form.value.id, this.getSaveData()).subscribe((res: any) => {
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr)
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

    });
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }


  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
  }

  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  cancel(status) {
    if (status) {
      this.closeFormModal();
    }
    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('hide');
    }, 250);
  }

  confirmCancel() {
    this.deleteObject.type = 'Cancel';
    this.deleteObject.subtitle = 'am_audit_document_cancel_confirm?';

    setTimeout(() => {
      $(this.cancelPopup.nativeElement).modal('show');
    }, 100);

  }


  closeFormModal() {
    this.form.reset();
    this.formErrors = null;
    this._eventEmitterService.dismissAmAuditCommencementLetterModal();
  }

  getData(data){
    let dataArray = [];
    for(let i of data){
      dataArray.push(i);
    }
    return dataArray;
  }



  setFormValues() {
    if (this.auditCommencementLetterSource.hasOwnProperty('values') && this.auditCommencementLetterSource.values) {
      let { id, date, subject, to_user_id,user_ids, body} = this.auditCommencementLetterSource.values
      this.form.patchValue({
        id: id,
        date: date,
        subject:subject,
        to_user_id:to_user_id,
        user_ids: this.getData(user_ids),
        body: body
      })
    }

    this.getUsers();
  }

  ngOnDestroy() {
    this.cancelEventSubscription.unsubscribe();
  }

}
