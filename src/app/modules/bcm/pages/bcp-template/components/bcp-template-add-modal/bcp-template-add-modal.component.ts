import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BcmTemplateService } from 'src/app/core/services/bcm/bcm-template/bcm-template.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BcmTemplateStore } from 'src/app/stores/bcm/bcm-template/bcm-template';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import * as myCkEditor from 'src/assets/build/ckeditor';


declare var $: any;
@Component({
  selector: 'app-bcp-template-add-modal',
  templateUrl: './bcp-template-add-modal.component.html',
  styleUrls: ['./bcp-template-add-modal.component.scss']
})
export class BcpTemplateAddModalComponent implements OnInit {
  @Input('source') TemplateSource: any;
  @ViewChild('ItemsDiv', { static: false }) ItemsDiv: ElementRef;

  BcmTemplateStore = BcmTemplateStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AppStore = AppStore;
  UsersStore = UsersStore;
  form: FormGroup;
  formErrors: any;
  fileUploadsArray: any = [];
  fileUploadProgress = 0;

  order = null;
  description = null;
  title = null;
  ItemsList = [];
  ItemMessage = null;
  editFlag:boolean = false
  public Editor;
  config = {
    toolbar: [
      'undo',
      'redo',
      '|',
      'heading',

      '|',
      'bold',
      'italic',
      '|',
      'bulletedList',
      'numberedList',
      'todoList',
      '|',
      'indent',
      'outdent',
      '|',
      'blockQuote',
      'insertTable',

    ],
    language: 'id',
    image: {
      toolbar:[]
    }
  };
  editIndex: any;
  constructor(
    private _bcmTemplateService: BcmTemplateService,
    private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _userService: UsersService,
    private _eventEmitterService: EventEmitterService,
    private _imageService: ImageServiceService,
    private _utilityService: UtilityService,
    private _helperService: HelperServiceService,
  ) { 
    this.Editor = myCkEditor;
  }
  public onReady(editor: any) {
    editor.ui.getEditableElement().parentElement.insertBefore(
      editor.ui.view.toolbar.element,
      editor.ui.getEditableElement()
    );
  }

  ngOnInit(): void {
    // Form Object to add Control Category

    this.form = this._formBuilder.group({
      id: [''],
      template_title: ['', [Validators.required, Validators.maxLength(255)]],
      // title: ['',[Validators.required, Validators.maxLength(255)]],
      description:[''],
      // order:['',[Validators.required, Validators.pattern(/^-?(0|[1-9]\d*)?$/)]],
      documents: ''

    });

    // restingForm on initial load
    this.resetForm();

    // Checking if Source has Values and Setting Form Value
    if (this.TemplateSource) {
      this.setFormValues();
    }
  }
  ngDoCheck() {
    if (this.TemplateSource && this.TemplateSource.hasOwnProperty('values') && this.TemplateSource.values && !this.form.value.id)
      this.setFormValues();
  }

  setFormValues() {
    if (this.TemplateSource.hasOwnProperty('values') && this.TemplateSource.values) {
      let { id, template_content, template_title, documents } = this.TemplateSource.values
      this.ItemsList = template_content;
      this.form.patchValue({
        template_title: template_title,
        id: id,
        // title: title,
        // description:description,
        // order:order,
        documents: '',

      })
    }
  }

  clearValues(){
    this.title = null;
    this.description = '';
    this.form.patchValue({
      description:''
    })
    this.order = '';
    this.editFlag = false;
  }

  // Add title
  addItem() {
    if(!this.editFlag){
      this.ItemsList.push({
        title: this.title,
        order: this.order?this.order: this.ItemsList.length, 
        description: this.form.value.description?this.form.value.description:''
      });
      this._utilityService.detectChanges(this._cdr);
    }else{
      this.ItemsList[this.editIndex]['title'] = this.title
      this.ItemsList[this.editIndex]['order'] = this.order?this.order: this.ItemsList.length
      this.ItemsList[this.editIndex]['description'] = this.form.value.description?this.form.value.description:''
      this._utilityService.detectChanges(this._cdr);
    }
    this.clearValues()
    this.checkForServiceItemsScrollbar();
    this._utilityService.detectChanges(this._cdr);

  }

