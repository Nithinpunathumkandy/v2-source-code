import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditProgramService } from 'src/app/core/services/internal-audit/audit-program/audit-program.service';
import { AuditorsService } from 'src/app/core/services/internal-audit/auditors/auditors.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AuditorsStore } from 'src/app/stores/internal-audit/auditors/auditors-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-auditors',
  templateUrl: './auditors.component.html',
  styleUrls: ['./auditors.component.scss']
})
export class AuditorsComponent implements OnInit , OnDestroy{
  @ViewChild('chooseAuditors', { static: true }) chooseAuditors: ElementRef; 
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('riskRatings') riskRatings: ElementRef;


  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  AuditorsStore = AuditorsStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AppStore = AppStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  auditorsObject = {
    type: null,
    value:null
  }

  riskRatingObject = {
    type:null,
    value:null
  }

  auditorsArray = [];
  choooseAuditorsModalEvent: any;
  riskRatingDetailsModalEvent: any;
  popupControlEventSubscription: any;

  idleTimeoutSubscription: any;
  networkFailureSubscription: any;
  formErrors: any;
  constructor(private _cdr: ChangeDetectorRef,
    private _eventEmitterService: EventEmitterService,
    private _imageService:ImageServiceService,
    private _renderer2: Renderer2,
    private _auditorsService:AuditorsService,
    private _auditProgranService: AuditProgramService,
    private _utilityService: UtilityService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.auditorsObject.type = "Add";
            this.openChooseAuditModal();
            break;
            // case  "delete":
            // this.deleteAuditors();
            // break;
            case "refresh":
              this.auditProgramAuditors();
              break;
            // case "export_to_excel":
            //   this._auditProgranService.auditorsExportToExcel(AuditProgramMasterStore.auditProgramId);
            //   break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.auditorsObject.type = "Add";
        this.openChooseAuditModal();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })

    NoDataItemStore.setNoDataItems({title: "Looks like we don't have any Auditors allocated for the audit program!", subtitle: 'Add an auditor if there is any. To add, simply tap the button below.', buttonText: 'Add Auditors'});
   
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    // calling choose auditors modal

    this.choooseAuditorsModalEvent = this._eventEmitterService.chooseAuditorsModal.subscribe(res=>{
      this.closeChooseAuditModal();
    })

    //calling risk rating modal

    this.riskRatingDetailsModalEvent = this._eventEmitterService.riskRatingListControlModal.subscribe(res=>{
      this.closeRiskRating()
    })

      // for deleting  modal
      this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
        this.modalControl(item);
      })

      this.idleTimeoutSubscription = this._eventEmitterService.idleTimeoutModal.subscribe(status=>{
        if(!status && $(this.chooseAuditors.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.chooseAuditors.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.chooseAuditors.nativeElement,'overflow','auto');
        }
      })
  
      this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
        if(!status && $(this.chooseAuditors.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.chooseAuditors.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.chooseAuditors.nativeElement,'overflow','auto');
        }
      })

    // calling audit program auditors
    this.auditProgramAuditors();
  }

  getCreatedByPopupDetails(users, created?: string,type:any='') {
    let userDetail: any = {};
      userDetail['first_name'] = users?.first_name;
      userDetail['last_name'] = users?.last_name;
      userDetail['designation'] = users?.designation?.title ? users?.designation?.title : users?.designation;
      userDetail['image_token'] = users?.image_token;
      userDetail['email'] = users?.email;
      userDetail['mobile'] = users?.mobile;
      userDetail['id'] = users?.id;
      userDetail['department'] = users?.department?.title ? users?.department?.title : users?.department;      
      userDetail['status_id'] = users?.status_id;
      userDetail['created_at'] = null;
    return userDetail;

  }

  edit(id) {
    event.stopPropagation();
    this._auditProgranService.getAuditorView(id).subscribe(res => {
      let auditor = res;
      this.auditorsObject.value = {
        id:auditor.id,
        user_id : auditor.user_id,
        auditable_items:auditor.auditable_items
      }
      this.auditorsObject.type = 'Edit';
      this._utilityService.detectChanges(this._cdr);
      this.openChooseAuditModal()
    })
  }

  auditProgramAuditors() {
    this._auditorsService.getAllItems(AuditProgramMasterStore.auditProgramId).subscribe(res => {
      if(AuditorsStore.allItems.length> 0){
        // setting submenu items
    SubMenuItemStore.setSubMenuItems([
      { type: 'new_modal' },
      {type:'refresh'},
      // {type: 'delete'},
      // {type:'export_to_excel'},
      { type: 'close', path: '../' }
      ]);
      } else {
         // setting submenu items
      SubMenuItemStore.setSubMenuItems([
      { type: 'new_modal' },
      { type: 'close', path: '../' }
    ]);
      }

      this._utilityService.detectChanges(this._cdr);
    });
  }



  openChooseAuditModal(){
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.chooseAuditors.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    this._renderer2.removeAttribute(this.chooseAuditors.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.chooseAuditors.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }

  closeChooseAuditModal(){
    this.auditorsObject.type = null;
    this._renderer2.removeClass(this.chooseAuditors.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.chooseAuditors.nativeElement, 'display', 'none');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    this._renderer2.setAttribute(this.chooseAuditors.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.chooseAuditors.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
    this.auditProgramAuditors();
  }


  openRiskRating(type,id,value){
    if(value!=0){
      this.riskRatingObject.type ='Add';
      this.riskRatingObject.value = {
        id:id,
        riskRatingType:type
      }
      $('.modal-backdrop').add();
      document.body.classList.add('modal-open')
      this._renderer2.setStyle(this.riskRatings.nativeElement, 'display', 'block');
      // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
      this._renderer2.removeAttribute(this.riskRatings.nativeElement, 'aria-hidden');

      setTimeout(() => {
        this._renderer2.addClass(this.riskRatings.nativeElement, 'show')
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    }
  }


  closeRiskRating(){
    this.riskRatingObject.type = null;
    this._renderer2.removeClass(this.riskRatings.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.riskRatings.nativeElement, 'display', 'none');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    this._renderer2.setAttribute(this.riskRatings.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.riskRatings.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);
    this.auditProgramAuditors();
  }

  getRespectiveAuditor(id:number){
    var pos = this.auditorsArray.findIndex(e => e == id);
    if (pos != -1){
    this.auditorsArray.splice(pos, 1);
     } else {
      this.auditorsArray.push(id);
     }
  }

  checkPresent(auditorId:number){
    var pos = this.auditorsArray.findIndex(e => e ==auditorId);
    if (pos != -1){
      return true;
       } else {
      return false;
       }
  }

  processAuditorsIdForDelete(){
    var items = {
      "user_ids": this.auditorsArray
    }
    return items;
  }

  deleteAuditor(id:number,auditorId){
    event.stopPropagation();
    this.auditorsArray.push(id);
      this.popupObject.type = '';
      this.popupObject.id = auditorId;
    this.popupObject.title = 'Remove Auditors?';
    this.popupObject.subtitle = 'Are you sure you want to remove auditor from audit program?';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteAuditors(){
    event.stopPropagation();
    if(this.auditorsArray.length>0){
      this.popupObject.type = '';
    this.popupObject.title = 'Remove Auditors?';
    this.popupObject.subtitle = 'mutiple_adutor_delete_sub_title';

    $(this.confirmationPopUp.nativeElement).modal('show');} else{
      this._utilityService.showErrorMessage('Error','Please Select One Auditor Atleast');
    }
  }

   // modal control event
   modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteSelectedAuditors(status)
        break;
    }

  }

  deleteSelectedAuditors(status){
    if(status&&this.popupObject.id){
    this._auditProgranService.removeAuditors(AuditProgramMasterStore.auditProgramId, this.popupObject.id).subscribe(res=>{
      this.auditProgramAuditors();
      this.auditorsArray = []; // clear selection array when api hit succes
      this._utilityService.detectChanges(this._cdr);
    },(err: HttpErrorResponse) => {
      this.auditProgramAuditors();
      this.auditorsArray = []; // clear selection array when api hit succes
      if (err.status == 422) {
        this.formErrors = err.error.message;
        this._utilityService.showErrorMessage(this.formErrors,'');
      }if (err.status == 423) {
        this.formErrors = err.error.message;
        this._utilityService.showErrorMessage("warning",this.formErrors);
      }
    });
  
  } 
  setTimeout(() => {
    $(this.confirmationPopUp.nativeElement).modal('hide');
  }, 250);
  this.auditorsArray = []; // clear selection array when api hit succes/fail
  }

  processFormErrors(){
    // console.log(this.formErrors);
    var errors = this.formErrors;
   
    for (var key in errors) {
      if (errors.hasOwnProperty(key)) {
      
           if(key.startsWith('user_ids.')){
            let keyValueSplit = key.split('.');
            let errorPosition = parseInt(keyValueSplit[1]);
            this.formErrors['user_ids'] = this.formErrors['user_ids']? this.formErrors['user_ids'] + errors[key] + (errorPosition + 1): errors[key]+ (errorPosition + 1);
          }
        

      }
    }
    this._utilityService.detectChanges(this._cdr);
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }

  createImagePreview(type,token){
    return this._imageService.getThumbnailPreview(type,token)
  }

  viewMore(){
    alert('view more clicked');
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.choooseAuditorsModalEvent.unsubscribe();
    this.popupControlEventSubscription.unsubscribe();
    this.idleTimeoutSubscription.unsubscribe();
    this.networkFailureSubscription.unsubscribe();
    this.riskRatingDetailsModalEvent.unsubscribe();
    AuditorsStore.loaded = false;
    this.auditorsArray = [];

  }


}
