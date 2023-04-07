import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IReactionDisposer } from 'mobx';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ProjectMonitoringService } from 'src/app/core/services/project-monitoring/project-monitoring/project-monitoring.service';
import { ProjectWorkflowService } from 'src/app/core/services/project-monitoring/project-workflow/project-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ExternalUsersStore } from 'src/app/stores/project-monitoring/external-users-store';
import { BudgetStore } from 'src/app/stores/project-monitoring/project-budget-store';
import { ProjectChangeRequestStore } from 'src/app/stores/project-monitoring/project-change-request-store';
import { ProjectClosureStore } from 'src/app/stores/project-monitoring/project-closure';
import { ProjectDocumentStore } from 'src/app/stores/project-monitoring/project-document-store';
import { ProjectIssueStore } from 'src/app/stores/project-monitoring/project-issue-store';
import { ProjectMilestoneStore } from 'src/app/stores/project-monitoring/project-milestone-store';
import { ProjectMonitoringStore } from 'src/app/stores/project-monitoring/project-monitoring.store';
import { RiskStore } from 'src/app/stores/project-monitoring/project-risk-store';
import { ProjectTeamStore } from 'src/app/stores/project-monitoring/project-team-store';
@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('preview', {static: true}) preview: ElementRef;


  SubMenuItemStore = SubMenuItemStore;
  ProjectMonitoringStore = ProjectMonitoringStore
  reactionDisposer: IReactionDisposer;
  projectProgressEventSubscrion: any;
  previewObject = {
    id : null,
    type : null,
    value : null
  }
  constructor(private _renderer2: Renderer2, private _router: ActivatedRoute,private _utilityService: UtilityService,private _cdr: ChangeDetectorRef,
    private _route: Router,private _helperService : HelperServiceService, private _projectService : ProjectMonitoringService,
    private _projectWorkflowService : ProjectWorkflowService,private _eventEmitterService: EventEmitterService,) { }

  ngOnInit(): void {
    let id: number;
    this._router.params.subscribe(params => {
      id = +params['id'];
      if(id){
        ProjectMonitoringStore.setSelectedProjectId(id)
        this.getInduvalProfileInformation(id)
      }else{

      }
    });
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    setTimeout(() => {
      this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
      window.addEventListener('scroll',this.scrollEvent,true);
    }, 1000);
    this.projectProgressEventSubscrion = this._eventEmitterService.previewModal.subscribe(item => {
      this.closePriewModal()
    })

  }

  getInduvalProfileInformation(id){
    this._projectService.getItem(id).subscribe(res=>{
      if(res.project_type.is_budgeted == 1){
        ProjectMonitoringStore.isBudgeted = true
      }else {
        ProjectMonitoringStore.isBudgeted = false
      }
      this.getWorkflow()
      this._utilityService.detectChanges(this._cdr);
    })
  }

  getWorkflow() {
    this._projectWorkflowService.getItems(ProjectMonitoringStore.selectedProjectId).subscribe(res=>{
      this._utilityService.detectChanges(this._cdr);
    })
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navBar.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navBar.nativeElement, 'affix');
      }
    }
  }

  openPreviewModal(){
    this.previewObject.type = 'Add';
    this.previewModal();
  }

  previewModal(){
    this._renderer2.addClass(this.preview.nativeElement,'show');
    this._renderer2.setStyle(this.preview.nativeElement,'display','block');
    this._renderer2.setStyle(this.preview.nativeElement,'overflow','auto');
    this._renderer2.setStyle(this.preview.nativeElement,'z-index',99999);
  }

  closePriewModal(){
 
    setTimeout(() => {
      this.previewObject.type = null;
      this.previewObject.value = null;
      this._renderer2.removeClass(this.preview.nativeElement,'show');
      this._renderer2.setStyle(this.preview.nativeElement,'display','none');
      $('.modal-backdrop').remove();
      this._utilityService.detectChanges(this._cdr);
    }, 200);
  }
  ngOnDestroy(){
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    this.projectProgressEventSubscrion.unsubscribe();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    ProjectMonitoringStore.individualLoaded = false;
    ProjectIssueStore.loaded = false;
    ProjectMilestoneStore.mileStonesLoaded = false
    ProjectMonitoringStore.scopeOfWorkLoaded = false
    ProjectMonitoringStore.strategicAlignmentLoaded = false
    ProjectChangeRequestStore.loaded = false
    ProjectDocumentStore.loaded = false 
    BudgetStore.loaded = false
    ProjectClosureStore.loaded = false
    ProjectTeamStore.individualLoaded = false
    ExternalUsersStore.loaded = false
    RiskStore.loaded = false
  }

}
