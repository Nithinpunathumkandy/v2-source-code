import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { DocumentFileService } from 'src/app/core/services/knowledge-hub/documents/document-file.service';
import { FileServiceService } from 'src/app/core/services/ms-audit-management/file-service/file-service.service';
import { FollowUpService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit-details/follow-up/follow-up.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { AuditFollowUpStore } from 'src/app/stores/ms-audit-management/follow-up/audit-follow-up.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-follow-up',
  templateUrl: './follow-up.component.html',
  styleUrls: ['./follow-up.component.scss']
})
export class FollowUpComponent implements OnInit {
  @ViewChild ('formModal') formModal: ElementRef;
  @ViewChild("filePreviewModal") filePreviewModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild ('rejectModal') rejectModal: ElementRef;
  @ViewChild ('historyModal') historyModal: ElementRef;



  reactionDisposer: IReactionDisposer;
  AuditFollowUpStore = AuditFollowUpStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore;
  AppStore = AppStore;
  nonDataText = "Please add correcctive actions from non-conformity"
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore
  MsFollowUpObject = {
    type:null,
    values: null,
  };

  rejectModalObject = {
    type : null,
    id : null,
  };

  historyModalObject = {
    type : null,
    id : null,
  };
  popupObject = {
    type: '',
    title: '',
    id: null,
    planId : null,
    subtitle: ''
  };
  previewObject = {
    preview_url: null,
    file_details: null,
    uploaded_user: null,
    created_at: "",
    component: "",
    componentId: null,
    frequency : null,
    correctiveActionId : null
  };
  followUpEventSubscription: any;
  selectedIndex: any = null;
  selectedActionIndex: any = null;
  emptyTier = 'No data found'
  popupControlEventSubscription: any;
  CaRejectEventSubscription: any;
  CaHistoryEventSubscription: any;


  constructor(private _helperService: HelperServiceService,
  private  _followUpService : FollowUpService,
  private _utilityService: UtilityService,
  private _cdr: ChangeDetectorRef,
  private _eventEmitterService: EventEmitterService,
  private _documentFileService: DocumentFileService,
  private _fileServiceService: FileServiceService,
  private _sanitizer: DomSanitizer,
  private _renderer2: Renderer2,
  private _imageService:ImageServiceService,) { }

  ngOnInit(): void {

    this.reactionDisposer = autorun(() => {
      
      this.subMenu();

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
              // this.addFollowUp();
            break;
          case "delete":
            // this.delete(AuditNonConfirmityStore.msAuditNonConfirmityId);
          break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
    });
    this.followUpEventSubscription = this._eventEmitterService.msAuditFollowUp.subscribe(res=>{
      this.closeFormModal();
      this.pageChange(1);
      this.selectedIndex= null;
      this.selectedActionIndex= null
    })

    this.CaRejectEventSubscription = this._eventEmitterService.caRejectModal.subscribe(res=>{
      this.closeRejectModal();
      this.pageChange(1);
      this.selectedIndex= null;
      this.selectedActionIndex= null
    })
    this.CaHistoryEventSubscription = this._eventEmitterService.caHistorytModal.subscribe(res=>{
      this.closeHistoryModal();
      this.selectedIndex= null;
      this.selectedActionIndex= null
    })

    // if(MsAuditStore.selectedMsAuditId &&  AuditNonConfirmityStore.nonConfirmityRedirect){
    //   BreadCrumbMenuItemStore.addBreadCrumbMenu({
    //     name:"follow_up",
    //     path:'/ms-audit-management/ms-audits/'+MsAuditStore.selectedMsAuditId+'/follow-up'
    //   });
    // }else{
    //   BreadCrumbMenuItemStore.addBreadCrumbMenu({   
    //   name:"non_conformity",
    //   path:'../'
    //   });
    // }
    
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.pageChange(1);
  }

  userRoleChecck(){
    let pos =  AuthStore.user?.roles.findIndex(e=>e.type == 'qm-team')
        return pos != -1 ? true : false 
  }

