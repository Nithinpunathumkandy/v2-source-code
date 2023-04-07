import { Component, OnInit, ChangeDetectorRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { TemplateContentService } from 'src/app/core/services/knowledge-hub/templates/template-content.service'
import { ContentStore } from 'src/app/stores/knowledge-hub/templates/templateContent.store';
import { DocumentContentService } from 'src/app/core/services/knowledge-hub/documents/document-content.service';
import { ChangeRequestContentService } from 'src/app/core/services/knowledge-hub/change-request/change-request-content.service';
import { changeRequestStore } from 'src/app/stores/knowledge-hub/change-request/change-request.store';
import * as myCkEditor from 'src/assets/build/ckeditor';
import { MyUploadAdapter } from "src/app/shared/directives/upload-adapter";
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-cr-main-clause',
  templateUrl: './cr-main-clause.component.html',
  styleUrls: ['./cr-main-clause.component.scss']
})
export class CrMainClauseComponent implements OnInit {

  @Input('source') sourceParams
  contentForm: FormGroup;
  formErrors: any;
  clauseError: boolean = false;

  AppStore = AppStore;
  templateContentId: number
  documentVersionContentId: number;
  changeRequestContentId: number;
  order: number
  changeRequestStore = changeRequestStore

  public Editor;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _changeRequestContent: ChangeRequestContentService,
    private _http: HttpClient,
    private _helperService: HelperServiceService,
    private _documentContent: DocumentContentService,
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

    AppStore.showDiscussion = false;

    AppStore.disableLoading();
    this.contentForm = this._formBuilder.group({
      id: [""],
      //document_template_content_id:[''],
      clause_number: [],
      title: ['', Validators.required],
      description: [''],
      is_plan: [false],
      is_do: [false],
      is_check: [false],
      is_act: [false],
      order: ['']

    })

    // ClassicEditor
    // .create( document.querySelector( '#description' ), {
    //     extraPlugins: [ MyUploadAdapter ],

    //     // ...
    // } )
    // .catch( error => {
    //     // console.log( error );
    // } );

