import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { autorun, IReactionDisposer } from 'mobx';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { fileUploadPopupStore } from 'src/app/stores/file-upload-popup/fileUploadPopup.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { AuditProgramMasterStore } from 'src/app/stores/internal-audit/audit-program/audit-program-store';
import { AuditStore } from 'src/app/stores/internal-audit/audit/audit-store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-findings',
  templateUrl: './findings.component.html',
  styleUrls: ['./findings.component.scss']
})
export class FindingsFromProgramComponent implements OnInit , OnDestroy {
  @ViewChild('plainDev') plainDev: ElementRef;
  BreadCrumbMenuItemStore = BreadCrumbMenuItemStore;
  SubMenuItemStore = SubMenuItemStore;
  reactionDisposer: IReactionDisposer;
  AppStore= AppStore;
  AuthStore = AuthStore;
  AuditStore = AuditStore;
  AuditFindingsStore = AuditFindingsStore;
  AuditProgramMasterStore = AuditProgramMasterStore;
  findingsEmptyList = "Look like We Don't Have Any Findings In this Audit Program";

  constructor(private _cdr: ChangeDetectorRef,
    private _router: Router,
    private _renderer2: Renderer2,
    private _auditFindingsService: AuditFindingsService,
    private _utilityService: UtilityService,) { }

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
      
    })
    NoDataItemStore.setNoDataItems({ title: "Looks like we don't have any findings to show under this program!", subtitle: '', buttonText: '' });

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

  pageChange(newPage: number = null) {
    if (newPage) AuditStore.setCurrentPage(newPage);
    this._auditFindingsService.getAuditFindingsForAuditProgram(AuditProgramMasterStore.auditProgramId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
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

  
  gotToAuditFindingsDetails(id:number){
    this.clearCommonFilePopupDocuments ()
    this._router.navigateByUrl('/internal-audit/findings/'+id);
  }
  clearCommonFilePopupDocuments(){
    fileUploadPopupStore.clearFilesToDisplay();
    fileUploadPopupStore.clearKHFiles();
    fileUploadPopupStore.clearSystemFiles();
    fileUploadPopupStore.clearUpdateFiles();
  }

  

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    AuditStore.searchText = null;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AuditFindingsStore.findingsFromAuditProgramloaded = false;

  }



}

