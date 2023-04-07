import { Component, OnInit, ChangeDetectionStrategy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { IReactionDisposer, autorun } from 'mobx';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { Router } from "@angular/router";

import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';

import { IssueListService } from "src/app/core/services/organization/context/issue-list/issue-list.service";
import { IssueListStore } from "src/app/stores/organization/context/issue-list.store";
import { MsTypeStore } from "src/app/stores/organization/business_profile/ms-type/ms-type.store";
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { OrganizationfileService } from "src/app/core/services/organization/organization-file/organizationfile.service";
import { RightSidebarFilterService } from 'src/app/core/services/general/right-sidebar-filter/right-sidebar-filter.service';
import { Subscription } from 'rxjs';
import { RightSidebarLayoutStore } from 'src/app/stores/general/right-sidebar-layout.store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { OrganizationLevelSettingsStore } from "src/app/stores/settings/organization-level-settings.store";
import { ImportItemStore } from 'src/app/stores/general/import-item.store';
import { ProcessStore } from 'src/app/stores/bpm/process/processes.store';
import { OrganizationDashboardStore } from 'src/app/stores/organization/dashboard/organization-dashboard-store';

declare var $: any;
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit {
  @ViewChild('deletePopup') deletePopup: ElementRef;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;
  form: FormGroup;
  formErrors: any;

  AppStore = AppStore;
  IssueListStore = IssueListStore;
  MsTypeStore = MsTypeStore;
  AuthStore = AuthStore;
  OrganizationLevelSettingsStore = OrganizationLevelSettingsStore;

  allIssues: boolean = false;

  deleteEventSubscription: any;

  deleteObject = {
    type:'',
    title: 'Delete Issue?',
    subtitle: 'are_you_sure_delete',
    id: null,
    all: false
  };

  filterSubscription: Subscription = null;

  constructor(
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _route: Router,
    private _formBuilder: FormBuilder,
    private _issueListService: IssueListService,
    private _eventEmitterService: EventEmitterService,
    private _organizationFileService: OrganizationfileService,
    private _rightSidebarFilterService: RightSidebarFilterService,
    private _helperService: HelperServiceService
  ) { }

  ngOnInit() {

    RightSidebarLayoutStore.showFilter = true;

    this.deleteEventSubscription = this._eventEmitterService.deletePopup.subscribe(item => {
      this.modalControl(item);
    })

    this.filterSubscription = this._eventEmitterService.sidebarFilterChanged.subscribe(filter => {
      this.IssueListStore.loaded = false;
      this._utilityService.detectChanges(this._cdr);
      this.pageChange(1);
    })

    SubMenuItemStore.searchText = '';
    IssueListStore.searchText = '';

    IssueListStore.setSelectedIssueId(null);

    NoDataItemStore.setNoDataItems({title: "issues_nodata_title", subtitle: 'issues_nodata_subtitle', buttonText: 'new_issue_button'});

    this.reactionDisposer = autorun(() => {

      var subMenuItems = [
        {activityName: 'ORGANIZATION_ISSUE_LIST', submenuItem: { type: 'search' }},
        {activityName: null, submenuItem: { type: 'refresh'}},
        {activityName: 'CREATE_ORGANIZATION_ISSUE', submenuItem: {type: 'new_modal'}},
        {activityName: 'GENERATE_ORGANIZATION_ISSUE_TEMPLATE', submenuItem: {type: 'template'}},
        {activityName: 'EXPORT_ORGANIZATION_ISSUE', submenuItem: {type: 'export_to_excel'}},
        {activityName: 'IMPORT_ORGANIZATION_ISSUE', submenuItem: {type: 'import'}}
      ]
      if(!AuthStore.getActivityPermission(100,'CREATE_ORGANIZATION_ISSUE')){
        NoDataItemStore.deleteObject('subtitle');
        NoDataItemStore.deleteObject('buttonText');
      }
 
      this._helperService.checkSubMenuItemPermissions(100,subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "new_modal":
            this.createNewIssue();
            break;
          case "template":
            //this._issueListService.generateTemplate();
            var fileDetails = {
              ext: 'xlsx',
              title: 'organization_issue_template',
              size: null
            };
            this._organizationFileService.downloadFile('issues-template', null, null, fileDetails.title, fileDetails);
            break;
          case "export_to_excel":
            this._issueListService.exportToExcel();
            // var fileDetails = {
            //   ext: 'xlsx',
            //   title: 'organization_issues',
            //   size: null
            // };
            // this._organizationFileService.downloadFile('issues-export', null, null, fileDetails.title, fileDetails);
            break;
          case "delete_all":
            this.deleteIssue(null);
            break;
          case "refresh":
              IssueListStore.unsetIssueList();
              this.pageChange(1);
              break;
          case "search":
            IssueListStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            // this.searchIssueList(SubMenuItemStore.searchText);
            break;
          case "import":
            ImportItemStore.setTitle('import_issue');
            ImportItemStore.setImportFlag(true);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      if(NoDataItemStore.clikedNoDataItem){
        this.createNewIssue();
        NoDataItemStore.unSetClickedNoDataItem();
      }
      if(ImportItemStore.importClicked){
        ImportItemStore.importClicked = false;
        this._issueListService.importData(ImportItemStore.getFileDetails).subscribe(res=>{
          ImportItemStore.unsetFileDetails();
          ImportItemStore.setTitle('');
          ImportItemStore.setImportFlag(false);
          $('.modal-backdrop').remove();
          this._utilityService.detectChanges(this._cdr);
        },(error)=>{
          if(error.status == 422){
            ImportItemStore.processFormErrors(error.error.errors);
          }
          else if(error.status == 500 || error.status == 403){
            ImportItemStore.unsetFileDetails();
            ImportItemStore.setImportFlag(false);
            $('.modal-backdrop').remove();
          }
          this._utilityService.detectChanges(this._cdr);
        })
      }
    })

    SubMenuItemStore.setNoUserTab(true);

    // SubMenuItemStore.setSubMenuItems([
    //   { type: 'search' },
    //   { type: 'new_modal' },
    //   { type: 'template' },
    //   { type: 'export_to_excel' },
    // ]);
    RightSidebarLayoutStore.filterPageTag = 'issue_list';
    this._rightSidebarFilterService.setFiltersForCurrentPage([
  
      'organization_ids',
      'division_ids',
      'department_ids',
      'section_ids',
      'sub_section_ids',
      'issue_domain_ids',
      'issue_type_ids',
      'issue_category_ids',
     
      // 'is_internal',
      // 'is_external',
    ]);

    this._utilityService.scrollToTop();
    // this.setIssueSort('organization_issues.reference_code', false);
    this.pageChange(1);

  }

  pageChange(newPage: number = null) {
    if (newPage) IssueListStore.setCurrentPage(newPage);
    // else IssueListStore.setCurrentPage(1);
    var additionalParams=''
      if (OrganizationDashboardStore.dashboardParam) {
        additionalParams = OrganizationDashboardStore.dashboardParam
      }
      this._issueListService.getItems(false,additionalParams ? additionalParams : '').subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  createNewIssue(){
    IssueListStore.unsetIssueDetails();
    ProcessStore.unsetSelectedProcesses();
    this._route.navigateByUrl('/organization/new-issue');
  }

  setIssueSort(type, callList: boolean = true) {
    this._issueListService.sortIssueList(type, callList);
    this.pageChange();
  }

  ngOnDestroy() {
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this._rightSidebarFilterService.resetFilter();
    this.filterSubscription.unsubscribe();
    this.deleteEventSubscription.unsubscribe();
		SubMenuItemStore.searchText = null;
    IssueListStore.searchText = '';
    RightSidebarLayoutStore.showFilter = false;
  }

  editIssue(il) {
    event.stopPropagation();
    this._issueListService.getIssueDetails(il.id).subscribe(res => {
      this._route.navigateByUrl('/organization/edit-issue');
    });
  }

  searchIssueList(searchTerm) {
    IssueListStore.setCurrentPage(1);
    this._issueListService.getItems(false,null,true).subscribe(() => this._utilityService.detectChanges(this._cdr));
  }

  issueSelected(issue) {
    event.stopPropagation();
    issue.checked = !issue.checked;
    this._issueListService.settoSelectedIssueList(issue);
    setTimeout(() => {
      if (IssueListStore.selectedIssueLists.length > 0) {
        SubMenuItemStore.addSubMenu({ type: 'delete_all' });
      }
      else {
        for (var i = 0; i < SubMenuItemStore.subMenuItems.length; i++) {
          if (SubMenuItemStore.subMenuItems[i].type == 'delete_all') {
            SubMenuItemStore.subMenuItems.splice(i, 1);
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  selectAll() {
    if (this.allIssues)
      this._issueListService.setAllIssueList();
    else
      this._issueListService.unsetSelectedIssueList();
    setTimeout(() => {
      if (IssueListStore.selectedIssueLists.length > 0) {
        SubMenuItemStore.addSubMenu({ type: 'delete_all' });
      }
      else {
        for (var i = 0; i < SubMenuItemStore.subMenuItems.length; i++) {
          if (SubMenuItemStore.subMenuItems[i].type == 'delete_all') {
            SubMenuItemStore.subMenuItems.splice(i, 1);
            break;
          }
        }
      }
      this._utilityService.detectChanges(this._cdr);
    }, 100);
  }

  modalControl(status: boolean) {
    switch (this.deleteObject.type) {
      case '': this.delete(status)
        break;
      case 'Activate': this.activateIssue(status)
        break;
      case 'Deactivate': this.deactivateIssue(status)
        break;
    }
  }

  deleteIssue(issue) {
    event.stopPropagation();
    if (issue) {
      this.deleteObject.id = issue.id;
      this.deleteObject.all = false;
      this.deleteObject.type = '';
      this.deleteObject.title = 'Delete Issue';
      this.deleteObject.subtitle = 'are_you_sure_delete';
    }
    else {
      this.deleteObject.id = null;
      this.deleteObject.title = 'Delete Selected Issues';
      this.deleteObject.all = true;
    }
    $(this.deletePopup.nativeElement).modal('show');
  }

  delete(status) {
    // if (status && this.deleteObject.id) {
    //   this._issueListService.deleteItem(this.deleteObject.id).subscribe(resp => {
    //     setTimeout(() => {
    //       this._utilityService.detectChanges(this._cdr);
    //     }, 200);
    //     this.clearDeleteObject();
    //   });
    // }
    // else {
    //   if (this.deleteObject.all) {
    //     // Delete Multiple Issues
    //   }
    //   else
    //     this.clearDeleteObject();
    // }
    // setTimeout(() => {
    //   $(this.deletePopup.nativeElement).modal('hide');
    //   this.allIssues = false;
    //   this.selectAll();
    // }, 250);
    if(status && this.deleteObject.id){
      this._issueListService.deleteItem(this.deleteObject.id).subscribe(res =>{
        this.closeConfirmationPopup();
        this.clearDeleteObject();
        this._utilityService.detectChanges(this._cdr);
      },(error=>{
        if(error.status == 405 && IssueListStore.getIssueListById(this.deleteObject.id).status_id == AppStore.activeStatusId){
          let id = this.deleteObject.id;
          this.closeConfirmationPopup();
          this.clearDeleteObject();
          setTimeout(() => {
            this.deactivate(id);
          }, 500);
        }
        else{
          this.closeConfirmationPopup();
          this.clearDeleteObject();
        }
      }))
    }
    else{
      this.closeConfirmationPopup();
      this.clearDeleteObject();
    }
  }

  closeConfirmationPopup(){
    $(this.deletePopup.nativeElement).modal('hide');
    this._utilityService.detectChanges(this._cdr);
  }

  gotoIssueDetails(issueId) {
    IssueListStore.unsetIssueDetails();
    IssueListStore.setSelectedIssueId(issueId);
    this._route.navigateByUrl('/organization/issue-details/' + IssueListStore.selectedId)
  }

  clearDeleteObject() {
    this.deleteObject.id = null;
    // this.deleteObject.type = '';
    // this.deleteObject.title = 'Delete Issue';
    // this.deleteObject.subtitle = 'This action cannot be undone';
    // this.deleteObject.all = false;
  }

  // for activate 
  activate(id: number) {
    event.stopPropagation();
    this.deleteObject.type = 'Activate';
    this.deleteObject.id = id;
    this.deleteObject.title = 'Activate Issue?';
    this.deleteObject.subtitle = 'are_you_sure_activate';
    $(this.deletePopup.nativeElement).modal('show');
  }

  // for deactivate
  deactivate(id: number) {
    event.stopPropagation();
    this.deleteObject.type = 'Deactivate';
    this.deleteObject.id = id;
    this.deleteObject.title = 'Deactivate Issue?';
    this.deleteObject.subtitle = 'are_you_sure_deactivate';
    $(this.deletePopup.nativeElement).modal('show');
  }

  // calling activcate function
  activateIssue(status: boolean) {
    if (status && this.deleteObject.id) {
      this._issueListService.activateItem(this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        // this.clearDeleteObject();
      });
    }
    else {
      // this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
      this.clearDeleteObject();
    }, 250);

  }

  // calling deactivate function

  deactivateIssue(status: boolean) {
    if (status && this.deleteObject.id) {
      this._issueListService.deactivateItem(this.deleteObject.id).subscribe(resp => {
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        // this.clearDeleteObject();
      });
    }
    else {
      // this.clearDeleteObject();
    }
    setTimeout(() => {
      $(this.deletePopup.nativeElement).modal('hide');
      this.clearDeleteObject();
    }, 250);

  }

  // setSelectAllCheckBox(pageNumber: number){
  //   this.allIssues = IssueListStore.setSelectAllCheckBox(pageNumber);
  //   console.log(this.allIssues);
  //   this.selectAll();
  //   this._utilityService.detectChanges(this._cdr);
  // }

}