    if (ContentStore.editCheck && this.sourceParams && this.sourceParams.id) {
      this.setDataforEdit()
    }
    // this.getContents();
    if (!ContentStore.editCheck && ContentStore.clause_number || ContentStore.clause_number == 0)
      this.setClauseNumber()

  }

  setClauseNumber() {
    this.contentForm.patchValue({
      clause_number: ContentStore.clause_number
    })
  }

  MyCustomUploadAdapterPlugin(editor) {
    editor.plugins.get('FileRepository')
      .createUploadAdapter = (loader) => {
        // Configure the URL to the upload script in your back-end here!
        return new MyUploadAdapter(loader, this._http);
      };
  }



  // Checking For String in Clause Number
  hasNumber(myString) {
    var status = /\d/.test(myString);
    if (!status) {
      this.clauseError = true
      this.contentForm.controls['clause_number'].reset()
      AppStore.disableLoading();
    } else {
      this.clauseError = false;
    }
  }

  save(close: boolean = false) {

    //  this.hasNumber(this.contentForm.value.clause_number)

    if (!this.sourceParams.id)
      this.setParams()


    if (this.contentForm.value) {
      if (!this.clauseError) {

        let save;
        AppStore.enableLoading();

        if (this.contentForm.value.id) {

          save = this._changeRequestContent.updateItem(this.contentForm.value.id, this.setPostParams(this.sourceParams.modalType, 'Update'));


        } else {
          this.contentForm.removeControl('id')
          save = this._changeRequestContent.saveItem(this.setPostParams(this.sourceParams.modalType, 'Save'));

        }
        save.subscribe(
          (res: any) => {
            this.resetForm();
            AppStore.disableLoading();
            setTimeout(() => {
              this._utilityService.detectChanges(this._cdr);
            }, 500);
            if (close) this.closeFormModal('save', res.id);
          },
          (err: HttpErrorResponse) => {

            AppStore.disableLoading();
            if (err.status == 422) {
              this.formErrors = err.error.errors;
            } else {
              this._utilityService.showErrorMessage(
                "Error!",
                "Something went wrong. Please try again."
              );
            }
            this._utilityService.detectChanges(this._cdr);
          }
        );
      }

    }
  }

  // Function to set Final Post Data.
  setPostParams(modalType, type) {

    // modalType refers to whether its Document/Template
    // type refers to whether its Update or Save.

    var postParams: any;
    if (type == 'Save') {
      postParams = {
        title: this.contentForm.value.title,
        order: this.order,
        clause_number: this.contentForm.value.clause_number,
        description: this.contentForm.value.description,
        document_change_request_content_id: this.changeRequestContentId,
        is_do: +this.contentForm.value.is_do,
        is_plan: +this.contentForm.value.is_plan,
        is_check: +this.contentForm.value.is_check,
        is_act: +this.contentForm.value.is_act,
        is_checklist_applicable: +this.contentForm.value.is_checklist_applicable,
      }
      return postParams


    } else {



      this.contentForm.removeControl('document_template_content_id')

      postParams = {
        ...this.contentForm.value,
        document_change_request_content_id: this.changeRequestContentId,
        is_do: +this.contentForm.value.is_do,
        is_plan: +this.contentForm.value.is_plan,
        is_check: +this.contentForm.value.is_check,
        is_act: +this.contentForm.value.is_act,
        is_checklist_applicable: +this.contentForm.value.is_checklist_applicable,
      }

      return postParams



    }

  }

  getDescriptionLength() {
    var regex = /(<([^>]+)>)/ig;
    var result = this.contentForm.value.description.replace(regex, "");
    return result.length;
  }

  descriptionValueChange(event) {
    this._utilityService.detectChanges(this._cdr);
  }

  // Function to Set Edit Data.
  setDataforEdit() {

    var data = this.sourceParams

    this.changeRequestContentId = data.changeRequestContentId
    this.contentForm.patchValue({
      id: data.id,
      title: data.title,
      description: data.description,
      is_do: data.is_do,
      is_plan: data.is_plan,
      is_check: data.is_check,
      is_act: data.is_act,
      is_checklist_applicable: data.is_checklist_applicable,
      clause_number: data.clause_number,
      order: data.order
    })

    this._utilityService.detectChanges(this._cdr)


  }
  // Ends Here

  // Function to set order,documentContentId|templateContentId when creating 
  setParams() {

    var sourceData = this.sourceParams

    if (sourceData.changeRequestContentId == null) {

      let data = ContentStore.ContentList
      this.changeRequestContentId = sourceData.changeRequestContentId;
      this.order = data.length + 1
    }
    else {

      if (sourceData.children) {
        this.order = sourceData.order;
        this.changeRequestContentId = sourceData.changeRequestContentId;
      }
      else {
        this._documentContent.getItemById(this.changeRequestContentId);
        let data = ContentStore.ContentIndividualList;
        if (data["children_content"]) {
          this.order = data["children_content"].length + 1;
        } else {
          this.order = 1;
        }
        this.changeRequestContentId = sourceData.changeRequestContentId;
      }
    }

  }

  // Ends Here

  cancel() {
    this.closeFormModal('cancel');
  }

  closeFormModal(type, contentId?) {
    AppStore.disableLoading();

    let emitParam = {
      item: 'clause',
      type: type,
      modalType: this.sourceParams.modalType
    }
    this.resetForm();
    if (type == 'save') {
      this.verifyParentContent(this.sourceParams.modalType, contentId)
    }


    setTimeout(() => {
      this._eventEmitterService.passModalType(emitParam)
    }, 300);


  }

  verifyParentContent(type, contentId) {
    this._changeRequestContent.getItemById(contentId).subscribe(res => {
      if (res['parent_content'] == null) {
        ContentStore.ParentId = contentId
      }
    })
  }

  resetForm() {
    this.contentForm.reset();
    this.contentForm.pristine;
    this.formErrors = null;

  }

  ngOnDestroy() {
    ContentStore.clause_number = null;
  }
  //getting button name by language
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
