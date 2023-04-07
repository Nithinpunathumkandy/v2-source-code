import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { autorun, IReactionDisposer } from 'mobx';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { TestAndExerciseStatusesService } from 'src/app/core/services/masters/bcm/test-and-exercise-statuses/test-and-exercise-statuses.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { NoDataItemStore } from 'src/app/stores/general/no-data-item.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { TestAndExerciseStatusesMasterStore } from 'src/app/stores/masters/bcm/test-and-exercise-statuses-store';

@Component({
  selector: 'app-test-and-exercise-statuses',
  templateUrl: './test-and-exercise-statuses.component.html',
  styleUrls: ['./test-and-exercise-statuses.component.scss']
})
export class TestAndExerciseStatusesComponent implements OnInit {


  TestAndExerciseStatusesMasterStore = TestAndExerciseStatusesMasterStore;
  reactionDisposer: IReactionDisposer;
  SubMenuItemStore = SubMenuItemStore;

  constructor(
    private _testExcerciseStatusService: TestAndExerciseStatusesService,
    private _helperService: HelperServiceService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    NoDataItemStore.setNoDataItems({ title: "common_nodata_title"});
    this.reactionDisposer = autorun(() => {
      var subMenuItems = [
        { activityName: 'TEST_AND_EXERCISE_STATUS_LIST', submenuItem: { type: 'search' } },  
        { activityName: 'EXPORT_TEST_AND_EXERCISE_STATUS', submenuItem: { type: 'export_to_excel' } },
        { activityName: null, submenuItem: { type: 'close', path: 'bcm' } },
      ]
      this._helperService.checkSubMenuItemPermissions(1100, subMenuItems);

      if (SubMenuItemStore.clikedSubMenuItem) {
        switch (SubMenuItemStore.clikedSubMenuItem.type) {
           
          case "export_to_excel":
            this._testExcerciseStatusService.exportToExcel();
            break;
          case "search":
            TestAndExerciseStatusesMasterStore.searchText = SubMenuItemStore.searchText;
            this.pageChange(1);
            break;
          
          
          default:
            break;
        }
        //Don't forget to unset clicked item immediately after using it
        SubMenuItemStore.unSetClickedSubMenuItem();
      }

    })

    // TestAndExerciseStatusesMasterStore.setOrderBy('asc');
    this.pageChange(1);
  }
 pageChange(newPage: number = null) {
    if (newPage) TestAndExerciseStatusesMasterStore.setCurrentPage(newPage);
    this._testExcerciseStatusService.getItems(false, null, true).subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  sortTitle(type: string) {
    this._testExcerciseStatusService.sortBcsStatus(type, SubMenuItemStore.searchText);
    this.pageChange();
  }

  ngOnDestroy() {
    // Don't forget to dispose the reaction in ngOnDestroy. This is very important!
    if (this.reactionDisposer) this.reactionDisposer();
    SubMenuItemStore.makeEmpty();
    TestAndExerciseStatusesMasterStore.searchText = '';
    TestAndExerciseStatusesMasterStore.currentPage = 1 ;
    }

}
