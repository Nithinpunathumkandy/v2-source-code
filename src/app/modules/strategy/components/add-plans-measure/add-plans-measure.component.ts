import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ActionPlansService } from 'src/app/core/services/strategy-management/action-plans/action-plans.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { StrategyReviewStore } from 'src/app/stores/strategy-management/review.store';
declare var $: any;
@Component({
  selector: 'app-add-plans-measure',
  templateUrl: './add-plans-measure.component.html',
  styleUrls: ['./add-plans-measure.component.scss']
})
export class AddPlansMeasureComponent implements OnInit {
  @Input('source') planMeasureSource: any;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  fileUploadPopupStore = fileUploadPopupStore
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  AppStore = AppStore
  form :FormGroup;
  formErrors: any;
  mesureDataArray: any = [];
  planDataArray: any = [];
  fileUploadPopupSubscriptionEvent: any;


  constructor(private _eventEmitterService: EventEmitterService,private _formBuilder : FormBuilder,
    private _reviewService : StrategyReviewService,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,private _helperService:HelperServiceService,
    private _documentFileService: DocumentFileService,
    private _imageService: ImageServiceService,private _actionPlansService : ActionPlansService,
    private _renderer2: Renderer2,private _fileUploadPopupService: FileUploadPopupService,

    ) { }

  ngOnInit(): void {

    this.fileUploadPopupSubscriptionEvent=this._eventEmitterService.fileUploadPopup.subscribe(res=>{
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
    this.form =  this._formBuilder.group({
      id:null,
      achieved_value : [null,[Validators.required]],
      justification : '',
      cost : [null,[Validators.required]],
      actual_end_date : [null,[Validators.required]],
      documents : [],
    })

    this.editData()
  }

  mesureData(){
    let obj = {
      // id :  this.planMeasureSource.value.id,
      achieved_value : this.form.value.achieved_value ? this.form.value.achieved_value : null,
      justification : this.form.value.justification ? this.form.value.justification : '',
      cost : this.form.value.cost ? this.form.value.cost  :  null,
      actual_end_date : this.form.value.actual_end_date ? this._helperService.processDate(this.form.value.actual_end_date,'join') : '' ,
      documents : this.planMeasureSource.type == 'Edit' ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray,fileUploadPopupStore.getKHFiles,fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(fileUploadPopupStore.displayFiles,'save')
    }
    return obj
  }
  
  planData(){
    this.mesureData();
    let  obj = {
      id : StrategyReviewStore.selectedMilestoneId ,
      action_plans : this.mesureDataArray ? this.mesureDataArray : []
    }
    this.planDataArray.push(obj)
  }

  processData(){
  let saveData = {
    strategy_initiative_milestones : this.planDataArray ? this.planDataArray : []
  }
  return saveData
  }

  editData(){
    this.form.patchValue({
      achieved_value : this.planMeasureSource.value.user_actual_value ? this.planMeasureSource.value.user_actual_value  : null,
      justification : this.planMeasureSource.value.justification ? this.planMeasureSource.value.justification : '',
      cost : this.planMeasureSource.value.cost ? this.planMeasureSource.value.cost : null,
      actual_end_date : this.planMeasureSource.value.actual_end_date ? this._helperService.processDate(this.planMeasureSource.value.actual_end_date,'split') : null,
    })

    var kpiDocumentDetails = this.planMeasureSource.value.strategy_initiative_action_plan_documents ? this.planMeasureSource.value.strategy_initiative_action_plan_documents : [];
          if(kpiDocumentDetails.length > 0){
            this.setDocuments(kpiDocumentDetails)
          }
  }
  
  save(close: boolean = false){
    let save 
    this.planData();
    AppStore.enableLoading();
   
      save = this._actionPlansService.updateActionPlanMeasure(this.planMeasureSource.value.id,this.mesureData())
    
    save.subscribe(res=>{
     
      this.resetForm();
      this.clearFIleUploadPopupData()
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if(close) this.cancel();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
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

    enableScrollbar(){
      if(fileUploadPopupStore.displayFiles.length >= 3 ){
        $(this.uploadArea.nativeElement).mCustomScrollbar();
      }
      else{
        $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
      }
    }

    getButtonText(text){
      return this._helperService.translateToUserLanguage(text);
    } 

    clearFIleUploadPopupData(){
      fileUploadPopupStore.clearFilesToDisplay();
      fileUploadPopupStore.clearKHFiles();
      fileUploadPopupStore.clearSystemFiles();
      fileUploadPopupStore._updateArray=[];
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
            var purl = this._reviewService.getThumbnailPreview('plan-measure', element.token)
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
      console.log(submitedDocuments)
      fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    }
  


  resetForm(){
    this.form.reset();
  }
  cancel(){
    this._eventEmitterService.dismissplnMesureModal()
  }
  ngOnDestroy(){
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.clearFIleUploadPopupData();
    this.mesureDataArray = [],
    this.planDataArray = []
  }

}
