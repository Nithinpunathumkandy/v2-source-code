import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import {AuditStore} from 'src/app/stores/internal-audit/audit/audit-store';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from "src/app/stores/general/breadcrumb-menu.store";
import { Router } from '@angular/router';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { HumanCapitalService } from 'src/app/core/services/human-capital/human-capital-service/human-capital.service';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-audits',
  templateUrl: './audits.component.html',
  styleUrls: ['./audits.component.scss']
})
export class AuditsComponent implements OnInit , OnDestroy {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('popup') popup: ElementRef;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  AuthStore = AuthStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  AuditStore = AuditStore;
  auditsEmptyList = "Look like We Don't Have Any Audits In this Audit Program";
  constructor(
    private _cdr: ChangeDetectorRef,
    private _humanCapitalService: HumanCapitalService,
    private _utilityService: UtilityService,
    private _router: Router,
    private _imageService:ImageServiceService,
    private _renderer2: Renderer2,
    private _auditService: AuditService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          // case "search":
          //   AuditStore.searchText = SubMenuItemStore.searchText;
          //   this.pageChange(1);
          //   break;

          
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if (NoDataItemStore.clikedNoDataItem) {
        this.gotoAuditAddPage()
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    
    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any audits to show under this program!", subtitle: '', buttonText: 'Create New Audit' });
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);

    

    // setting submenu items
    SubMenuItemStore.setSubMenuItems([
     
       {type:'close' ,path: '../' }

    ]);

    this.pageChange(1);

  }

  gotoAuditAddPage() {
    this.clearCommonFilePopupDocuments()
    this._router.navigateByUrl('internal-audit/audits/add-planned-audit');
  }
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }
  pageChange(newPage: number = null) {
    if (newPage) AuditStore.setCurrentPage(newPage);
    this._auditService.getAuditForAuditProgram(AuditProgramMasterStore.auditProgramId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  // Returns default image
  getDefaultImage(type) {
    return this._imageService.getDefaultImageUrl(type);
  }



  createImagePreview(type, token) {
    return this._imageService.getThumbnailPreview(type, token)
  }


  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
       
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  
  gotoAuditDetails(id:number){
    this._router.navigateByUrl('/internal-audit/audits/'+id);
  }


  createImageUrl(token) {
   
    return this._humanCapitalService.getThumbnailPreview('user-profile-picture', token);
  }

  gotoUserDetails(id){
    this._router.navigateByUrl('/human-capital/users/'+id);
  }
  

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AuditStore.fromProgramAuditLoaded = false;

  }



}
