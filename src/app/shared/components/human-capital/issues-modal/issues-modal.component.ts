import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Issue, IssueList } from 'src/app/core/models/organization/context/issue-list';
import { DepartmentService } from 'src/app/core/services/masters/organization/department/department.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { IssueCategoryService } from 'src/app/core/services/masters/organization/issue-category/issue-category.service';
import { IssueDomainService } from 'src/app/core/services/masters/organization/issue-domain/issue-domain.service';
import { IssueTypeService } from 'src/app/core/services/masters/organization/issue-type/issue-type.service';
import { IssueListService } from 'src/app/core/services/organization/context/issue-list/issue-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DepartmentMasterStore } from 'src/app/stores/masters/organization/department-store';
import { IssueCategoryMasterStore } from 'src/app/stores/masters/organization/issue-category-master.store';
import { IssueDomainMasterStore } from 'src/app/stores/masters/organization/issue-domain-master.store';
import { IssueTypeMasterStore } from 'src/app/stores/masters/organization/issue-type-master.store';
import { IssueListStore } from 'src/app/stores/organization/context/issue-list.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';

@Component({
  selector: 'app-issues-modal',
  templateUrl: './issues-modal.component.html',
  styleUrls: ['./issues-modal.component.scss']
})
export class IssuesModalComponent implements OnInit {
  @Input('issuesModalTitle') issuesModalTitle: any;
  @Input('title') title:boolean=false;

  selectedIssues: IssueList[] = [];

  department_ids = null;
  issue_type_id = null;
  issue_category_id = null;
  issue_domain_id = null;
  searchTerm = null;
  emptyIssue = "no_issues_available"
  modalDescription :any;
  AppStore = AppStore;
  IssueListStore = IssueListStore;
  IssueCategoryStore = IssueCategoryMasterStore;
  IssueDomainMasterStore = IssueDomainMasterStore;
  IssueTypeStore = IssueTypeMasterStore;
  DepartmentStore = DepartmentMasterStore;

  constructor(private _utilityService: UtilityService,
    private _issueListService: IssueListService,
    private _eventEmitterService: EventEmitterService,
    private _cdr: ChangeDetectorRef,
    private _helperService:HelperServiceService,
    private _departmentService: DepartmentService,
    private _issueCategoryService: IssueCategoryService,
    private _issueTypeService: IssueTypeService,
    private _issueDomainService: IssueDomainService
  ) { }

  ngOnInit(): void {
    this.selectedIssues = IssueListStore.selectedIssuesList;
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) IssueListStore.setCurrentPage(newPage);
    else IssueListStore.setCurrentPage(1);
    this._issueListService.getItems(false, this.generateSortParams(), false).subscribe((res) => {
      setTimeout(() => {
        document.getElementById('selectall')['checked'] = false;
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    });
  }


  save(close: boolean = false) {
    IssueListStore.saveSelected = true;
    this._issueListService.selectRequiredIssues(this.selectedIssues);
    let title = this.issuesModalTitle?.component ? this.issuesModalTitle?.component : 'item'
    if (this.selectedIssues.length > 0) this._utilityService.showSuccessMessage('issues_selected', 'Selected issues are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully');
    if (close) this.cancel();
  }
  cancel() {
    // console.log('hai');
    if (IssueListStore.saveSelected) {
      this._eventEmitterService.dismissIssueSelectModal();
      this.searchTerm=null;

    }
    else {
      this.selectedIssues = [];
      IssueListStore.saveSelected = false;
      this._eventEmitterService.dismissIssueSelectModal();
      this.searchTerm=null;

    }


  }



  searchIssues() {

    IssueListStore.setCurrentPage(1);
    var searchParams = this.generateSortParams();
    this._issueListService.getItems(false, searchParams).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });

  }


  generateSortParams() {
    var params = '';
    if (this.department_ids) params = params + `department_ids=${this.department_ids}`;
    if (this.issue_type_id) {
      params = params + `&issue_type_ids=${this.issue_type_id}`;
    }
    if (this.issue_category_id) {
      params = params + `&issue_category_ids=${this.issue_category_id}`;
    }
    if (this.issue_domain_id) {
      params = params + `&issue_domain_ids=${this.issue_domain_id}`;
    }
    if (this.searchTerm)
      params = params + `&q=${this.searchTerm}`;
    return params;
  }

  sortIssues() {
    var params = this.generateSortParams();
    this._issueListService.getItems(false, params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  setIssueSort(type) {

    this._issueListService.sortIssueList(type, false, this.generateSortParams());
    this.pageChange(1)
    this._utilityService.detectChanges(this._cdr);
  }

  searchDepartment(e) {
    this._departmentService.getItems(false, '&q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getDepartment() {
    this._departmentService.getItems().subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    });
  }

  getIssueCategory() {
    this._issueCategoryService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchIssueCategory(e) {
    this._issueCategoryService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getIssueType() {
    this._issueTypeService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchIssueType(e) {
    this._issueTypeService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  getDomain() {
    this._issueDomainService.getItems(false).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  searchDomain(e) {
    this._issueDomainService.getItems(false, 'q=' + e.term).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })

  }

  clear() {
    this.searchTerm = null;
    this.pageChange(1);
  }

  selectAllIssues(e) {
    // if(event.target.checked){
    //   this.selectedIssues = IssueListStore.issueListDetails;
    // }
    // else{
    //   this.selectedIssues = [];
    // }

    if (e.target.checked) {
      for (let i of IssueListStore.issueListDetails) {
        var pos = this.selectedIssues.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedIssues.push(i);
        }
      }
    } else {
      for (let i of IssueListStore.issueListDetails) {
        var pos = this.selectedIssues.findIndex(e => e.id == i.id);
        if (pos != -1) {
          this.selectedIssues.splice(pos, 1);
        }
      }
    }
  }

  issueSelected(issues) {
    var pos = this.selectedIssues.findIndex(e => e.id == issues.id);
    if (pos != -1)
      this.selectedIssues.splice(pos, 1);
    else
      this.selectedIssues.push(issues);
  }


  issuePresent(id) {
    const index = this.selectedIssues.findIndex(e => e.id == id);
    if (index != -1)
      return true;
    else
      return false;
  }


}
