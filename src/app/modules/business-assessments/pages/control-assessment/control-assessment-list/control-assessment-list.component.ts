import { ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef, Renderer2,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { IReactionDisposer, autorun } from 'mobx';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { DocumentsService } from 'src/app/core/services/knowledge-hub/documents/documents.service';
import { DocumentsStore } from 'src/app/stores/knowledge-hub/documents/documents.store';
import { ControlAssessmentStore } from 'src/app/stores/business-assessments/control-assessment/control-assessment.store';
import { ControlAssessmentDashboardService } from 'src/app/core/services/business-assessments/control-asessment/control-assessment-dashboard/control-assessment-dashboard.service';
import { catchError,takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
@Component({
  selector: 'app-control-assessment-list',
  templateUrl: './control-assessment-list.component.html',
  styleUrls: ['./control-assessment-list.component.scss']
})
export class ControlAssessmentListComponent implements OnInit,OnDestroy {
  @ViewChild('navBar') navBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  DocumentsStore = DocumentsStore;
  ControlAssessmentStore=ControlAssessmentStore;
  OrganizationGeneralSettingsStore=OrganizationGeneralSettingsStore;
  private destroy$ = new Subject<void>();
  docListing=[];
  constructor(
    private _helperService: HelperServiceService,
    private documentsService: DocumentsService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _renderer2: Renderer2,
    private _router: Router,
    private _controlAssessmentDashboardService:ControlAssessmentDashboardService
  ) { }

  ngOnInit(): void {
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'CREATE_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'search' } },
        { activityName: 'BUSINESS_ASSESSMENT_FRAMEWORK_LIST', submenuItem: { type: 'refresh' } },
        // { activityName: 'GENERATE_BUSINESS_ASSESSMENT_FRAMEWORK_TEMPLATE', submenuItem: { type: 'template' } },
        //{ activityName: 'EXPORT_BUSINESS_ASSESSMENT_FRAMEWORK', submenuItem: { type: 'export_to_excel' } },
        // { activityName: '', submenuItem: { type: 'close' } },
      ]

      this._helperService.checkSubMenuItemPermissions(1800, subMenuItems);

      NoDataItemStore.setNoDataItems({title: "control_assessment_nodata_title",});
      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
          case "refresh":
            DocumentsStore.documentsLoaded=false;
            SubMenuItemStore.searchText = '';
            DocumentsStore.searchText = '';
              this.pageChange(1)
              break;
          case "search":
            DocumentsStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          default:
            break;
        }
        // Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }
      
    })
    this.pageChange(1);
  }
  
  pageChange(page:number)
  {
    DocumentsStore.currentPage=page;
    DocumentsStore.itemsPerPage=15;
    this.documentsService.getAllItems("?is_not_master_document_list&is_published=true&").subscribe((res) => {
      this.docListing=res.data;
      let k=0;
      for(let i of this.docListing)
      {
        if(i.document_version_id)
        {
          this.getLastAssessmentDetails(i.document_version_id,k);
        }
        k++;
      }
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getLastAssessmentDetails(id,index)
  {
    this._controlAssessmentDashboardService.getControlCount(id).pipe(takeUntil(this.destroy$)).subscribe((res) => {
      if( this.docListing.length)
      {
        this.docListing[index].maturity_count=res;
      }
      
      
    this._utilityService.detectChanges(this._cdr)});
  }

  getDetails(item)
  {
    ControlAssessmentStore.setDocumentVersionId(item?.document_version_id);
    ControlAssessmentStore.setDocument(item);
    this._router.navigateByUrl('/business-assessments/control-assessments/'+item?.document_version_id);
  }

  scrollEvent = (event: any): void => {
    if(event.target.documentElement){
      const number = event.target.documentElement.scrollTop;
      if(number > 50){
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','45px');
        this._renderer2.addClass(this.navBar.nativeElement,'affix');
      }
      else{
        this._renderer2.setStyle(this.plainDev.nativeElement,'height','auto');
        this._renderer2.removeClass(this.navBar.nativeElement,'affix');
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    DocumentsStore.searchText = '';
    SubMenuItemStore.searchText = '';
    DocumentsStore.currentPage=1;
    DocumentsStore.unsetDocuments();
    ControlAssessmentStore.unsetControlAssessment();
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
  }
}
