import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { StrategyReviewService } from 'src/app/core/services/strategy-management/review/strategy-review.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
declare var $: any;

@Component({
  selector: 'app-action-plan-measures-main-edit',
  templateUrl: './action-plan-measures-main-edit.component.html',
  styleUrls: ['./action-plan-measures-main-edit.component.scss']
})
export class ActionPlanMeasuresMainEditComponent implements OnInit {
  @Input('source') actionPlanSource: any;
  @ViewChild('uploadArea',{static:false}) uploadArea: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  planMeasureDataArray = [];
  planMeasureData = {
    "id" : null,
    "title": null,
    "user_actual_value" : null,
    "cost" : null ,
    "actual_end_date" :null,
    "justification" : null,
    "documents" : null
  }
  fileUploadPopupStore = fileUploadPopupStore;
  AppStore = AppStore
  proccesedArray: any = [];
  fileUploadPopupSubscriptionEvent: any;
  selectedIndex: any;
  formErrors: any;

  constructor(private _eventEmitterService: EventEmitterService, private _strategyService : StrategyService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef,private _reviewService : StrategyReviewService,
    private _helperService:HelperServiceService, private _renderer2: Renderer2,private _imageService: ImageServiceService,
    private _documentFileService: DocumentFileService, private _fileUploadPopupService: FileUploadPopupService,) { }

  ngOnInit(): void {
    this.setPlanMesureData(this.actionPlanSource.value.strategy_initiative_milestone_action_plans)

    this.fileUploadPopupSubscriptionEvent=this._eventEmitterService.fileUploadPopup.subscribe(res=>{
      this.enableScrollbar();
      this.closeFileUploadModal();
    })
  }

  enableScrollbar(){
    if(fileUploadPopupStore.displayFiles.length >= 3 ){
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else{
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  setPlanMesureData(data){
    for(let i of data){
      this.planMeasureData = {
        id : i.id,
        title : i.title,
       user_actual_value : i.user_actual_value ? i.user_actual_value : null,
       cost : i.cost ? i.cost  : null,
       actual_end_date : i.actual_end_date ?  this._helperService.processDate(i.actual_end_date,'split') : null,
       justification : i.justification ? i.justification : null,
       documents : null
      }
      if(i.strategy_initiative_milestone_action_plan_documents){
       this.setDocuments(i.strategy_initiative_milestone_action_plan_documents)
      }
      this.planMeasureData.documents = fileUploadPopupStore.displayFiles
      this.planMeasureDataArray.push(this.planMeasureData)
      this.clearFIleUploadPopupData()

    }

   
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

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  } 
  
  openFileUploadModal(index) {
    this.selectedIndex = index
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
     this.planMeasureDataArray[this.selectedIndex].documents = fileUploadPopupStore.displayFiles
    this.clearFIleUploadPopupData()
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
  checkExtension(ext, extType) {
    var res = this._imageService.checkFileExtensions(ext, extType);
    return res;
  }
  
  createImageUrl(type,token) {
    return this._documentFileService.getThumbnailPreview(type, token);
  }
  
  clearFIleUploadPopupData(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore._updateArray=[];
  }

  processData(){
    let obj = {
      id: this.actionPlanSource.id,
      action_plans : []
    }

    for(let data of this.planMeasureDataArray){
      let inuptObj = {
        id : data.id,
        achieved_value : data.user_actual_value,
        justification :  data.justification,
        cost : data.cost,
        actual_end_date : this._helperService.processDate(data.actual_end_date,'join'),
        documents : this._helperService.sortFileuploadData(data.documents,'save'),
      }
      obj.action_plans.push(inuptObj)
    }
    this.proccesedArray.push(obj)
  }

  save(close: boolean = false){
    let save 
    this.processData()
    let mainObj ={
      strategy_initiative_milestones : this.proccesedArray
    }
    AppStore.enableLoading();
       
    save = this._reviewService.savePlanMesure(mainObj)
    save.subscribe(res=>{
      // this.kpiDataArray = []
  
      this.setPlanMesureData(this.actionPlanSource.value.strategy_initiative_milestone_action_plans);
      // this.dataInputArray = [];
      //  this.proccesedArray =[]
      // this.resetForm();
      this.clearFIleUploadPopupData()
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if(close) this.cancel();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        // this.kpiDataArray = [];
        // this.dataInputArray = []
        this.formErrors = err.error.errors;
        // console.log("error",this.formErrors.strategy_initiative_milestones.0.action_plans.0.achieved_value)
      }
        else if(err.status == 500 || err.status == 403){
          // this.kpiDataArray = [];
          // this.dataInputArray = [];
          //  this.proccesedArray =[]
         this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    });
  }

  cancel(){
    this._eventEmitterService.dismissAddPlanMeasureModal();
    // this.focusAreaMasterSubscription.unsubscribe();
  }

}
