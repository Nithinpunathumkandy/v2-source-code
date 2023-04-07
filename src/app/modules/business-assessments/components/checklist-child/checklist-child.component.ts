import { Component, OnInit, Input, ChangeDetectorRef, ElementRef, ViewChild, Renderer2 } from '@angular/core';
import { AssessmentsService } from 'src/app/core/services/business-assessments/assessments.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AssessmentsStore } from 'src/app/stores/business-assessments/assessments/assessments.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppStore } from 'src/app/stores/app.store';
import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { BusinessAssessmentService } from 'src/app/core/services/business-assessments/business-assessment-service/business-assessment.service';
import { FrameworksStore } from 'src/app/stores/business-assessments/frameworks.store';
import { DomSanitizer } from '@angular/platform-browser';
import { BAActionPlanStore } from 'src/app/stores/business-assessments/assessments/assessment-action-plan.store';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
declare var $: any;

@Component({
  selector: 'app-checklist-child',
  templateUrl: './checklist-child.component.html',
  styleUrls: ['./checklist-child.component.scss']
})
export class ChecklistChildComponent implements OnInit {
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('actionPlanModal') actionPlanModal: ElementRef;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @Input() childData
  form: FormGroup;
  formErrors: any;
  AssessmentsStore = AssessmentsStore;
  FrameworksStore = FrameworksStore;
  BAActionPlanStore=BAActionPlanStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  AppStore = AppStore;
  selectedFramework = null;
  frameworkOptions = null;
  checklistArray = [];
  innerIndex = [];
  fileUploadsArray: any = []; // Display Mutitle File Loaders
  fileUploadProgress = 0;
  checklistIndex = [];

  openActionPlanPopup:boolean=false;
  actionPlanFormSubscription:any;
  // Document Index
  documentIndex=null;
  // checklistIndex=null;

