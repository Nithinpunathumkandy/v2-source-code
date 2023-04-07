import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';
import { MockDrillService } from 'src/app/core/services/mock-drill/mock-drill/mock-drill.service';
import { MockDrillActionPlanStore } from 'src/app/stores/mock-drill/mock-drill-action-plan/mock-drill-action-plan-store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-details',
  templateUrl: './mock-drill-details.component.html',
  styleUrls: ['./mock-drill-details.component.scss']
})
export class MockDrillDetailsComponent implements OnInit {
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  MockDrillActionPlanStore = MockDrillActionPlanStore;
  MockDrillStore = MockDrillStore;
  constructor(private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _mockDrillService: MockDrillService,
    private _router: Router,
  ) { }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    $("#navigationBar").addClass("d-none")
    // this.getMeetingDetails();
    let id: number;
    MockDrillStore.unsetIndividualMockDrill();
    this.route.params.subscribe(params => {
      id = +params['id'];
      if (id) {
        MockDrillStore.setMockDrillId(id);
        MockDrillStore.loaded = true;
        this._mockDrillService.getItem(MockDrillStore.mock_drill_id).subscribe(res => {
          setTimeout(() => {
            MockDrillStore.loaded = false;
            MockDrillStore.mockDrillStatus = MockDrillStore.selected.mock_drill_plan.mock_drill_status.languages[0].pivot.title;
          }, 500);
        });
      }
      else
        this._router.navigateByUrl('mock-drill/mock-drills');
      BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    });
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

  ngOnDestroy() {
    MockDrillStore.unsetIndividualMockDrill();
    MockDrillActionPlanStore.unSetActionPlans();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    $("#navigationBar").removeClass("d-none")
  }
}