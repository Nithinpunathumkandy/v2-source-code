import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MsAuditService } from 'src/app/core/services/ms-audit-management/ms-audit/ms-audit.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { AuditCheckListStore } from 'src/app/stores/ms-audit-management/audit-check-list/audit-check-list.store';
import { AuditNonConfirmityStore } from 'src/app/stores/ms-audit-management/audit-non-confirmity/audit-non-confirmity.store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

@Component({
  selector: 'app-ms-audit-details',
  templateUrl: './ms-audit-details.component.html',
  styleUrls: ['./ms-audit-details.component.scss']
})
export class MsAuditDetailsComponent implements OnInit {
  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;

  AppStore = AppStore;
  AuthStore = AuthStore;
  MsAuditStore = MsAuditStore;
  AuditNonConfirmityStore = AuditNonConfirmityStore;

    constructor(
    private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _msAuditService: MsAuditService,
    ) { }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scrollEvent, true);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      MsAuditStore.setMsAuditId(id);
    });
    this.getDetails();
  }

  getDetails(){
    this._msAuditService.getItem(MsAuditStore.msAuditId).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }



  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev?.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }
  }

  ngOnDestroy(){
    MsAuditStore.unsetIndividualMsAuditDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    AuditCheckListStore.loaded = false;

  }

}
