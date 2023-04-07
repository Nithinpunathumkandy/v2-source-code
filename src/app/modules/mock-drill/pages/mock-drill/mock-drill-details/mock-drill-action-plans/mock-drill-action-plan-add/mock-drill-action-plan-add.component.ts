import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { MockDrillActionPlanService } from 'src/app/core/services/mock-drill/mock-drill-action-plans/mock-drill-action-plan.service';
import { MockDrillService } from 'src/app/core/services/mock-drill/mock-drill/mock-drill.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { MockDrillActionPlanStore } from 'src/app/stores/mock-drill/mock-drill-action-plan/mock-drill-action-plan-store';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-mock-drill-action-plan-add',
  templateUrl: './mock-drill-action-plan-add.component.html',
  styleUrls: ['./mock-drill-action-plan-add.component.scss']
})
export class MockDrillActionPlanAddComponent implements OnInit {

  @Input('source') actionPlansObject: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @Input('selectedMockDrill') selectedMockDrillData: any;
  form: FormGroup;
  formErrors: any;
  AppStore = AppStore;
  MockDrillActionPlanStore = MockDrillActionPlanStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  MockDrillStore = MockDrillStore;
  fileUploadPopupSubscriptionEvent: any;
  UsersStore = UsersStore;

  constructor(
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
    private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService,
    private _actionPlansService: MockDrillActionPlanService,
    private _mockDrillService: MockDrillService,
    private _usersService: UsersService,
    private _fileUploadPopupService: FileUploadPopupService,) { }

  ngOnInit(): void {
    this.clearCommonFilePopupDocuments();
    this.form = this._formBuilder.group({
      id: [null],
      title: ["", [Validators.required]],
      description: [''],
      start_date: ['', [Validators.required]],
      target_date: ['', [Validators.required]],
      mock_drill_id: [null, [Validators.required]],
      responsible_user_id: [null, [Validators.required]],
      documents: []
    });
    var mockDrillTemp: any = MockDrillStore.selected;
    if (mockDrillTemp) {
      mockDrillTemp.venue = MockDrillStore.selected.mock_drill_plan.venue;
      mockDrillTemp.mock_drill_type = MockDrillStore.selected.mock_drill_plan.mock_drill_type.type;
      this.form.patchValue({ mock_drill_id: mockDrillTemp });
    }
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    if (this.actionPlansObject?.type == "Edit") {
      if (MockDrillActionPlanStore.selectedPlan.documents.length > 0) {
        this.setDocuments(MockDrillActionPlanStore.selectedPlan.documents)
      }

      this.form.patchValue({
        id: MockDrillActionPlanStore.selectedPlan.id,
        title: MockDrillActionPlanStore.selectedPlan.title ? MockDrillActionPlanStore.selectedPlan.title : '',
        completion: MockDrillActionPlanStore.selectedPlan.completion ? MockDrillActionPlanStore.selectedPlan.completion + '%' : 0,
        mock_drill_id: mockDrillTemp, //MockDrillActionPlanStore.selectedPlan.mock_drill ? MockDrillActionPlanStore.selectedPlan.mock_drill : null,
        start_date: MockDrillActionPlanStore.selectedPlan.start_date ? this._helperService.processDate(MockDrillActionPlanStore.selectedPlan.start_date, 'split') : '',
        target_date: MockDrillActionPlanStore.selectedPlan.target_date ? this._helperService.processDate(MockDrillActionPlanStore.selectedPlan.target_date, 'split') : '',
        description: MockDrillActionPlanStore.selectedPlan.description ? MockDrillActionPlanStore.selectedPlan.description : '',
        responsible_user_id: MockDrillActionPlanStore.selectedPlan.responsible_user ? MockDrillActionPlanStore.selectedPlan.responsible_user : [],
      })
    }
  }

  setDocuments(documents) {
    this.clearCommonFilePopupDocuments();
    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element.kh_document.versions.forEach(innerElement => {
          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              title: element?.kh_document.title,
              'is_kh_document': true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              ...innerElement,
            })
          }
        });
      }
      else {
        if (element && element.token) {
          var purl = this._actionPlansService.getThumbnailPreview('action-plan', element.token);
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)
      }
    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  clearCommonFilePopupDocuments() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }
  getMockDrill() {
    this._mockDrillService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  searchMockDrill(event) {
    this._mockDrillService.getItems(false, 'q=' + event.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getmockDrillData(event) {
    if (event) {
      this._mockDrillService.getItem(event.id).subscribe(res => {
        this.form.patchValue({
          title: '',
          description: ''
        })
        this._utilityService.detectChanges(this._cdr);
      })
    }
  }

  resetForm() {
    this.form.reset();
    this.formErrors = null;
    this.clearCommonFilePopupDocuments();
    var mockDrillTemp: any = MockDrillStore.selected;
    if (mockDrillTemp) {
      mockDrillTemp.venue = MockDrillStore.selected.mock_drill_plan.venue;
      mockDrillTemp.mock_drill_type = MockDrillStore.selected.mock_drill_plan.mock_drill_type.type;
      this.form.patchValue({ mock_drill_id: mockDrillTemp });
    }
  }

  openFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.fileUploadModal?.nativeElement, 'display', 'block');
      this._renderer2.removeAttribute(this.fileUploadModal.nativeElement, 'aria-hidden');
      setTimeout(() => {
        this._renderer2.addClass(this.fileUploadModal.nativeElement, 'show')
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

  removeDocument(doc) {
    if (doc.hasOwnProperty('is_kh_document')) {
      if (!doc['is_kh_document']) {
        fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
      }
      else {
        fileUploadPopupStore.unsetFileDetails('kh-file', doc.token);
      }
    }
    else {
      fileUploadPopupStore.unsetFileDetails('document-file', doc.token);
    }
    this._utilityService.detectChanges(this._cdr);
  }

  createAddImageUrl(type, token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    AppStore.disableLoading();
    this.resetForm();
    this._eventEmitterService.dismissCommonModal(this.actionPlansObject?.type)
  }

  searchUsers(e) {
    this._usersService.searchUsers('?q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getDefaultImage() {
    return this._imageService.getDefaultImageUrl('user-logo');
  }

  createImageUrl(token) {// user-defined
    return this._imageService.getThumbnailPreview('user-profile-picture', token)
  }

  getUsers() {
    var params = '';
    this._usersService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getStringsFormatted(stringArray, characterLength, seperator) {
    return this._helperService.getFormattedName(stringArray, characterLength, seperator);
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

  processSaveData() {
    let saveData = this.form.value;
    saveData['mock_drill_id'] = this.form.value.mock_drill_id.id;
    saveData['title'] = this.form.value.title;
    saveData['description'] = this.form.value.description;
    saveData['start_date'] = this._helperService.processDate(this.form.value.start_date, 'join');
    saveData['target_date'] = this._helperService.processDate(this.form.value.target_date, 'join');
    saveData['responsible_user_id'] = this.form.value.responsible_user_id.id;
    saveData['documents'] = this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile);
    return saveData;
  }

  save(close: boolean = false) {
    if (this.form.value) {
      let save;
      AppStore.enableLoading();
      if (this.form.value.id) {
        save = this._actionPlansService.updateItem(this.form.value.id, this.processSaveData());
      } else {
        save = this._actionPlansService.saveItem(this.processSaveData());
      }
      save.subscribe(
        (res: any) => {
          AppStore.disableLoading();
          if (this.actionPlansObject.type == 'Add') {
            this.resetForm();
          }
          this._utilityService.detectChanges(this._cdr);
          if (close) {
            this.closeFormModal();
          }
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
}
