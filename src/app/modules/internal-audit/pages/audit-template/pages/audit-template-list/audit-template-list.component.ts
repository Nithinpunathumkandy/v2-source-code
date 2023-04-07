import { Component, OnInit, Renderer2, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AuditTemplates } from 'src/app/core/models/internal-audit/audit-template/audit-template';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditTemplateService } from 'src/app/core/services/internal-audit/audit-template/audit-template.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditTemplateStore } from 'src/app/stores/internal-audit/audit-template/audit-template-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-audit-template-list',
  templateUrl: './audit-template-list.component.html',
  styleUrls: ['./audit-template-list.component.scss']
})
export class AuditTemplateListComponent implements OnInit, OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  AppStore = AppStore;
  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  AuditTemplateStore = AuditTemplateStore;
  addAuditTemplateObject = {
    component: 'Master',
    values: null,
    type: null
  };

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };
  popupControlEventSubscription: any;
  templateAddModalSubscription:any;
  networkFailureSubscription: any;
  AuthStore = AuthStore;
  constructor(
    private _renderer2: Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _auditTemplateService:AuditTemplateService,
    private _helperService: HelperServiceService,
    private _router: Router,
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: null, submenuItem: {type: 'search'}},
        {activityName: 'CREATE_AUDIT_REPORT_TEMPLATE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_AUDIT_REPORT_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_AUDIT_REPORT_TEMPLATE', submenuItem: {type: 'export_to_excel'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_AUDIT_REPORT_TEMPLATE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
      this._helperService.checkSubMenuItemPermissions(1000, subMenuItems);
  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            setTimeout(() => {
              this.addAuditTemplateObject.type = 'Add';
              this.addAuditTemplateObject.values = null; // for clearing the value
              this._utilityService.detectChanges(this._cdr);
              this.addAuditTemplate();
            }, 1000);
            break;
          // case "template":
          //   this._auditTemplateService.generateTemplate();
          //   break;
          case "export_to_excel":
            this._auditTemplateService.exportToExcel();
            break;
          case "search":
            AuditTemplateStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          case "refresh":
            AuditTemplateStore.loaded = false;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addAuditTemplateObject.type = 'Add';
        this.addAuditTemplateObject.values = null;
        this.addAuditTemplate();
        NoDataItemStore.unSetClickedNoDataItem();
      }
    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })
    this.networkFailureSubscription = this._eventEmitterService.noConnectionModal.subscribe(status=>{
      if(!status){
        if($(this.formModal.nativeElement).hasClass('show')){
          this._renderer2.setStyle(this.formModal.nativeElement,'z-index',999999);
          this._renderer2.setStyle(this.formModal.nativeElement,'overflow','auto');
        }  
      }
    })
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_audit_template'});
    this.templateAddModalSubscription = this._eventEmitterService.auditTemplateAddModal.subscribe(res=>{
      this.closeModal()
      this._utilityService.detectChanges(this._cdr);
    });
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    SubMenuItemStore.setSubMenuItems([
      { type: 'search' },
      { type: 'refresh' },
      {type:'new_modal'},
      // { type: 'template' },
      { type: 'export_to_excel'}

    ]);
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this.pageChange(1);
  }

  gotToAuditTemplateDetails(id: number){
    this._router.navigateByUrl('/internal-audit/audit-report-template/'+id);
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Audit Template?';
    this.popupObject.subtitle = 'delete_audit_template';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }

  getAuditTemplate(id: number){
    event.stopPropagation();

    this._auditTemplateService.getItem(id).subscribe(res=>{

      if(AuditTemplateStore.individualLoaded){

        const auditProgram: AuditTemplates = AuditTemplateStore.auditTemplateDetails;
        let audit_categories = [];
        auditProgram.audit_category.forEach(element => {
          audit_categories.push(element.id)
        });
        this.addAuditTemplateObject.values = {
          id: auditProgram.id,
          title: auditProgram.title,
          description: auditProgram.description,
          audit_category_ids:audit_categories
        }
        this.addAuditTemplateObject.type = 'Edit';
        this.addAuditTemplate();
      }
      this._utilityService.detectChanges(this._cdr);
    })
  
  }

  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditTemplate(status)
        break;
    }

  }

  deleteAuditTemplate(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditTemplateService.delete(this.popupObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        this.clearPopupObject();
      });
    }
    else {
      this.clearPopupObject();
    }
    setTimeout(() => {
      $(this.confirmationPopUp.nativeElement).modal('hide');
    }, 250);

  }

  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  pageChange(newPage:number=null){
    if (newPage) AuditTemplateStore.setCurrentPage(newPage);
    this._auditTemplateService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  getCreatedByPopupDetails(users, created?:string){
    let userDetial: any = {};
    userDetial['first_name'] = users?.created_by_first_name;
    userDetial['last_name'] = users?.created_by_last_name;
    userDetial['designation'] = users?.created_by_designation;
    userDetial['image_token'] = users?.created_by_image_token;
    userDetial['email'] = users?.email;
    userDetial['mobile'] = users?.mobile;
    userDetial['id'] = users?.id;
    userDetial['department'] = users?.department;
    userDetial['status_id'] = users?.status_id? users?.status_id:users?.status?.id;
    userDetial['created_at'] = created? created:null;
   return userDetial;

  }

  addAuditTemplate(){
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeModal(){
    
    $(this.formModal.nativeElement).modal('hide');
    this.addAuditTemplateObject.type = null;
    this._utilityService.detectChanges(this._cdr);
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
        // this.plainDev.style.height = '45px';
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
        // this.plainDev.nativeElement.style.height = 'auto';
      }
    }
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  ngOnDestroy() {
    this.popupControlEventSubscription.unsubscribe()
    this.templateAddModalSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer();
    AuditTemplateStore.searchText = null;
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.networkFailureSubscription.unsubscribe();
    SubMenuItemStore.searchText = '';
    AuditTemplateStore.searchText = '';
    AuditTemplateStore.clearAuditTemplates();
  }

}
