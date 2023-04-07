import { ChangeDetectorRef, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TestAndExerciseService } from 'src/app/core/services/bcm/test-and-exercise/test-and-exercise.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { TestAndExerciseStore } from 'src/app/stores/bcm/test-exercise/test-and-exercise.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { OrganizationModulesStore } from 'src/app/stores/settings/organization-modules.store';

@Component({
  selector: 'app-test-and-exercise-details',
  templateUrl: './test-and-exercise-details.component.html',
  styleUrls: ['./test-and-exercise-details.component.scss']
})
export class TestAndExerciseDetailsComponent implements OnInit {

  @ViewChild('navigationBar') navigationBar: ElementRef;
  @ViewChild('plainDev') plainDev: ElementRef;

  OrganizationModulesStore = OrganizationModulesStore
  TestAndExerciseStore = TestAndExerciseStore
  constructor(
    private _renderer2: Renderer2,
    private route: ActivatedRoute,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _testAndExerciseService: TestAndExerciseService
  ) { }

  ngOnInit(): void {
    window.addEventListener('scroll', this.scrollEvent, true)
    SubMenuItemStore.setNoUserTab(true);
    
    let id: number;
    this.route.params.subscribe(params => {
      id = +params['id']; 
      TestAndExerciseStore.selectedId = id
      TestAndExerciseStore.detailsLoaded = false
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
    SubMenuItemStore.makeEmpty();
  }

}