  subMenu(){

    let subMenuItems= [];
    if(MsAuditStore.selectedMsAuditId && AuditNonConfirmityStore.nonConfirmityRedirect){
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path:'/ms-audit-management/ms-audits/'+MsAuditStore.selectedMsAuditId+'/follow-up'} },
      ];
    }else{
      subMenuItems = [
        { activityName: null, submenuItem: { type: 'close', path:'../'} },
      ];
    }
    this._helperService.checkSubMenuItemPermissions(1600, subMenuItems);
    
  }

  getEmployeePopupDetails(users, created?: string) { //user popup
    
    let userDetails: any = {};
      if(users){
        userDetails['first_name'] = users?.first_name?users?.first_name:users?.name;
        userDetails['last_name'] = users?.last_name;
        userDetails['image_token'] = users?.image?.token?users?.image.token:users?.image_token;
        userDetails['email'] = users?.email;
        userDetails['mobile'] = users?.mobile;
        userDetails['id'] = users?.id;
        // userDetails['department'] = users?.department?users.department : users?.department?.title ? users?.department?.title : null;
        userDetails['department'] = users?.department;
        userDetails['status_id'] = users?.status_id? users?.status_id:users?.status.id;
        userDetails['created_at'] =created? created:null;
        userDetails['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      }
    return userDetails;
  }

  updateCorrectiveAction(){

  }

  pageChange(newPage: number = null) {
    if (newPage) AuditFollowUpStore.setCurrentPage(newPage);
    this._followUpService.getItems(false,null).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  remind(id:number){
    this.popupObject.type = 'Confirm';
    this.popupObject.id = id;
    // this.popupObject.planId = planId;
    this.popupObject.title = 'add_reminder?';
    this.popupObject.subtitle = 'add_reminder_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
  
  
  selectIndexChange(index,id:number){
    AuditFollowUpStore.individualCorrectiveActionLoaded = false
    if(this.selectedIndex == index){
      this.selectedIndex = null;
    } else{
      this.selectedIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
    this.getCorrectiveactiondetails(id);
  }

  getCorrectiveactiondetails(id){
    this._followUpService.getCorrectiveActionDetails(id).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }


  addFollowUp(data) {
    this._followUpService.getCorrectiveActionDetails(data.id).subscribe(res=>{
      this.MsFollowUpObject.type = data.effectiveness ? 'Edit' : 'Add';
      this.MsFollowUpObject.values = res;
      AuditNonConfirmityStore.editFlag = true;
      this._utilityService.detectChanges(this._cdr);
      this.openFormModal();
     }); 
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeFormModal() {
    
    // this.getD  etails(AuditNonConfirmityStore.msAuditNonConfirmityId);
    $(this.formModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.formModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.formModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.formModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.MsFollowUpObject.type = null;
  }

  openRejectModal(id:number) {
    this.rejectModalObject.id = id;
    this.rejectModalObject.type = "Add"
    setTimeout(() => {
      $(this.rejectModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.rejectModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.rejectModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.rejectModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeRejectModal() {
    
    // this.getD  etails(AuditNonConfirmityStore.msAuditNonConfirmityId);
    $(this.rejectModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.rejectModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.rejectModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.rejectModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
    this.rejectModalObject.id = null;
    this.rejectModalObject.type = null
  }

  openHistorytModal(id:number){
    this.historyModalObject.id = id;
    this.historyModalObject.type = "Add"
    setTimeout(() => {
      $(this.historyModal.nativeElement).modal('show');
      this._renderer2.setStyle(this.historyModal.nativeElement, 'display', 'block');
      this._renderer2.setStyle(this.historyModal.nativeElement, 'z-index', 99999);
      this._renderer2.setStyle(this.historyModal.nativeElement, 'overflow', 'auto');
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  closeHistoryModal(){
    this.historyModalObject.id = null;
    this.historyModalObject.type = null
    $(this.historyModal.nativeElement).modal('hide');
    this._renderer2.setStyle(this.historyModal.nativeElement, 'display', 'none');
    this._renderer2.setStyle(this.historyModal.nativeElement, 'z-index', 9);
    this._renderer2.setStyle(this.historyModal.nativeElement, 'overflow', 'none');
    $('.modal-backdrop').remove();
    this._utilityService.detectChanges(this._cdr);
  }


  delete(id:number,planId:number){
    event.stopPropagation();
    this.popupObject.type = 'Delete';
    this.popupObject.id = id;
    this.popupObject.planId = planId;
    this.popupObject.title = 'delete_strategy_profile?';
    this.popupObject.subtitle = 'common_delete_subtitle';
    this._utilityService.detectChanges(this._cdr);
    $(this.confirmationPopUp.nativeElement).modal('show');
  }
        // for popup object clearing
        clearPopupObject() {
          this.popupObject.id = null;
          this.popupObject.type = null;
        }

        // modal control event
        modalControl(status: boolean) {
          switch (this.popupObject.type) {
            case 'Delete': this.deleteMsAuditCheckList(status)
              break;
              case 'Close': this.closeCorrectiveAction(status)
              break;
              case 'Confirm': this.setReminder(status)
              break;
          }
      
        }

        setReminder(status : boolean){
          if(status && this.popupObject.id){
            this._followUpService.remind(this.popupObject.id).subscribe(()=>setTimeout(() => this._utilityService.detectChanges(this._cdr), 100))
          }else{
            this.clearPopupObject();
          }
          setTimeout(() => {
            $(this.confirmationPopUp.nativeElement).modal('hide');
          }, 250);
          
        }
      
          // delete function call
          deleteMsAuditCheckList(status: boolean) {
            if (status && this.popupObject.id) {
              this._followUpService.delete(this.popupObject.id,this.popupObject.planId).subscribe(resp => {
                setTimeout(() => {
                  this.pageChange(1);
                  this.getCorrectiveactiondetails(this.popupObject.id);
                  this._utilityService.detectChanges(this._cdr);
                  this.clearPopupObject();
                }, 500);
              });
            }
            else {
              this.clearPopupObject();
            }
            setTimeout(() => {
              $(this.confirmationPopUp.nativeElement).modal('hide');
            }, 250);
        
          }
          closeCorrectiveAction(status: boolean) {
            if (status && this.popupObject.id) {
              this._followUpService.closeCA(this.popupObject.id).subscribe(resp => {
                setTimeout(() => {
                  this.getCorrectiveactiondetails(this.popupObject.id);
                  this.pageChange(1);
                  this._utilityService.detectChanges(this._cdr);
                  this.clearPopupObject();
                }, 500);
       
              });
            }
            else {
              this.clearPopupObject();
            }
            setTimeout(() => {
              $(this.confirmationPopUp.nativeElement).modal('hide');
            }, 250);
        
          }
  

  actionPlanIndexChange(index){
    if(this.selectedActionIndex == index){
      this.selectedActionIndex = null;
    } else{
      this.selectedActionIndex = index;
      this._utilityService.detectChanges(this._cdr);
    }
  }

    // Returns image url according to type and token
           createImageUrl(type, token) {
            return this._followUpService.getThumbnailPreview(type, token);
          }

            // extension check function
    checkExtension(ext, extType) {

      return this._imageService.checkFileExtensions(ext, extType)
     
    }

    downloadFollowUpDocument(type, kpiDocument, docs, frequencyId,correctiveActionId) {

      event.stopPropagation();
      switch (type) {
        case "audit-follow-up":
          this._followUpService.downloadFile(correctiveActionId,
            frequencyId,
            "audit-follow-up",
            kpiDocument.id,
            null,
            kpiDocument.title,
            kpiDocument
          );
          break;
          case "document-version":
            this._documentFileService.downloadFile(
              type,
              kpiDocument.document_id,
              docs.id,
              null,
              document.title,
              docs
            );
            break;
    
      }
    
    }

    viewFollowUpDocument( type, docuDetails ,id,documentFile,correctiveActionId) {
      switch (type) {
        case "audit-follow-up":
      this._followUpService.getCheckListPreview(correctiveActionId,docuDetails.id,id).subscribe(res=>{
        var resp: any = this._utilityService.getDownLoadLink(
          res,
          docuDetails.name
        );
        this.openPreviewModal(type, resp, documentFile, docuDetails, id,correctiveActionId );
      }),
      (error) => {
        if (error.status == 403) {
          this._utilityService.showErrorMessage(
            "Error",
            "permission_denied"
          );
        } else {
          this._utilityService.showErrorMessage(
            "Error",
            "unable_generate_preview"
          );
        }
      };
      break;
      case "document-version":
        this._documentFileService
          .getFilePreview(type, docuDetails.document_id, documentFile.id)
          .subscribe((res) => {
            var resp: any = this._utilityService.getDownLoadLink(
              res,
              docuDetails.title
            );
            this.openPreviewModal(type, resp, documentFile, docuDetails,id,correctiveActionId);
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
  
    openPreviewModal(type,filePreview, documentFiles, document , id,correctiveActionId) {
      this.previewObject.component = type
      let previewItem = null;
      if (filePreview) {
        previewItem = this._sanitizer.bypassSecurityTrustResourceUrl(filePreview);
        this.previewObject.preview_url = previewItem;
        this.previewObject.file_details = documentFiles;
        this.previewObject.componentId = document.id;
        this.previewObject.frequency = id;
        this.previewObject.correctiveActionId = correctiveActionId
  
        
        $(this.filePreviewModal.nativeElement).modal("show");
        this._utilityService.detectChanges(this._cdr);
      }
  
    }

    getDefaultImage(type) {
      return this._imageService.getDefaultImageUrl(type);
    }

    isUser() {
      // if(ProjectMonitoringStore?.individualLoaded){
        // for (let i of AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users) {
          if (AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users.length >0) {
            var pos = AuditNonConfirmityStore.individualMsAuditNonConfirmityDetails?.responsible_users.findIndex(e => e.id == AuthStore.user.id)
              if (pos != -1){
                return true;
              }
              else{
                return false
              }
          }else{
            return false
          }
        // }
      }

    
  
    *// Closes from preview
    closePreviewModal(event) {
      $(this.filePreviewModal.nativeElement).modal("hide");
      this.previewObject.preview_url = "";
      this.previewObject.uploaded_user = null;
      this.previewObject.created_at = "";
      this.previewObject.file_details = null;
      this.previewObject.componentId = null;
    }

    closeCA(id:number){
      event.stopPropagation();
      this.popupObject.type = 'Close';
      this.popupObject.id = id;
      this.popupObject.planId = null;
      this.popupObject.title = 'Are you sure';
      this.popupObject.subtitle = 'audit_corrective_action_close_message';
      this._utilityService.detectChanges(this._cdr);
      $(this.confirmationPopUp.nativeElement).modal('show');
    }

    ngOnDestroy(){
      if (this.reactionDisposer) this.reactionDisposer();
      SubMenuItemStore.makeEmpty();
      this.popupControlEventSubscription.unsubscribe();
      this.followUpEventSubscription.unsubscribe();
      this.CaRejectEventSubscription.unsubscribe();
      this.CaHistoryEventSubscription.unsubscribe();
      AuditFollowUpStore.individualCorrectiveActionLoaded = false
    }

}
