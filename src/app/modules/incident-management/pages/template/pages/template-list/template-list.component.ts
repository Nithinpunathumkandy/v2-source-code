import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { IncidentTemplates } from 'src/app/core/models/incident-management/incident-template/incidet-template';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentFileService } from 'src/app/core/services/incident-management/incident-file-service/incident-file.service';
import { IncidentTemplateService } from 'src/app/core/services/incident-management/incident-template/incident-template.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { IncidentTemplateStore } from 'src/app/stores/incident-management/template/incident-template-store';
declare var $: any;

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit {
  @ViewChild('formModal', { static: true }) formModal: ElementRef;
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  IncidentTemplateStore = IncidentTemplateStore
  AppStore = AppStore;
  addIncidentTemplateObject = {
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
  templateAddModalSubscription: any;
  popupControlEventSubscription: any;


  constructor( 
    private _helperService: HelperServiceService,
    private _renderer2: Renderer2,
    private _eventEmitterService:EventEmitterService,
    private _utilityService: UtilityService, 
    private _router: Router,
    private _cdr: ChangeDetectorRef, 
    private _templateService : IncidentTemplateService,
    private _incidentFileService:IncidentFileService
    ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        {activityName: 'AUDIT_REPORT_TEMPLATE_LIST', submenuItem: {type: 'search'}},
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
              this.addIncidentTemplateObject.type = 'Add';
              this.addIncidentTemplateObject.values = null; // for clearing the value
              this._utilityService.detectChanges(this._cdr);
              this.addIncidentTemplate()          
              }, 1000);
            break;
          case "template":
            this._templateService.generateTemplate();
            break;
          case "export_to_excel":
            this._templateService.exportToExcel();
            break;
          case "search":
             IncidentTemplateStore.searchText = SubMenuItemStore.searchText;
             this.pageChange(1);
            break;
          case "refresh":
            IncidentTemplateStore.loaded = false;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

      if(NoDataItemStore.clikedNoDataItem){
        this.addIncidentTemplateObject.type = 'Add';
        this.addIncidentTemplateObject.values = null;
        this.addIncidentTemplate()          
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.deleteTemplate(item);
    })
    NoDataItemStore.setNoDataItems({title: "common_nodata_title", subtitle: 'common_nodata_subtitle', buttonText: 'new_incident_template'});
    this.templateAddModalSubscription = this._eventEmitterService.incidentTemplateAddModal.subscribe(res=>{
      this.closeModal()
      this._utilityService.detectChanges(this._cdr);
    });
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this.pageChange()
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

  pageChange(newPage:number=null){
    if (newPage) IncidentTemplateStore.setCurrentPage(newPage);
    this._templateService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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

  addIncidentTemplate(){
    setTimeout(() => {
      $(this.formModal.nativeElement).modal('show');
    }, 100);
  }

  closeModal(){
    
    $(this.formModal.nativeElement).modal('hide');
    this.addIncidentTemplateObject.type = null;
    this.pageChange();
    this._utilityService.detectChanges(this._cdr);
  }

  getIncidentTemplate(id: number){
    event.stopPropagation();

    this._templateService.getItem(id).subscribe(res=>{

      if(IncidentTemplateStore.individualLoaded){

        const auditProgram: IncidentTemplates = IncidentTemplateStore.IncidentTemplateDetails;
        this.addIncidentTemplateObject.values = {
          id: auditProgram.id,
          title: auditProgram.title,
          description: auditProgram.description,
        }
        this.addIncidentTemplateObject.type = 'Edit';
        this.addIncidentTemplate()          
      }
      this._utilityService.detectChanges(this._cdr);
    })
  
  }

  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'are_you_sure_delete';
    this.popupObject.subtitle = 'delete_incident_template';
    $(this.confirmationPopUp.nativeElement).modal('show');
  }

  deleteTemplate(status: boolean) {
    if (status && this.popupObject.id) {

      this._templateService.delete(this.popupObject.id).subscribe(resp => {
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

  
  gotToIncidentTemplateDetails(id: number){
    this._router.navigateByUrl('/incident-management/incident-report-templates/'+id);
  }

  getTimezoneFormatted(time){
    return this._helperService.timeZoneFormatted(time);
  }

  createPrevImageUrl(type, token) {//doc
    return this._incidentFileService.getThumbnailPreview(type, token);
  }

  ngOnDestroy() {
    this.popupControlEventSubscription.unsubscribe()
    this.templateAddModalSubscription.unsubscribe()
    if (this.reactionDisposer) this.reactionDisposer();
    // AuditTemplateStore.searchText = null;
    SubMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    IncidentTemplateStore.searchText=null;
    SubMenuItemStore.searchText = '';
  }

}
