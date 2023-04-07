import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { EventChangeRequestService } from 'src/app/core/services/event-monitoring/event-change-request/event-change-request.service';
import { AppStore } from 'src/app/stores/app.store';
import { EventChangeRequestStore } from 'src/app/stores/event-monitoring/events/event-change-request-store';
import { EventsStore } from 'src/app/stores/event-monitoring/events/event.store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { EventFileServiceService } from 'src/app/core/services/event-monitoring/event-file-service/event-file-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { FileUploadPopupService } from 'src/app/core/services/fileUploadPopup/file-upload-popup.service';
import { BudgetStore } from 'src/app/stores/event-monitoring/event-budget-store';
import { EventBudgetService } from 'src/app/core/services/event-monitoring/event-budget/event-budget.service';
declare var $:any;

@Component({
  selector: 'app-edit-event-budget-change-request',
  templateUrl: './edit-event-budget-change-request.component.html',
  styleUrls: ['./edit-event-budget-change-request.component.scss']
})
export class EditEventBudgetChangeRequestComponent implements OnInit, OnDestroy {
  @Input('source') eventChangeRequestSource: any;
  @ViewChild('fileUploadModal', { static: false }) fileUploadModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('budget', {static: true}) budget: ElementRef;
  EventsStore = EventsStore;
  EventChangeRequestStore=EventChangeRequestStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  fileUploadPopupStore = fileUploadPopupStore;
  BudgetStore=BudgetStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  form: FormGroup;
  formErrors :any;
  fileUploadType;
  fileUploadPopupSubscriptionEvent: any;
  eventBudgetEventSubscrion:any;
  popupControlEventSubscription:any;
  editFlag:boolean=false;
  budgetFiles=[];
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: '',
    event_type:''
  };
  budgetObject = {
    id : null,
    type : null,
    value : null
  }
  constructor( private _renderer2: Renderer2,
    private _utilityService: UtilityService, private _formBuilder: FormBuilder,
    private _cdr: ChangeDetectorRef,
    private _imageService: ImageServiceService, private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _documentFileService: DocumentFileService, private _eventChangeRequestService: EventChangeRequestService,
    private _fileUploadPopupService: FileUploadPopupService, private _eventBudgetService : EventBudgetService,
    private _eventFileService: EventFileServiceService) { }

  ngOnInit(): void {
    EventChangeRequestStore.unSetBudgets();
    this.form = this._formBuilder.group({
      justification_event_budget:['',[Validators.required]],
    });
    this.fileUploadPopupSubscriptionEvent = this._eventEmitterService.fileUploadPopup.subscribe(res => {
      this.closeFileUploadModal();
    });
    this.eventBudgetEventSubscrion = this._eventEmitterService.EventChangeReqProjectBudgetModal.subscribe(item => {
      this.closeNewBudget()
    });
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.getBudgets();
    this.setEditDataforBudget();
  }
  cancel(){
    this.form.reset();
    this._eventEmitterService.dismissEventChangeReqEventBudgetModal();
  }
  getBudgets(){
    this._eventBudgetService.getItems().subscribe(res=>{
      if(EventChangeRequestStore.individualChangeRequestItem?.event_budget?.length == 0){
      this.populateBudget()
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  populateBudget(){
    if(BudgetStore.allItems.length > 0){
      for(let data of BudgetStore.allItems){
        let obj = {
          year : data.year,
          amount : data.amount,
          newAmount : 0,
          status: 'existing'
        }
        EventChangeRequestStore.setBudgets(obj)
      }
      this._utilityService.detectChanges(this._cdr);

    }
  }


  setEditDataforBudget(){
    if(EventChangeRequestStore.individualChangeRequestItem?.event_budget?.length > 0){
      this.editFlag=true;
      for(let data of EventChangeRequestStore.individualChangeRequestItem.event_budget){
          let obj = {
            year : data.year,
            amount : data.existing_amount,
            newAmount : data.new_amount,
            type : data.is_deleted?'deleted' :  data.type,
            status: EventChangeRequestStore.individualChangeRequestItem.event.event_budgets.findIndex(e=>e.year == data.year) != -1 ? 'existing' : 'cr'
          }
          EventChangeRequestStore.setBudgets(obj)
      }
      this.form.patchValue({
        justification_event_budget:EventChangeRequestStore.individualChangeRequestItem.event_budget[0].justification ? EventChangeRequestStore.individualChangeRequestItem.event_budget[0].justification : ''
      }) 
      let budgetItemsCount = EventChangeRequestStore.individualChangeRequestItem.event_budget.length;
      // this.budgetFiles = EventChangeRequestStore.individualChangeRequestItem.event_budget[budgetItemsCount -1].documents;

      if(budgetItemsCount > 0 && EventChangeRequestStore?.individualChangeRequestItem?.event_budget[budgetItemsCount -1].documents?.length > 0){
        this.budgetFiles = this.setDocuments(EventChangeRequestStore?.individualChangeRequestItem?.event_budget[budgetItemsCount -1].documents,'event-budget',true);
      }
      else{
        this.budgetFiles = [];
      }
      this._utilityService.detectChanges(this._cdr);
    }
  }

  openFileUploadModal(type) {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = true;
      this.fileUploadType = type;
      this.setorUsetFiles(true,type);
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

  setorUsetFiles(setOrUnset,type){
    if(setOrUnset){
      this.clearAttachments();
      this.processDocuments(this.budgetFiles,'event-budget');
    }
    else this.clearAttachments()
  }

  clearAttachments(){
    //document clear
		fileUploadPopupStore.clearFilesToDisplay();
		fileUploadPopupStore.clearKHFiles();
		fileUploadPopupStore.clearSystemFiles();
		fileUploadPopupStore.clearUpdateFiles();
  }

  processDocuments(documents,type){
    this.clearAttachments()
		let khDocuments = [];
    let systemFiles = [];
    documents.forEach(element=>{
      // if(!element.is_deleted){
        if(element.document_id || element.is_kh_document){
          khDocuments.push({
            ...element,
            'is_kh_document': true,
          })
          fileUploadPopupStore.setUpdateFileArray({
            'updateId': element.id,
            ...element
          })
        }
        else{
          if (element && element.token) {
            var purl = '';
            if(element.is_new){
              purl = element.preview;
            }
            else{
              purl = this._eventFileService.getThumbnailPreview(type, element.token);
            }
            var lDetails = {
              title: element.title ? element.title : element.name,
              name: element.title ? element.title : element.name,
              ext: element.ext,
              size: element.size,
              url: element.url,
              token: element.token,
              thumbnail_url: element.thumbnail_url,
              preview: purl,
              id: element.id,
              'is_kh_document': false,
            }
            if(element.is_new) lDetails['is_new'] = true;
            systemFiles.push(lDetails);
            this._fileUploadPopupService.setSystemFile(lDetails, purl)
          }
        }
      // }
    })
    fileUploadPopupStore.setKHFile(khDocuments)
    let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
    fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
  }

  createImageUrl(type, token) {
    if (type == 'document-version')
      return this._documentFileService.getThumbnailPreview(type, token);
    // else
      // return this._incidentFileService.getThumbnailPreview(type, token);
  }

  checkAcceptFileTypes(type) {
    return this._imageService.getAcceptFileTypes(type);
  }

  // extension check function
  checkExtension(ext, extType) {
    return this._imageService.checkFileExtensions(ext, extType)
  }

  removeDocument(doc,type) {
    let dpos = this.budgetFiles.findIndex(e =>e.token == doc.token);
    this.budgetFiles.splice(dpos,1);
    this._utilityService.detectChanges(this._cdr);
  }

  closeFileUploadModal() {
    setTimeout(() => {
      fileUploadPopupStore.openPopup = false;
      
      switch(this.fileUploadType){
        case 'budget': this.budgetFiles = fileUploadPopupStore.displayFiles;
                          break;
      }
      document.body.classList.remove('modal-open')
      this._renderer2.setStyle(this.fileUploadModal.nativeElement, 'display', 'none');
      this._renderer2.setAttribute(this.fileUploadModal.nativeElement, 'aria-hidden', 'true');
      $('.modal-backdrop').remove();
      setTimeout(() => {
        this.clearAttachments()
        this.fileUploadType = ''
        this._renderer2.removeClass(this.fileUploadModal.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 200);
    }, 100);
  }
  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }
  getBudgetData(){
    let data = []
   if(EventChangeRequestStore.budgets.length > 0) {
     for(let amt of EventChangeRequestStore.budgets){
      //  if(amt.type != 'deleted'){
        let pos = BudgetStore.allItems.findIndex(e=>e.year ==  amt.year)
        let obj
        if(pos != -1){
          if(amt.type != 'deleted'){
            obj = {
              year : amt.year,
              new_amount : amt.newAmount,
              existing_amount :  BudgetStore.allItems[pos].amount
             }
          }
          else{
            obj = {
              year : amt.year,
              new_amount : BudgetStore.allItems[pos].amount,
              existing_amount :  BudgetStore.allItems[pos].amount,
              is_deleted:1
             }
          }
         }else {
           if(amt.type != 'deleted'){
            obj = {
              year : amt.year,
              new_amount : amt.newAmount,
              existing_amount : 0
             }
           }
           else{
            obj = {
              year : amt.year,
              new_amount : amt.newAmount,
              existing_amount : 0,
              is_deleted: 1
             }
           }
          
         }
         
         data.push(obj)
      //  }
      
     }
   }
   return data
  }

  save(close: boolean = false)
  {
    this.setorUsetFiles(true,'budget');
    AppStore.enableLoading();
    let obj = {
      budgets : this.getBudgetData(),
      justification : this.form.value.justification_event_budget,
      documents:this.editFlag ? this._helperService.compareEditDataWithSelectedData(fileUploadPopupStore.getUpdateArray, fileUploadPopupStore.getKHFiles, fileUploadPopupStore.getSystemFile) : this._helperService.sortFileuploadData(this.budgetFiles, 'save')
    }
    this._eventChangeRequestService.saveBudget(obj,EventChangeRequestStore.selectedCRId).subscribe(res=>{
      AppStore.disableLoading();
      this.cancel();
      this._utilityService.detectChanges(this._cdr); 
    },(err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;}
        else if(err.status == 500 || err.status == 403){
        //  this.cancel();;
        }
        AppStore.disableLoading();
        this._utilityService.detectChanges(this._cdr);
      
    })
  }

  setDocuments(documents,type,setorunset?) {
    this.clearAttachments()
		let khDocuments = [];
    let systemFiles = [];
		documents.forEach(element => {
			if (element.document_id) {
				element.kh_document.versions.forEach(innerElement => {
					if (innerElement.is_latest) {
						khDocuments.push({
							...innerElement,
							'is_kh_document': true,
						})
						fileUploadPopupStore.setUpdateFileArray({
							'updateId': element.id,
							...innerElement
						})
					}
				});
			}
			else {
				if (element && element.token) {
					var purl = this._eventFileService.getThumbnailPreview(type, element.token)
					var lDetails = {
            title: element.title ? element.title : element.name,
						name: element.title ? element.title : element.name,
						ext: element.ext,
						size: element.size,
						url: element.url,
						token: element.token,
						thumbnail_url: element.thumbnail_url,
						preview: purl,
						id: element.id,
						'is_kh_document': false,
            // 'verificationId':element.verificationId
					}
          systemFiles.push(lDetails);
				}
				if(!setorunset) this._fileUploadPopupService.setSystemFile(lDetails, purl)
			}
		});
    if(!setorunset){
      fileUploadPopupStore.setKHFile(khDocuments)
      let submitedDocuments = [...fileUploadPopupStore.getKHFiles, ...fileUploadPopupStore.getSystemFile]
      fileUploadPopupStore.setFilestoDisplay(submitedDocuments);
    }
    else{
      let allDocuments = [...khDocuments, ...systemFiles]
      return allDocuments;
    }
	}

  getNewAmountTotal(){
    let amount = 0
    if(EventChangeRequestStore.budgets.length > 0){
      for(let data of EventChangeRequestStore.budgets){
        if(data.type != 'deleted'){
          amount = amount + Number(data.newAmount)
        }
      }
    }
    return amount
  }

  getExistingTotal(){
    let amount = 0
    // if(EventChangeRequestStore.individualChangeRequestItem?.event_budget.length > 0){
    //   for(let data of EventChangeRequestStore.individualChangeRequestItem?.event_budget){
    //     if(data.type != 'deleted')
    //       amount = amount + Number(data.existing_amount)
    //   }
    // }
    if(EventChangeRequestStore.budgets.length > 0){
      for(let data of EventChangeRequestStore.budgets){
        if(data.type != 'deleted'){
          amount = amount + Number(data.amount)
        }
      }
    }
    return amount
  }

  modalControl(status: boolean) {
    switch (this.popupObject.event_type) {
      case 'budget': this.deleteBudgets(status)
        break;
      case 'Cancel': 
        setTimeout(() => {
          $(this.confirmationPopUp.nativeElement).modal('hide');
        }, 250);
        break;
    }
  }

  deleteBudgets(status){
    //console.log(this.popupObject.id)
    if(status && EventChangeRequestStore?.budgets.length > 0 ){
       let pos = EventChangeRequestStore.budgets.findIndex(e=> e.year == this.popupObject?.id?.year);
       //let epos = EventsStore.eventDetails.event_budgets.findIndex(e => e.year == this.popupObject.id.year);
       if(pos != -1 && EventChangeRequestStore.budgets[pos].status=='existing'){
        EventChangeRequestStore.budgets[pos].type = 'deleted';
       }
       else
       {
         
        EventChangeRequestStore.budgets.splice(pos,1);
       }
       //console.log(EventChangeRequestStore.budgets);
       this._utilityService.detectChanges(this._cdr);
    } else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  addBudgets(){
    this.budgetObject.type = 'Add';
    this.openNewBudget();
  }

  openNewBudget(){
    setTimeout(() => {
      $(this.budget.nativeElement).modal('show');
      this._renderer2.setStyle(this.budget.nativeElement,'display','block');
      this._renderer2.setStyle(this.budget.nativeElement,'overflow','auto');
      this._renderer2.setStyle(this.budget.nativeElement,'z-index',99999);
    }, 100);
   
    
  }

  closeNewBudget(){
    setTimeout(() => {
      this.budgetObject.type = null;
      this.budgetObject.value = null;
      $(this.budget.nativeElement).modal('hide');
      this._renderer2.removeClass(this.budget.nativeElement,'show');
      this._renderer2.setStyle(this.budget.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }

  delete(item) {
    if(item.type != ''){
      event.stopPropagation();
      this.popupObject.type = 'are_you_sure';
      this.popupObject.id = item;
      this.popupObject.event_type = 'budget'
      this.popupObject.title = 'are_you_sure';
      this.popupObject.subtitle = '';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
    }
    else{
      let pos = EventChangeRequestStore.budgets.findIndex(e => e.year == item.year);
      if(pos != -1) EventChangeRequestStore.budgets.splice(pos,1);
      this._utilityService.showSuccessMessage('Success!', 'event_budget_delete_message');
    }
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }
  
  ngOnDestroy() {
    this.fileUploadPopupSubscriptionEvent.unsubscribe();
    this.eventBudgetEventSubscrion.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
  }


}