  /**
   * Remove item
   * @param position Position of item
   */
  removeItem(position) {
    this.ItemsList.splice(position, 1);
    this.checkForServiceItemsScrollbar();
  }

  edititems(data, position) {
    this.editFlag = true;
    this.editIndex = position
    var editItem = data;
    this.title = editItem.title,
    this.description = editItem.description,
    this.form.patchValue({
      description:editItem.description
    })
    this.order = editItem.order,
    // this.ItemsList.splice(position, 1);
    setTimeout(() => {
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    this.checkForServiceItemsScrollbar();
  }

  // sortItems(){
  //   this.ItemsList.sort(function(a, b){return a.order - b.order});
  // }


  descriptionChange(event){
    this.description = event.editor.getData()
    this._utilityService.detectChanges(this._cdr);
  }

  checkForServiceItemsScrollbar() {
    setTimeout(() => {
      if (this.ItemsList.length > 0 && $(this.ItemsDiv?.nativeElement).height() >= 100) {
        $(this.ItemsDiv.nativeElement).mCustomScrollbar();
      }
      else {
        if (this.ItemsList.length > 0) $(this.ItemsDiv?.nativeElement).mCustomScrollbar("destroy");
      }
    }, 250);
  }

  // for resetting the form
  resetForm() {
    this.form.reset();
    this.form.pristine;
    this.ItemsList = [];
    this.formErrors = null;

    AppStore.disableLoading();
  }


  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();

  }
  // getting description count

  // getDescriptionLength() {
  //   var regex = /(<([^>]+)>)/ig;
  //   var result = this.form.value.description.replace(regex, "");
  //   return result.length;
  // }

  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }

  onFileChange(event, type: string) {
    //this.fileUploadProgress = 0;
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      // this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          BcmTemplateStore.document_preview_available = true;
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams).subscribe((res: HttpEvent<any>) => {
            let uploadEvent: any = res;
            switch (uploadEvent.type) {
              case HttpEventType.UploadProgress:
                // Compute and show the % done;
                if (uploadEvent.loaded) {
                  let upProgress = Math.round(100 * uploadEvent.loaded / uploadEvent.total);
                  this.assignFileUploadProgress(upProgress, file);
                }
                this._utilityService.detectChanges(this._cdr);
                break;
              case HttpEventType.Response:
                //return event;
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                  BcmTemplateStore.document_preview_available = false;
                  this.createImageFromBlob(prew, temp, type);
                }, (error) => {
                  BcmTemplateStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            BcmTemplateStore.document_preview_available = false;
            this.assignFileUploadProgress(null, file, true);
            this._utilityService.detectChanges(this._cdr);
          })
        }
        else {
          this.assignFileUploadProgress(null, file, true);
        }
      });
    }
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }


  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  assignFileUploadProgress(progress, file, success = false) {

    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  createImageFromBlob(image: Blob, imageDetails, type) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._bcmTemplateService.setFileDetails(imageDetails, logo_url, type);
      else
        this._bcmTemplateService.setSelectedImageDetails(logo_url, type);
      // this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }

  // for closing the modal
  closeFormModal() {
    this.resetForm();
    this.BcmTemplateStore.clearFileDetails();
    // BcmTemplateStore.unsetFileDetails('logo');
    this._eventEmitterService.dismissbcpTemplateAdd();

  }

  processDataForSave() {
    var save: any = {
      documents: BcmTemplateStore.getImageDetails,
      contents: this.ItemsList,
      template_title: this.form.value.template_title
    }
    return save;
  }

  save(close: boolean = false) {
    this.formErrors = null;
    var saveData = this.processDataForSave();
    console.log(saveData);

    this.form.patchValue({
      documents: BcmTemplateStore.getImageDetails,
    })

    if (this.form.value) {
      let save;
      AppStore.enableLoading();

      if (this.form.value.id) {
        save = this._bcmTemplateService.updateItem(this.form.value.id, saveData);
      } else {
        delete this.form.value.id
        save = this._bcmTemplateService.saveItem(saveData);
      }

      save.subscribe((res: any) => {
        this.BcmTemplateStore.lastInsertedId = res.id
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

      });
    }
  }

  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
