import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MsAuditSchedulesService } from 'src/app/core/services/ms-audit-management/ms-audit-schedules/ms-audit-schedules.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditSchedulesStore } from 'src/app/stores/ms-audit-management/ms-audit-schedules/ms-audit-schedules-store';
import { MsAuditStore } from 'src/app/stores/ms-audit-management/ms-audits/ms-audit-store';

@Component({
  selector: 'app-ms-audit-schedules-detials',
  templateUrl: './ms-audit-schedules-detials.component.html',
  styleUrls: ['./ms-audit-schedules-detials.component.scss']
})
export class MsAuditSchedulesDetialsComponent implements OnInit {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;

  MsAuditSchedulesStore = MsAuditSchedulesStore;
  MsAuditStore=MsAuditStore;

    constructor(
    private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _msAuditSchedulesService: MsAuditSchedulesService
    ) { }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scrollEvent, true);

    SubMenuItemStore.setNoUserTab(true);
    //BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    if(!BreadCrumbMenuItemStore.refreshBreadCrumbMenu){
      BreadCrumbMenuItemStore.makeEmpty();
      BreadCrumbMenuItemStore.addBreadCrumbMenu({
        name:"ms_audit_schedules",
        path:`/ms-audit-management/ms-audit-schedules`
      });
    }

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      MsAuditSchedulesStore.setMsAuditSchedulesId(id);
    })
    this.getDetails(MsAuditSchedulesStore?.msAuditSchedulesId);
  }

  scrollEvent = (event: any): void => {
    if (event.target.documentElement != undefined) {
      const number = event.target.documentElement.scrollTop;
      if (number > 50) {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', '45px');
        this._renderer2.addClass(this.navigationBar?.nativeElement, 'affix');
      }
      else {
        this._renderer2.setStyle(this.plainDev.nativeElement, 'height', 'auto');
        this._renderer2.removeClass(this.navigationBar?.nativeElement, 'affix');
      }
    }
  }

  getDetails(id){
    this._msAuditSchedulesService.getItem(id).subscribe(res => {
    
    });
  }

  ngOnDestroy(){
    MsAuditSchedulesStore.unsetIndividualMsAuditSchedulesDetails();
    BreadCrumbMenuItemStore.makeEmpty();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    MsAuditStore.scheduleRedirect=false;
    MsAuditSchedulesStore.redirectMain=false;
  }
}