  actionPlanData={
    values:null,
    type:'checklist-edit',
    component:'checklist-child',
    dataSet:false,
  }

  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    file_name: "",
    file_type: "",
    size: null
  };
  docClauseNumber: any;
  currentChecklist: any;
  fileUploadPopupSubscriptionEvent:any;
  constructor(private _assessmentsService: AssessmentsService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _formBuilder: FormBuilder,
    private _imageService: ImageServiceService,
    private _helperService: HelperServiceService,
    private _businessAssessmentService: BusinessAssessmentService,
    private _renderer2: Renderer2,
    private _sanitizer: DomSanitizer,
    private _eventEmitterService: EventEmitterService,
    private _fileUploadPopupService:FileUploadPopupService,
    private _documentFileService: DocumentFileService,
    private _humanCpitalService: HumanCapitalService
    ) { }

  ngOnInit(): void {
    this.checklistIndex[AssessmentsStore.currentIndex] = [];
    this.form = this._formBuilder.group({
      business_assessment_id: [null],
      document_version_content_id: [null, [Validators.required]],
      checklist_id: [null, [Validators.required]],
      business_assessment_framework_option_id: [null],
      comment: [''],
      external_comment:[''],
      actions:[''],
      documents: [[]]
    });

    this.actionPlanFormSubscription=this._eventEmitterService.businessAssessmentChildActionPlanForm.subscribe(clause_index=>{
      if(clause_index==this.currentChecklist){
        this.closeActionPlanForm()
      }

    })

    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.enableScrollbar();
      this.closeFileUploadModal();
    })


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
    // this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }


  enableScrollbar() {
    if (fileUploadPopupStore.displayFiles.length >= 3) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
  }


  getChecklist(docData) {
    this.docClauseNumber=docData.clause_number
    // BAActionPlanStore.documentClauseNumber=docData.clause_number
    this._assessmentsService.getChecklist(AssessmentsStore.assessmentId, docData.document_version_content_id).subscribe(res => {
      this.checklistArray[docData.clause_number] = { clause_number: docData.clause_number, checklist: res?.checklist, child: res?.children };
      setTimeout(() => {
        if (this.innerIndex[docData.clause_number] != docData.clause_number)
          this.innerIndex[docData.clause_number] = docData.clause_number;
        else
          this.innerIndex[docData.clause_number] = null;

        this._utilityService.detectChanges(this._cdr);
      }, 300);
    })
  }


  setFramework(framework, docData, checklistIndex) {
    this.checklistArray[docData.clause_number]['checklist'][checklistIndex].business_assessment_framework_option = framework;
    this.selectedFramework = framework.id;
  }

  /**
* removing document file from the selected list
* @param token -image token
*/
  // removeDocument(token) {
  //   AssessmentsStore.unsetChecklistImageDetails('support-file', token);
  //   this.checkForFileUploadsScrollbar();
  //   this._utilityService.detectChanges(this._cdr);
  // }

  /**
 * Returns whether file extension is of imgage, pdf, document or etc..
 * @param ext File extension
 * @param extType Type - image,pdf,doc etc..
 */
  checkExtension(extType, ext?) {
    var res = this._imageService.checkFileExtensions(ext ? ext : this.AssessmentsStore.individualAssessmentDetails.document_version.ext, extType);
    return res;
  }

  saveChecklist(checklist, docData, checklistIndex,docIndex) {
    this.selectedFramework = this.checklistArray[docData.clause_number]['checklist'][checklistIndex].business_assessment_framework_option?.id;
    this.formErrors = null;
    AppStore.enableLoading();
    let updateArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getUpdateArray)
    let khFilesArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getKHFiles)
    let systemFilesArray=this.documentUpdateFn(checklist.id,fileUploadPopupStore.getSystemFile)

  
    // let docArray = [];
    // let finalDocArray = [];
    // docArray = this._assessmentsService.getDocuments();
    // for (let j of docArray) {
    //   if (j.clause_number == docData.clause_number && j.checklist_id == checklist.checklist.id) {
    //     finalDocArray.push(j);
    //   }
    // }
    this.form.patchValue({
      business_assessment_id: checklist.business_assessment?.id ? checklist.business_assessment.id : null,
      document_version_content_id: docData.document_version_content_id ? docData.document_version_content_id : null,
      checklist_id: checklist.checklist?.id ? checklist.checklist?.id : null,
      business_assessment_framework_option_id: this.selectedFramework,
      comment: checklist.comment,
      external_comment:checklist.external_comment,
      actions: checklist.actions,
      documents: this._helperService.compareEditDataWithSelectedData(updateArray,khFilesArray,systemFilesArray)
    })
    this._assessmentsService.updateChecklist(this.form.value, checklist.id).subscribe((res: any) => {

      this._utilityService.detectChanges(this._cdr);
      setTimeout(() => {

        this._assessmentsService.getChecklist(AssessmentsStore.assessmentId, docData.document_version_content_id).subscribe(response => {
          this._utilityService.detectChanges(this._cdr);
          this.checklistArray[docData.clause_number] = { clause_number: docData.clause_number, checklist: response?.checklist, child: response?.children };
          setTimeout(() => {
            AssessmentsStore.clearChecklistDocuments();
            // this.getDocArray(response?.checklist[checklistIndex], docData.clause_number, response?.checklist[checklistIndex].checklist.id);

            this.checklistIndex[docData.clause_number] = response?.checklist[checklistIndex].checklist.id;
            this.getScore(docData.clause_number,docIndex,true);
            this.isCompleted(docData.clause_number,docIndex);
          }, 100);
        })
      }, 100);
      AppStore.disableLoading();
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
      }
      
    });
    this._utilityService.detectChanges(this._cdr);
  }

  // getDocArray(res, clause_number, id, save: boolean = false) {
  //   if (res?.documents && res?.documents.length > 0) {
  //     for (let i of res.documents) {
  //       let docurl = this._businessAssessmentService.getThumbnailPreview('checklist-document', i.token);
  //       let docDetails = {
  //         name: i.title,
  //         ext: i.ext,
  //         size: i.size,
  //         url: i.url,
  //         thumbnail_url: i.url,
  //         token: i.token,
  //         preview: docurl,
  //         id: i.id,
  //         business_assessment_document_content_checklist_id: i.business_assessment_document_content_checklist_id
  //       };
  //       this._assessmentsService.setImageDetails(docDetails, docurl, 'checklist-document', clause_number, id);
  //     }
  //     for (let i = 0; i < AssessmentsStore.getDocumentDetails.length; i++) {
  //       if (save) {
  //         if ((AssessmentsStore.getDocumentDetails[i].is_deleted) && AssessmentsStore.getDocumentDetails[i]['clause_number'] == clause_number && AssessmentsStore.getDocumentDetails[i]['checklist_id'] == id) {
  //           AssessmentsStore.getDocumentDetails.splice(i, 1);
  //         }
  //       }
  //       else {
  //         if ((AssessmentsStore.getDocumentDetails[i].is_new || AssessmentsStore.getDocumentDetails[i].is_deleted) && AssessmentsStore.getDocumentDetails[i]['clause_number'] == clause_number && AssessmentsStore.getDocumentDetails[i]['checklist_id'] == id) {
  //           AssessmentsStore.getDocumentDetails.splice(i, 1);
  //         }
  //       }
  //     }
  //     this.checkForFileUploadsScrollbar();
  //     this._utilityService.detectChanges(this._cdr);
  //   }
  // }

  documentUpdateFn(id,docs){
    let updateData=[]
    docs.forEach(element => {
      if(element.verificationId==id){        
        updateData.push(element)          
        }
    });    
    return updateData
  }

  getScore(clause_number,docIndex,save?) {
    let count = 0;
    let checklistScore = 0;
    let childScore = 0;
    let totalScore = 0;
    for (let i of this.checklistArray[clause_number].checklist) {
      if(i.score!=null && i.is_applicable == 1){
        checklistScore = checklistScore + parseInt(i.score);
        count = count + 1
      }
    }
    if(this.checklistArray[clause_number].child.length>0){
      for (let k of this.checklistArray[clause_number].child) {
        if(k.score!=null){
          childScore = childScore + parseInt(k.score);
          count = count + 1;
        }   
       
      }
    }
    if (checklistScore > 0 || childScore>0) {
      totalScore = checklistScore + childScore;
      if(save){
        this.childData[docIndex].score = totalScore / count;
      }
      
      return Math.round(totalScore / count);
    }

  }

  isCompleted(clause_number,index){
    let count=0
    if(this.checklistArray[clause_number]?.checklist.length>0){
      for (let i of this.checklistArray[clause_number]?.checklist) {
        if(i.answer==null ){
          count = count + 1;
        }
    }
    }
  
    if(this.checklistArray[clause_number]?.child.length>0){
      for (let k of this.checklistArray[clause_number].child) {
        if(k.is_completed!=1){
          count = count + 1;
        }   
      }
    }
    if(count == 0){
      this.childData[index].is_completed = 1
      // return true;
    }
  }

  viewDocument(type, documents, checklist) {
    switch (type) {
      case "checklist-document":
        this._businessAssessmentService
          .getFilePreview(type, checklist.id, documents.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              documents.title
            );
            this.openPreviewModal(resp, documents, checklist);
          }),
          (error) => {
            if (error.status == 403) {
              this._utilityService.showErrorMessage(
                "Error",
                "Permission Denied"
              );
            } else {
              this._utilityService.showErrorMessage(
                "Error",
                "Unable to generate Preview"
              );
            }
          };
        break;
    }
  }

  /**
   * opening the preview model
   * @param filePreview -get response of file preview
   * @param itemDetails -certificate details
   */
  openPreviewModal(filePreview, document, checklist) {

    let previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
    this.previewObject.component = 'checklist-document';
    this.previewObject.componentId = checklist.id;
    this.previewObject.file_details = document;
    this.previewObject.file_name = document.name;
    this.previewObject.file_type = document.ext;
    this.previewObject.preview_url = previewItem;
    this.previewObject.size = document.size;
    this.previewObject.uploaded_user = checklist.updated_by.length > 0 ? checklist.updated_by : checklist.created_by;
    this.previewObject.created_at = checklist.created_at;
    $(this.filePreviewModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }

  // Closes from preview
  closePreviewModal(event) {
    $(this.filePreviewModal.nativeElement).modal("hide");
    this.previewObject.component = "";
    this.previewObject.preview_url = "";
    this.previewObject.uploaded_user = null;
    this.previewObject.created_at = "";
    this.previewObject.file_details = null;
    this.previewObject.componentId = null;
    this.previewObject.file_name = "";
    this.previewObject.file_type = "";
    this.previewObject.size = null;
  }

  downloadFile(checklist, document) {
    this._businessAssessmentService.downloadFile('checklist-document', checklist.id, document.id, document.name, document);
  }

  onFileChange(event, type: string, clause_number, id) {
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type);
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          AssessmentsStore.document_preview_available = true;
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
                let temp: any = uploadEvent['body'];
                temp['is_new'] = true;
                this.assignFileUploadProgress(null, file, true);
                this._imageService.getPreviewUrl(temp.thumbnail_url).subscribe(prew => {
                  AssessmentsStore.document_preview_available = false;
                  this.createImageFromBlob(prew, temp, type, clause_number, id);
                }, (error) => {
                  AssessmentsStore.document_preview_available = false;
                  this.assignFileUploadProgress(null, file, true);
                  this._utilityService.detectChanges(this._cdr);
                })
            }
          }, (error) => {
            this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
            AssessmentsStore.document_preview_available = false;
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

  /**
  * 
  * @param progress File Upload Progress
  * @param file Selected File
  * @param success Boolean value whether file upload success 
  */
  assignFileUploadProgress(progress, file, success = false) {
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  /**
   * 
   * @param files Selected files array
   * @param type type of selected files - logo or brochure
   */
  addItemsToFileUploadProgressArray(files, type) {
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  createImageFromBlob(image: Blob, imageDetails, type, clause_number, id) {
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;
      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._assessmentsService.setImageDetails(imageDetails, logo_url, type, clause_number, id);
      else
        this._assessmentsService.setSelectedImageDetails(logo_url, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);
    if (image) {
      reader.readAsDataURL(image);
    }
  }

  checkForFileUploadsScrollbar() {
    if (AssessmentsStore.getDocumentDetails.length >= 5 || this.fileUploadsArray.length > 5) {
      $(this.uploadArea?.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea?.nativeElement).mCustomScrollbar("destroy");
    }
  }

  getCurrentCheckList(index,checklist, clause_number) {
    this.currentChecklist=index
    setTimeout(() => {
      if (this.checklistIndex[clause_number] == checklist.id) {
        this.checklistIndex[clause_number] = null;
      }
      else {
        this.checklistIndex[clause_number] = checklist.id;
      }
      this._utilityService.detectChanges(this._cdr);
    }, 100);
    let pos=fileUploadPopupStore.displayFiles.findIndex(e=>e.verificationId==checklist.id);
    if(pos==-1)
    this.setDocuments(checklist?.documents,checklist.id)
    // this.getDocArray(checklist, clause_number, checklist.checklist.id, true)
    this._utilityService.detectChanges(this._cdr);
  }

  // Action Plan Form Code Starts Here

  openActionPlanForm(){
    this.openActionPlanPopup=true
    this.actionPlanData['clause_index']=this.currentChecklist
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '99999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'block'); // For Modal to Get Focus
    $(this.actionPlanModal.nativeElement).modal('show');
    this._utilityService.detectChanges(this._cdr);

  }

  closeActionPlanForm(){
    this.setActionPlanData()
    this.openActionPlanPopup=false;
    $(this.actionPlanModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'z-index', '9999'); // For Modal to Get Focus
    this._renderer2.setStyle(this.actionPlanModal.nativeElement, 'display', 'none'); // For Modal to Get Focus
    $('.modal-backdrop').remove();

  }

  setActionPlanData(){
  // Setting action plan data from modal , and mapping to required format to send to API and for displaying data.
  // Handling add and edit separately to compare avoid duplicatio when editing.

    if(BAActionPlanStore.formType=='add'){
      let actionsArray=[
        ...this.checklistArray[this.docClauseNumber]['checklist'][this.currentChecklist]['actions'],
        ...BAActionPlanStore._displayData
      ]
      actionsArray.map(item=>{
        item.responsible_user_ids=[item.responsible_users.id],
        item.start_date = this._helperService.processDate( item.start_date, 'join'),
        item.target_date=this._helperService.processDate( item.target_date, 'join');
        item.accordionActive=false;
      })
      
      this.checklistArray[this.docClauseNumber]['checklist'][this.currentChecklist]['actions']=actionsArray

       // Showing success message if there is any data in displaydata array.
       if (BAActionPlanStore._displayData.length > 0)
       this._utilityService.showSuccessMessage('success', 'actionplan_updated');
    }

    // In edit case filtering out the data and showing only required action plans.
    else{
      
      let actionsArray=[
        ...this.filteredArray(),
        ...BAActionPlanStore._displayData
      ]
      actionsArray.map(item=>{
        item.responsible_user_ids=[item.responsible_users.id],
        item.start_date = this._helperService.processDate( item.start_date, 'join'),
        item.target_date=this._helperService.processDate( item.target_date, 'join');
        item.accordionActive=false;
      })
      this.checklistArray[this.docClauseNumber]['checklist'][this.currentChecklist]['actions']=actionsArray
      
       // Showing success message if there is any data in displaydata array.
       if (BAActionPlanStore._displayData.length > 0)
       this._utilityService.showSuccessMessage('success', 'actionplan_updated');
    }

    // Unsetting all data after handling all operations.

    this.clearActionPlanData()
  }

  // Comparing responseArray and displayData array and removing the already edited data from responseArray to avoid duplication.
  filteredArray(){

    let responseArray=this.checklistArray[this.docClauseNumber]['checklist'][this.currentChecklist]['actions']
  
   return  responseArray.filter(elementX=>!BAActionPlanStore._displayData.some(elementY=>elementX.id==elementY.id))
    
    
  }

  clearActionPlanData(){
    BAActionPlanStore.unSetDisplayData();
    this.actionPlanData.values=null;
    this.actionPlanData.dataSet=true;
  }


  setActiveAction(actionIndex){

    // Checking with 'accordionActive' property to handle accordion arrows icon.

    let actionData=this.checklistArray[this.docClauseNumber]['checklist'][this.currentChecklist]['actions'][actionIndex]
    if(actionData.accordionActive==true)
    actionData.accordionActive=false
    else
    actionData.accordionActive=true


  }

  editActionPlan(actionPlanData){
    
    // setting type as checklist-edit as we use the same form for submenu edit aswell.

    if(actionPlanData.id)
    this.actionPlanData.type='checklist-edit'
    
    this.actionPlanData.values={
      id:actionPlanData.id,
      title:actionPlanData.title,
      start_date:this._helperService.processDate(actionPlanData.start_date,'split'),
      target_date:this._helperService.processDate(actionPlanData.target_date,'split'),
      responsible_user_id:actionPlanData.responsible_users,
      is_edit:actionPlanData?.is_edit?actionPlanData?.is_edit:false,
      description:actionPlanData.description
    }
   

    this.openActionPlanForm()
  }



getCreatedByPopupDetails(users, created?: string) {
  let userDetial: any = {};
  userDetial['first_name'] = users?.first_name;
  userDetial['last_name'] = users?.last_name;
  userDetial['designation'] = users?.designation;
  userDetial['image_token'] = users?.image?.token;
  userDetial['email'] = users?.email;
  userDetial['mobile'] = users?.mobile;
  userDetial['id'] = users?.id;
  userDetial['department'] = users?.department;
  userDetial['status_id'] = users?.status_id ? users?.status_id : users?.status?.id;
  userDetial['created_at'] = created ? created : null;
  return userDetial;

}


  deleteActionPlan(actionPlanIndex){

    // Checking by index of action plan to be deleted.
    let actionData=this.checklistArray[this.docClauseNumber]['checklist'][this.currentChecklist]['actions']

    // Checking if selected action plan index has 'is_new' object then removing by the position 
    // If not mapping 'is_deleted' property to send to API.

    if(actionData[actionPlanIndex].hasOwnProperty('is_new')){
      actionData.splice(actionPlanIndex,1)
    }else{
      actionData[actionPlanIndex]['is_deleted']=true;
    }
  }

  

  setDocuments(documents,id?) {

    let khDocuments = [];
    documents.forEach(element => {
      if (element.document_id) {
        element?.kh_document?.versions?.forEach(innerElement => {

          if (innerElement.is_latest) {
            khDocuments.push({
              ...innerElement,
              'is_kh_document': true,
              verificationId:id
            })
            fileUploadPopupStore.setUpdateFileArray({
              'updateId': element.id,
              verificationId:id,
              ...innerElement

            })
          }

        });
      }
      else {
        if (element && element.token) {
          var purl = this._businessAssessmentService.getThumbnailPreview('checklist-document', element.token)
          var lDetails = {
            created_at: element.created_at,
            created_by: element.created_by,
            updated_at: element.updated_at,
            updated_by: element.updated_by,
            name: element.title,
            ext: element.ext,
            size: element.size,
            url: element.url,
            token: element.token,
            thumbnail_url: element.thumbnail_url,
            preview: purl,
            id: element.id,
            verificationId:id,
            business_assessment_document_content_checklist_id: element.business_assessment_document_content_checklist_id,
            'is_kh_document': false,
          }
        }
        this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
    for(let i of fileUploadPopupStore.getKHFiles){
      khDocuments.push(i)
    }
		fileUploadPopupStore.setKHFile(khDocuments)
		let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
		fileUploadPopupStore.setFilestoDisplay(submitedDocuments);

  }

  
  createImageUrl(token, type?) {
    if (type == 'document-version') {
      return this._documentFileService.getThumbnailPreview(type, token);
    }
    else
      return this._humanCpitalService.getThumbnailPreview('user-profile-picture', token);
  }


  // document upload
  openFileUploadModal(id) {
 
    fileUploadPopupStore.verificationId=id
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

  clearFIleUploadPopupData() {
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
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

  

  // Action Plan Form Code Ends here

  ngOnDestroy() {
    AssessmentsStore.clearChecklistDocuments;
    this.actionPlanFormSubscription.unsubscribe();
    AppStore.loading=false;
  }
}
