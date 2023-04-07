import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ObjectiveScoreService } from 'src/app/core/services/strategy-management/objective/objective-score.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
declare var $: any;

@Component({
  selector: 'app-add-objective-score',
  templateUrl: './add-objective-score.component.html',
  styleUrls: ['./add-objective-score.component.scss']
})
export class AddObjectiveScoreComponent implements OnInit {
  @Input('source') objectiveMesureSource: any;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  AppStore = AppStore;
  form : FormGroup;
  OrganizationGeneralSettingsStore =OrganizationGeneralSettingsStore
  objectiveDataArray: any = [];
  formErrors: any;
  fileUploadPopupStore=fileUploadPopupStore;
  fileUploadPopupSubscriptionEvent: any;


  constructor(private _helperService:HelperServiceService,
    private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
              private _documentFileService: DocumentFileService,
              private _imageService: ImageServiceService,
              private _renderer2: Renderer2,private _utilityService: UtilityService,
              private _cdr: ChangeDetectorRef,
              private _fileUploadPopupService: FileUploadPopupService,
              private _reviewService : StrategyReviewService,
              private _objectiveService : ObjectiveScoreService,) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      id : [null],
      actual_value : [null,[Validators.required]],
      justification : [null]
    })

    this.fileUploadPopupSubscriptionEvent=this._eventEmitterService.fileUploadPopup.subscribe(res=>{
      this.enableScrollbar();
      this.closeFileUploadModal();
    })

    this.setData()
  }

  cancel(){
   this._eventEmitterService.dismissObjectiveScoreModal()
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }


  enableScrollbar(){
    if(fileUploadPopupStore.displayFiles.length >= 3 ){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  createImageUrl(type,token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
    // * File Upload/Attach Modal

    openFileUploadModal() {
      setTimeout(() => {
        fileUploadPopupStore.openPopup = true;
        $('.modal-backdrop').add();
        document.body.classList.add('modal-open')
        this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'block');
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
  setData(){
    var ObjectiveDocumentDetails = this.objectiveMesureSource.value.strategy_profile_objective_review_frequency_target_documents;
          if(this.objectiveMesureSource.value.strategy_profile_objective_review_frequency_target_documents && ObjectiveDocumentDetails.length > 0){
            this.setDocuments(ObjectiveDocumentDetails)
          }
          this.form.patchValue({
            actual_value : this.objectiveMesureSource.value.actual_value ? this.objectiveMesureSource.value.actual_value : '',
            justification : this.objectiveMesureSource.value.justification ? this.objectiveMesureSource.value.justification : '',
            // document :  data.strategy_review_frequency_target_documents ? data.strategy_review_frequency_target_documents : [],
          });
  }

  setDocuments(documents){
    let khDocuments = [];
    documents.forEach(element => {

      if(element.document_id){
        element.kh_document.versions.forEach(innerElement => {

          if(innerElement.is_latest){
            khDocuments.push({
              ...innerElement,
              title:element?.kh_document.title,
              'is_kh_document':true
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId':element.id,
              ...innerElement
              
            })
          }

        });
      }
      else
      {
        if (element && element.token) {
          var purl = this._reviewService.getThumbnailPreview('kpi-measure', element.token)
          var lDetails = {
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            'is_kh_document':false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)

      }

    });
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments=[...fileUploadPopupStore.getKHFiles,...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  objectiveData(){
    let objectiveData = {
      id : this.objectiveMesureSource.value.id,
      actual_value : this.form.value.actual_value ? this.form.value.actual_value : 0,
      justification : this.form.value.justification ? this.form.value.justification : '',
      documents : this.objectiveMesureSource.type == "Edit" ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles,'save') 

    }
    return objectiveData
  }

  proccessData(){
    let saveData =  {
      strategy_profile_objective_id : StrategyStore.objectiveId,
      review_frequencies : this.objectiveDataArray ? this.objectiveDataArray :  [],
    }
    return  saveData
  }

  save(close : Boolean = false){      
    let save 
    this.objectiveDataArray.push(this.objectiveData())
    AppStore.enableLoading();

    save = this._objectiveService.updateScore(this.proccessData())
      
      save.subscribe(res=>{
        this.objectiveDataArray =[]
        this.resetForm();
         this.clearFIleUploadPopupData()
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if(close) this.cancel();
      }, (err: HttpErrorResponse) => {
        if (err.status == 422) {
          this.objectiveDataArray = [];
          this.formErrors = err.error.errors;
          this.processFormErrors()
        }
          else if(err.status == 500 || err.status == 403){
            this.objectiveDataArray = [];
           this.cancel();;
          }
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
        
      });
      // if(this.focusForm.valid){
      //   let focusObject = {id: StrategyDemoStore.strategyFocusAreas.length+1, title: this.focusForm.value.focus_area, weightage: this.focusForm.value.weightage };
      //   StrategyDemoStore.strategyFocusAreas.push(focusObject);
       
      // }
    }

    clearFIleUploadPopupData(){
      fileUploadPopupStore.clearFilesToDisplay();
      fileUploadPopupStore.clearKHFiles();
      fileUploadPopupStore.clearSystemFiles();
      fileUploadPopupStore._updateArray=[];
    }

    processFormErrors(){
      var errors = this.formErrors;
      for (var key in errors) {
        if (errors.hasOwnProperty(key)) {
          if(key.startsWith('review_frequencies.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['review_frequencies'] = this.formErrors['review_frequencies']? this.formErrors['review_frequencies'] + errors[key] + '('+(errorPosition )+')': errors[key]+ (errorPosition );
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    }

    resetForm(){
      this.form.reset();
    }

    ngOnDestroy(){
      this.fileUploadPopupSubscriptionEvent.unsubscribe();
      this.clearFIleUploadPopupData();  
    }

}
