import { Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { KpisStore } from 'src/app/stores/kpi-management/kpi/kpis-store';

@Component({
  selector: 'app-kpi-details',
  templateUrl: './kpi-details.component.html',
  styleUrls: ['./kpi-details.component.scss']
})
export class KpiDetailsComponent implements OnInit, OnDestroy {

  @ViewChild('plainDev') plainDev: ElementRef;
  @ViewChild('navigationBar') navigationBar: ElementRef;

  KpisStore = KpisStore;

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
      KpisStore.setKpiId(id);
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
    KpisStore.unsetIndividualKpiDetails();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
  }

}
