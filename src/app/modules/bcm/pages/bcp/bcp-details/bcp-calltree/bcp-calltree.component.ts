import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { BcpCallTreeService } from "src/app/core/services/bcm/bcp/bcp-call-tree/bcp-call-tree.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { BcpStore } from 'src/app/stores/bcm/bcp/bcp-store';
import { ImageServiceService } from "src/app/core/services/general/image-service/image-service.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { AppStore } from "src/app/stores/app.store";
import { BcpService } from "src/app/core/services/bcm/bcp/bcp.service";
import { AuthStore } from 'src/app/stores/auth.store';

declare var $: any;

@Component({
  selector: 'app-bcp-calltree',
  templateUrl: './bcp-calltree.component.html',
  styleUrls: ['./bcp-calltree.component.scss']
})
export class BcpCalltreeComponent implements OnInit {

  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef; 
  SubMenuItemStore = SubMenuItemStore;
  BcpStore = BcpStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  reactionDisposer: IReactionDisposer;
  callTreeSubscription: any = null;
  callTreeChangeEventSubscription: any = null;
  addCallTreeSubscription: any = null;
  popupControlSubscription: any = null;
  callTreeObject = {
    type: null,
    bcpId: null,
    bcpVersionId: null,
    userId: null,
    values: null
  }
  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  constructor(private _bcpCallTreeService: BcpCallTreeService, private _imageService: ImageServiceService,
    private _cdr: ChangeDetectorRef, private _utilityService: UtilityService, private _helperService: HelperServiceService,
    private _eventEmitterService: EventEmitterService, private _bcpService: BcpService) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'add_new_user'});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [];
      if(BcpStore.bcpDetails.business_continuity_plan_status.type == 'approved'){
        subMenuItems = [
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
      }
      else{
        subMenuItems = [
          {activityName: 'CREATE_BUSINESS_CONTINUITY_PLAN_CALL_TREE', submenuItem: {type: 'new_modal'}},
          {activityName:null, submenuItem: {type: 'close', path: '../'}}
        ]
      }
      this._helperService.checkSubMenuItemPermissions(600, subMenuItems);
      if(BcpStore.bcpDetails.business_continuity_plan_status.type == 'approved' || !AuthStore.getActivityPermission(1100,'CREATE_BUSINESS_CONTINUITY_PLAN_CALL_TREE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.addUser();
            break;
          default:
            break;
        }
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
      if(NoDataItemStore.clikedNoDataItem){
        this.addUser();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.callTreeSubscription = this._eventEmitterService.callTreeModal.subscribe(res=>{
      this.getCallTree();
      this.closeFormModal();
    })
    this.popupControlSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      if(item)
        this.deleteCallTreeUser(this.popupObject.id);
      else{
        this.closeConfirmationPopUp();
      }

    })
    this.callTreeChangeEventSubscription = this._eventEmitterService.bcpCallTreeChangeEvent.subscribe(res=>{
      if(isNaN(res)){
        res['user_id'] = res['user'];
        this.editCallTree(res);
      }
      else{
        this.deleteConfirm(res);
      }
    })
    this.addCallTreeSubscription = this._eventEmitterService.bcpCallTreeAddUser.subscribe(res=>{
      this.addUser(res);
    })
    this.getCallTree();
  }

  getCallTree(){
    this._bcpCallTreeService.getItem(BcpStore.selectedBcpId,'?is_all=true').subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  createImageUrl(token){
    return this._imageService.getThumbnailPreview('user-profile-picture',token);
  }

  // Return Default Image
  getDefaultImage(type){
    return this._imageService.getDefaultImageUrl(type);
  }

  getStringsFormatted(stringArray,characterLength,seperator){
    return this._helperService.getFormattedName(stringArray,characterLength,seperator);
  }

  addUser(id?: number){
    this.callTreeObject.type = 'Add';
    this.callTreeObject.bcpId = BcpStore.selectedBcpId;
    this.callTreeObject.bcpVersionId = BcpStore.currentVersionId;
    if(id) this.callTreeObject.userId = id;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }

  editCallTree(callTreeItem){
    this.callTreeObject.type = 'Edit';
    this.callTreeObject.bcpId = BcpStore.selectedBcpId;
    this.callTreeObject.bcpVersionId = BcpStore.currentVersionId;
    this.callTreeObject.values = callTreeItem;
    this._utilityService.detectChanges(this._cdr);
    this.openFormModal();
  }
  
  deleteConfirm(id: number){
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.subtitle = 'common_delete_subtitle';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteCallTreeUser(id: number){
    this._bcpCallTreeService.delete(id,BcpStore.selectedBcpId).subscribe(res=>{
      this.closeConfirmationPopUp();
      this.clearPopupObject();
      this.getBcpDetails(BcpStore.bcpDetails.id);
      this._utilityService.detectChanges(this._cdr);
    },(error)=>{
      this.closeConfirmationPopUp();
      this.clearPopupObject();
      this._utilityService.detectChanges(this._cdr);
    })
  }

  clearPopupObject() {
    this.popupObject.id = null;
  }

  closeConfirmationPopUp(){
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);
  }

  openFormModal() {
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeFormModal() {
    $(this.formModal.nativeElement).modal('hide');
    this.getCallTree();
    this.callTreeObject.type = null;
    this.callTreeObject.userId = null;
    this.callTreeObject.values = null;
    $('modal-backdrop').remove();
  }

  getBcpDetails(id: number){
    this._bcpService.getItem(id).subscribe(res=>{
        let pos = res.versions.findIndex(e => e.is_latest == 1);
        if(pos != -1) {
          this._bcpService.setBcpContents(res.versions[pos]);
          BcpStore.currentVersionId = res.versions[pos].id;
        }
        this._utilityService.detectChanges(this._cdr);
    })
  }

  ngOnDestroy(){
    if(this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.callTreeSubscription.unsubscribe();
    this.addCallTreeSubscription.unsubscribe();
    this.popupControlSubscription.unsubscribe();
    this.callTreeChangeEventSubscription.unsubscribe();
  }
}
