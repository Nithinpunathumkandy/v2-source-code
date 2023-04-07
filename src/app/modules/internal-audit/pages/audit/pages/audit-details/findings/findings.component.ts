import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { AuditService } from 'src/app/core/services/internal-audit/audit/audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';
declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss']
})
export class FindingsComponent implements OnInit , OnDestroy {
  @ViewChild('confirmationPopUp') confirmationPopUp: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
 

  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AppStore= AppStore;
  AuthStore = AuthStore;
  AuditStore = AuditStore;
  AuditFindingsStore = AuditFindingsStore;

  popupObject = {
    type: '',
    title: '',
    id: null,
    subtitle: ''
  };

  popupControlEventSubscription: any;
  constructor(private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _renderer2: Renderer2,
    private _auditFindingsService: AuditFindingsService,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _helperService: HelperServiceService,
    private _auditService: AuditService) { }

  ngOnInit(): void {
    AppStore.showDiscussion = false;
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: null, submenuItem: { type: 'search' }},
        { activityName: null, submenuItem: { type: 'new_modal' }},
        { activityName: null, submenuItem: { type: 'template' }},
        { activityName: null, submenuItem: { type: 'export_to_excel' }}, 
        { activityName: null, submenuItem: { type: 'close', path: '../' } },      
      ]
      this._helperService.checkSubMenuItemPermissions(100, subMenuItems);
  
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            AuditFindingsStore.clearDocumentDetails();
            AuditFindingsStore.unSelectAuditableItem();
            AuditFindingsStore.unSelectChecklists();
           this.addFindings();
            break

            case "template":
            this._auditFindingsService.generateTemplate();
            break;
          case "export_to_excel":
            let params = `?audit_ids=${AuditStore.audit_id}`;
            this._auditFindingsService.exportToExcel(params);
            break;
          case "search":
            AuditFindingsStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.addFindings();
        NoDataItemStore.unSetClickedNoDataItem();
      }

    })
    NoDataItemStore.setNoDataItems({title: "Looks like we don't have any items added here!", subtitle: 'Add an item if there is any. To add, simply tap the button below.', buttonText: 'New Finding'});

    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);


     // for deleting/activating/deactivating using delete modal
     this.popupControlEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

     // setting submenu items
    //  SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   {type:'new_modal'},
    //   { type: 'template' },
    //   { type: 'export_to_excel' },
    //   {type: 'close', path:'../' }

    // ]);
    
    AuditFindingsStore.setOrderBy('asc');
   
    this.pageChange(1);
    
  }

  pageChange(newPage: number = null) {
    AuditFindingsStore.loaded = false;
    let params = "";
    params = `&audit_ids=${AuditStore.audit_id}`;
    if (newPage) AuditFindingsStore.setCurrentPage(newPage);
    this._auditFindingsService.getItems(false,params).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  addFindings(){
    AuditFindingsStore.clearDocumentDetails();
    AuditFindingsStore.unSelectAuditableItem();
    AuditFindingsStore.unSelectChecklists();
    AuditFindingsStore.loaded = false;
    this._router.navigateByUrl('/internal-audit/audits/add-findings');
  }

  gotToAuditFindingsDetails(id:number){
    this._router.navigateByUrl('/internal-audit/findings/'+id);
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

  // modal control event
  modalControl(status: boolean) {
    switch (this.popupObject.type) {
      case '': this.deleteAuditProgram(status)
        break;
    }

  }


  // delete function call
  deleteAuditProgram(status: boolean) {
    if (status && this.popupObject.id) {

      this._auditFindingsService.delete(this.popupObject.id).subscribe(resp => {
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
 
  // for popup object clearing
  clearPopupObject() {
    this.popupObject.id = null;
    this.popupObject.title = '';
    this.popupObject.subtitle = '';
    this.popupObject.type = '';

  }

  
  // for delete
  delete(id: number) {
    event.stopPropagation();
    this.popupObject.type = '';
    this.popupObject.id = id;
    this.popupObject.title = 'Delete Findings?';
    this.popupObject.subtitle = 'This action cannot be undone';

    $(this.confirmationPopUp.nativeElement).modal('show');

  }


  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditFindingsStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    this.popupControlEventSubscription.unsubscribe();
    AuditFindingsStore.loaded == false;

  }



}