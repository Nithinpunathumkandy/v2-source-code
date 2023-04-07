import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthStore } from 'src/app/stores/auth.store';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MsAuditProgramsStore } from 'src/app/stores/ms-audit-management/ms-audit-programs/ms-audit-programs-store';

@Component({
  selector: 'app-ms-audit-programs-detials',
  templateUrl: './ms-audit-programs-detials.component.html',
  styleUrls: ['./ms-audit-programs-detials.component.scss']
})
export class MsAuditProgramsDetialsComponent implements OnInit {

  AuthStore = AuthStore;

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;

  MsAuditProgramsStore = MsAuditProgramsStore;

    constructor(
    private _renderer2: Renderer2,
    private route: ActivatedRoute,
    ) { }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scrollEvent, true);

    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;

    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      MsAuditProgramsStore.setMsAuditProgramsId(id);
    })
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

  ngOnDestroy(){
    MsAuditProgramsStore.unsetIndividualMsAuditProgramsDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    MsAuditProgramsStore.enableReport=0;
  }
}
