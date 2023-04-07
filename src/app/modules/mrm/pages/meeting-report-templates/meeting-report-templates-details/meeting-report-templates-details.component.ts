import { HttpErrorResponse, HttpEvent, HttpEventType } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { MeetingPlanFileService } from 'src/app/core/services/mrm/file-service/meeting-plan-file.service';
import { MeetingReportTemplatesService } from 'src/app/core/services/mrm/meeting-report-templates/meeting-report-templates.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MeetingReportTemeplates } from 'src/app/stores/mrm/meeting-report-templates/meeting-report-templates';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';

declare var $: any;
@Component({
  selector: 'app-meeting-report-templates-details',
  templateUrl: './meeting-report-templates-details.component.html',
  styleUrls: ['./meeting-report-templates-details.component.scss']
})
export class MeetingReportTemplatesDetailsComponent implements OnInit,OnDestroy {
  @ViewChild ('formModal',{static:true}) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('uploadArea', { static: false }) uploadArea: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  MeetingReportTemeplates = MeetingReportTemeplates;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;

  fields=[];
  fileUploadsArray = []; //doc
  saveData: any = null;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  reportObject = {
    type:null,
    values: null,
  }

  modalEventSubscription: any;
  deleteEventSubscription: any;

  constructor(
    private _router:Router,
    private _route: ActivatedRoute,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _imageService: ImageServiceService,
    private _helperService:HelperServiceService,
    private _eventEmitterService: EventEmitterService,
    private _meetingPlanFileService: MeetingPlanFileService,
    private _meetingReportTemplatesService:MeetingReportTemplatesService
    ) { }

