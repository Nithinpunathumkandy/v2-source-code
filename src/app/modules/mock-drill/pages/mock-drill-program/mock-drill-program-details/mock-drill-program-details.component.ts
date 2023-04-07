import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDrillProgramService } from 'src/app/core/services/mock-drill/mock-drill-program/mock-drill-program.service';
import { BreadCrumbMenuItemStore } from 'src/app/stores/general/breadcrumb-menu.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';
import { OrganizationGeneralSettingsStore } from 'src/app/stores/settings/organization-general-settings.store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-program-details',
  templateUrl: './mock-drill-program-details.component.html',
  styleUrls: ['./mock-drill-program-details.component.scss']
})
export class MockDrillProgramDetailsComponent implements OnInit {
  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  OrganizationGeneralSettingsStore = OrganizationGeneralSettingsStore;
  MockDrillProgramStore = MockDrillProgramStore;
  constructor(private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _mockDrillProgramService: MockDrillProgramService,
    private _router: Router,) { }

  ngOnInit(): void {

    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = true;
    $("#navigationBar").addClass("d-none")
    // this.getMeetingDetails();
    let id: number;
    MockDrillProgramStore.unsetIndividualMockDrillProgram();
    this.route.params.subscribe(params => {
      id = +params['id'];
      if (id) {
        MockDrillProgramStore.setMockDrillProgramId(id);
        MockDrillProgramStore.loaded = true;
        this._mockDrillProgramService.getItem(MockDrillProgramStore.mock_drill_program_id).subscribe(res => {
          setTimeout(() => {
            MockDrillProgramStore.loaded = false;
            // MockDrillProgramStore.mockDrillStatus = MockDrillProgramStore.selectedProgram.mock_drill_plan.mock_drill_status.languages[0].pivot.title;
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
    MockDrillProgramStore.unsetIndividualMockDrillProgram();
    BreadCrumbMenuItemStore.displayBreadCrumbMenu = false;
    $("#navigationBar").removeClass("d-none")
  }
}
