import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillService } from 'src/app/core/services/mock-drill/mock-drill/mock-drill.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AuthStore } from 'src/app/stores/auth.store';
import { SubMenuItemStore } from 'src/app/stores/general/sub-menu-item.store';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';

@Component({
  selector: 'app-mock-drill-review-modal',
  templateUrl: './mock-drill-review-modal.component.html',
  styleUrls: ['./mock-drill-review-modal.component.scss']
})
export class MockDrillReviewModalComponent implements OnInit {


  form: FormGroup;
  MockDrillStore = MockDrillStore;
  SubMenuItemStore = SubMenuItemStore;
  formErrors: any;
  constructor(private _eventEmitterService: EventEmitterService, private _formBuilder: FormBuilder, public _helperService: HelperServiceService,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef, private _mockDrillService: MockDrillService, private _router: Router) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      comments: null,//['', [Validators.required]]
    });
  }

  cancel() {
    this._eventEmitterService.dismissUserMockDrillModalControl();
  }
  saveDetails() {
    if (MockDrillStore.mockDrillWorkflowStatus == "submit")
      SubMenuItemStore.submitClicked = true;
    if (MockDrillStore.mockDrillWorkflowStatus == "approve")
      SubMenuItemStore.approveClicked = true;
    this._mockDrillService.reviewMockDrill(MockDrillStore.mockDrillWorkflowStatus, { comment: this.form.value.comments }).subscribe(res => {
      this._eventEmitterService.dismissReviewMockDrillModalControl();
      this.form.reset();
      SubMenuItemStore.submitClicked = false;
      SubMenuItemStore.approveClicked = false;
      this._utilityService.detectChanges(this._cdr);
    }, (error => {
      if (error.status == 423) {
        this._utilityService.showWarningMessage("Error", "doesn't_have_a_approver");
        this._router.navigateByUrl('mock-drill/mock-drills/' + MockDrillStore.selected.id);
      }
      this._eventEmitterService.dismissReviewMockDrillModalControl();
      this.form.reset();
      SubMenuItemStore.submitClicked = false;
      SubMenuItemStore.approveClicked = false;
      this._utilityService.detectChanges(this._cdr);
    }));
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }
}
