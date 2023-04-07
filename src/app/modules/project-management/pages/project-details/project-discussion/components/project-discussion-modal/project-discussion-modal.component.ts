
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ProjectDiscussionService } from 'src/app/core/services/project-management/project-details/project-discussion/project-discussion.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
declare var $: any;
// import { fileUploadPopupStore } from 'src/app/stores/project-management/project-details/project-discussion/project-discussion.store';

@Component({
  selector: 'app-project-discussion-modal',
  templateUrl: './project-discussion-modal.component.html',
  styleUrls: ['./project-discussion-modal.component.scss']
})
export class ProjectDiscussionModalComponent implements OnInit {
  
  @Input('source') Deliverable: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  form: FormGroup;
  AppStore = AppStore;
  formErrors: any;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  fileUploadPreviewSubscription: any;
  fileUploadPopupSubscriptionEvent: any;
  constructor(private _eventEmitterService: EventEmitterService,
    private formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _discusiionService: ProjectDiscussionService,
    private _userService: UsersService,
    private _renderer2: Renderer2,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService) {

      this.form = this.formBuilder.group({
        title: ['', Validators.required],
        description: [''],
        documents:[[]],
        id: ['']
      })
   }

  
  ngOnInit(): void {

    setTimeout(() => {
      this.enableScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, 50);
    this.fileUploadPreviewSubscription = this._eventEmitterService.fileUploadPreviewFocus.subscribe(res => {
  
      // this._renderer2.setStyle(this.newControl.nativeElement, 'z-index', 999999);
      // this._renderer2.setStyle(this.newControl.nativeElement, 'overflow', 'auto');
  
    })
  
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.resetForm();
    if (this.Deliverable) {
      this.setFormValues();
    }


  }
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.formErrors = null;
    AppStore.disableLoading();
  }


  setFormValues() {
    if (this.Deliverable.hasOwnProperty('values') && this.Deliverable.values) {

      let { title, responsible_user_id, description, id } = this.Deliverable.values
      this.form.setValue({
        title: title,
        responsible_user_id: responsible_user_id,
        description: description,
        id: id
      })
      this.getUsers({ term: this.form.value.responsible_user_id })

    }
  }
  getUsers(type?) {
    this._userService
      .searchUsers(type ? '?q=' + type.term : '')
      .subscribe((res) => {
        this._utilityService.detectChanges(this._cdr);
      });
  }
  closeFormModal() {

    this.resetForm();
    this._eventEmitterService.dismissDiscussionControlModal();

  }

  Save(close: boolean = false) {

    if (this.form.value.id) {
			this.form.patchValue({
        documents: this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile)
      }) 
		} else{
      this.form.patchValue({
        documents:this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles, 'save')
      }) 
			
		}
    this.formErrors = null;
    if (this.form.value) {
      let save;
      AppStore.enableLoading();



      if (this.form.value.id) {
        // save = this._deliverableService.updateItem(this.form.value.id, this.createSaveData());
      } else {
        save = this._discusiionService.saveItem(this.form.value);
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
  openFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = true;
			$('.modal-backdrop').add();
			document.body.classList.add('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
			this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
			setTimeout(() => {
				this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
				// this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', '99999');
				this._utilityService.detectChanges(this._cdr)
			}, 100);
		}, 250);
	}
	closeFileUploadModal() {
		setTimeout(() => {
			fileUploadPopupStore.openPopup = false;
			document.body.classList.remove('modal-open')
			this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
			this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
			$('.modal-backdrop').remove();
			setTimeout(() => {
				this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
				this._utilityService.detectChanges(this._cdr)
			}, 200);
		}, 100);
	}

	createImageUrl(type, token) {
		if (type == 'document-version')
			return this._documentFileService.getThumbnailPreview(type, token);
	}
	enableScrollbar() {
		if (fileUploadPopupStore.displayFiles.length >= 3) {
			$(this.uploadArea.nativeElement).mCustomScrollbar();
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar();
		}
		else {
			$(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
			// $(this.previewUploadArea.nativeElement).mCustomScrollbar("destroy");
		}
	}

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
  

  

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
}