  ngOnInit(): void {
  
    this._route.params.subscribe(params => {
      // (+) converts string 'id' to a number
      MeetingReportTemeplates.reportTemeplateId = +params['id'];
      this.getTemplateDetails();
    });
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"template",
        path:`/mrm/meeting-report-templates`
      });
    }

    this.reactionDisposer = autorun(() => {
    
      // this.addSubmenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
      
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "edit_modal":
              this.edit( );
            break;
          case "activate":
              this.activateConfirm(MeetingReportTemeplates.reportTemeplateId );
            break;
          case "deactivate":
              this.deactivateConfirm(MeetingReportTemeplates.reportTemeplateId );
            break;
          case "delete":
              this.deleteConfirm(MeetingReportTemeplates.reportTemeplateId );
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    });

    this.modalEventSubscription = this._eventEmitterService.commonModal.subscribe(res => {
      this.closeFormModal()
    });

   
  }

  addSubmenu() {

    if (MeetingReportTemeplates.individualLoaded && MeetingReportTemeplates.individualMeetingReportTemplatesDetails) {
      if (MeetingReportTemeplates.individualMeetingReportTemplatesDetails.status.id==AppStore.activeStatusId) {

        var  subMenuItems = [
          { activityName: 'DEACTIVATE_MEETING_REPORT_TEMPLATE', submenuItem: { type: 'deactivate' } },
          { activityName: 'UPDATE_MEETING_REPORT_TEMPLATE', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_MEETING_REPORT_TEMPLATE', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: {type: 'close',path:'../'}},
        ]
      }
      else {

        var  subMenuItems = [
          { activityName: 'ACTIVATE_MEETING_REPORT_TEMPLATE', submenuItem: { type: 'activate' } },
          { activityName: 'UPDATE_MEETING_REPORT_TEMPLATE', submenuItem: { type: 'edit_modal' } },
          { activityName: 'DELETE_MEETING_REPORT_TEMPLATE', submenuItem: { type: 'delete' } },
          { activityName: null, submenuItem: {type: 'close',path:'../'}},
        ]
      }
      this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);

    }
  }

  getTemplateDetails(){
    
    this._meetingReportTemplatesService.getItem(MeetingReportTemeplates.reportTemeplateId).subscribe(res => {
      this.addSubmenu();
      MeetingReportTemeplates.unsetDocumentDetails();
      if(res.pages.length>0){
        this.setDocuments(MeetingReportTemeplates.individualMeetingReportTemplatesDetails?.pages[0]?.fields[0]?.documents);
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteReportTemplates(status);
        break;
      case 'Activate': this.activateReportTemplates(status);
        break;
      case 'Deactivate': this.deactivateReportTemplates(status);
        break;
    }
  }

  deleteReportTemplates(status: boolean) {

    if (status && this.popupObject.id) {
      this._meetingReportTemplatesService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
          this._router.navigateByUrl('mrm/meeting-report-templates');
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      },(error=>{
             
        if(error.status == 405 && MeetingReportTemeplates.getMeetingReportTemplatesById(this.popupObject.id).status_id == AppStore.activeStatusId){
          let id = this.popupObject.id;
          this.closeConfirmationPopup();
          this.clearPopupObject();
          setTimeout(() => {
            this.deactivateConfirm(id);
            this._utilityService.detectChanges(this._cdr);
          }, 500);
        }
        else{
          this.closeConfirmationPopup();
          this.clearPopupObject();
        }

      })
      );
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  activateReportTemplates(status: boolean) {
    if (status && this.popupObject.id) {
      this._meetingReportTemplatesService.activate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.getTemplateDetails();
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      this.closeConfirmationPopup();
      this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  deactivateReportTemplates(status: boolean) {
    if (status && this.popupObject.id) {
      this._meetingReportTemplatesService.deactivate(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this.getTemplateDetails();
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.closeConfirmationPopup();
        this.clearPopupObject();
      });
    }
    else {
      this.closeConfirmationPopup();
      this.clearPopupObject();
    }
  }

  activateConfirm(id: number) {
    this.popupObject.id = id;
    this.popupObject.type='Activate';
    this.popupObject.title = 'Activate Control?';
    this.popupObject.subtitle = 'common_activate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deactivateConfirm(id: number) {
    this.popupObject.id = id;
    this.popupObject.type='Deactivate';
    this.popupObject.title = 'Deactivate Control?';
    this.popupObject.subtitle = 'common_deactivate_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteConfirm(id: number) {
    this.popupObject.id = id;
    this.popupObject.type = '';
    this.popupObject.title='Delete Control?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  closeConfirmationPopup(){
    $(this.confirmationPopUp.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  clearPopupObject() {
    this.popupObject.id = null;
    // this.popupObject.type = '';
    // this.popupObject.title = '';
    // this.popupObject.subtitle = '';
  }

  //edit start
  edit() {
      this.reportObject.values = {
        id: MeetingReportTemeplates.individualMeetingReportTemplatesDetails.id,
        title:MeetingReportTemeplates.individualMeetingReportTemplatesDetails.title ,
      }

      this.reportObject.type = 'Edit';
      MeetingReportTemeplates.editFlag=false;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal()
  }
  //end edit  

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.reportObject.type = null;
  }

  getButtonText(text){
    return this._helperService.translateToUserLanguage(text);
  }

  onFileChange(event, type: string) {// doc-add  file change function
    var selectedFiles: any[] = event.target.files;
    if (selectedFiles.length > 0) {
      var temporaryFiles = this.addItemsToFileUploadProgressArray(selectedFiles, type); 
      this.checkForFileUploadsScrollbar();
      Array.prototype.forEach.call(temporaryFiles, elem => {
        const file = elem;
        if (this._imageService.validateFile(file, type)) {
          const formData = new FormData();
          formData.append('file', file);
          var typeParams = (type == 'logo') ? '?type=logo' : '?type=support-file';
          this._imageService.uploadImageWithProgress(formData, typeParams) 
            .subscribe((res: HttpEvent<any>) => {
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
                    this.createImageFromBlob(prew, temp, type); 
                  }, (error) => {
                    this.assignFileUploadProgress(null, file, true);
                    this._utilityService.detectChanges(this._cdr);
                  })
              }
            }, (error) => {
              this._utilityService.showErrorMessage('Failed', 'Sorry file upload failed');
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

  checkAcceptFileTypes(type){// doc-add
    return this._imageService.getAcceptFileTypes(type); 
  }
    
  checkLogoIsUploading(){// doc-add  Check if logo is being uploaded
    return this._helperService.checkLogoIsUploading(this.fileUploadsArray);
  }

  createImageFromBlob(image: Blob, imageDetails, type) {//doc-add imageblob function
    MeetingReportTemeplates.unsetDocumentDetails();
    let reader = new FileReader();
    reader.addEventListener("load", () => {
      var logo_url = reader.result;

      imageDetails['preview'] = logo_url;
      if (imageDetails != null)
        this._meetingReportTemplatesService.setDocumentDetails(imageDetails, type);
      this.checkForFileUploadsScrollbar();
      this._utilityService.detectChanges(this._cdr);
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }

  assignFileUploadProgress(progress, file, success = false) {// doc-add
    let temporaryFileUploadsArray = this.fileUploadsArray;
    this.fileUploadsArray = this._helperService.assignFileUploadProgress(progress, file, success, temporaryFileUploadsArray);
  }

  addItemsToFileUploadProgressArray(files, type) {// doc-add
    var result = this._helperService.addItemsToFileUploadProgressArray(files, type, this.fileUploadsArray);
    this.fileUploadsArray = result.fileUploadsArray;
    return result.files;
  }

  checkForFileUploadsScrollbar() {//doc-add scrollbar function
    if (MeetingReportTemeplates.docDetails.length >= 7 || this.fileUploadsArray.length > 7) {
      $(this.uploadArea.nativeElement).mCustomScrollbar();
    }
    else {
      $(this.uploadArea.nativeElement).mCustomScrollbar("destroy");
    }
  }

  checkExtension(ext, extType) {//doc-add
    return this._imageService.checkFileExtensions(ext, extType)
  }

  setDocuments(documents){ //doc-prv
    for (let i of documents) {
      let docurl = this._meetingPlanFileService.getThumbnailPreview('report-tempate-document', i.token);
      let docDetails = {
        created_at: i.created_at,
        created_by: i.created_by,
        updated_at: i.updated_at,
        updated_by: i.updated_by,
        name: i.title,
        ext: i.ext,
        size: i.size,
        url: i.url,
        thumbnail_url: i.url,
        token: i.token,
        preview: docurl,
        id: i.id
      };

      this._meetingReportTemplatesService.setDocumentDetails(docDetails, docurl);
      setTimeout(() => {
        this.checkForFileUploadsScrollbar();
      }, 200);
    } 
  }

  removeDocument(token) {
    MeetingReportTemeplates.romveDocumentDetails(token);
    this.checkForFileUploadsScrollbar();
    this._utilityService.detectChanges(this._cdr);
  }

  toggleVisibility(event,labelID){
    if(event.target.checked){
      this.fields = this.fields.filter((item) => item.label_id !== labelID);
    
      this.fields.push({
        label_id:labelID,
        is_enable:1
      });
      
    }else{
      this.fields = this.fields.filter((item) => item.label_id !== labelID);
      
      this.fields.push({
        label_id:labelID,
        is_enable:0
      });
    }
    return true;
  }

  cancel(){
    this._router.navigateByUrl('mrm/meeting-report-templates');
  }

  saveMeetingReportTemplates(close:boolean=false) {
    
    this.fields.push({
      label_id:MeetingReportTemeplates.individualMeetingReportTemplatesDetails.pages[0].fields[0].label_id,
      is_enable:MeetingReportTemeplates.individualMeetingReportTemplatesDetails.pages[0].fields[0].is_enable,
      order:MeetingReportTemeplates.individualMeetingReportTemplatesDetails.pages[0].fields[0].order,
      documents:MeetingReportTemeplates.docDetails,
    });
    this.saveData={
      label_id:MeetingReportTemeplates.individualMeetingReportTemplatesDetails.pages[0].label_id,
      is_enable:MeetingReportTemeplates.individualMeetingReportTemplatesDetails.pages[0].is_enable,
      order:MeetingReportTemeplates.individualMeetingReportTemplatesDetails.pages[0].order,
      meeting_report_template_page_fields:this.fields?this.fields:[],
    };
    AppStore.enableLoading();
    let save=this._meetingReportTemplatesService.saveMeetingReportTemplates( MeetingReportTemeplates.reportTemeplateId,MeetingReportTemeplates.individualMeetingReportTemplatesDetails.pages[0].id, this.saveData);
    save.subscribe(res=>{
      if(close){
        this.cancel();
      }
      this.fields=[];
      AppStore.disableLoading();
      this.documentRemove();
      this._utilityService.detectChanges(this._cdr);
    },(error:HttpErrorResponse)=>{
      this.fields=[];
      AppStore.disableLoading();
      this._utilityService.showErrorMessage('error','something_went_wrong_try_again');
      this._utilityService.detectChanges(this._cdr);
    });
  }
  documentRemove(){
    if( MeetingReportTemeplates.docDetails[0]?.is_deleted){
      MeetingReportTemeplates.unsetDocumentDetails();
    }
  }

  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.modalEventSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
    MeetingReportTemeplates.unSetMeetingReportTemplatesDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }
}
