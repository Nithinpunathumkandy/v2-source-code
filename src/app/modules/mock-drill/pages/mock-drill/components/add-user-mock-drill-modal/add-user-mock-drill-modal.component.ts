import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { MockDrillStore } from 'src/app/stores/mock-drill/mock-drill/mock-drill-store';

@Component({
  selector: 'app-add-user-mock-drill-modal',
  templateUrl: './add-user-mock-drill-modal.component.html',
  styleUrls: ['./add-user-mock-drill-modal.component.scss']
})
export class AddUserMockDrillModalComponent implements OnInit {
  form: FormGroup;
  MockDrillStore = MockDrillStore;
  formErrors: any;
  constructor(private _eventEmitterService: EventEmitterService, private _formBuilder: FormBuilder,
    private _utilityService: UtilityService, private _cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    // form
    this.form = this._formBuilder.group({
      user_id: null,
      name: ['', [Validators.required]],
      designation: ['', [Validators.required]],
      role: null,
      evacuation_time: null,
      image_token: null,
      is_delete: null,
      is_new: null,
      participant_id: null,
      is_exist: null
    });
  }
  saveOtherUserDetails(isClose) {
    if (MockDrillStore.participants == undefined) MockDrillStore.participants = [];
    if (MockDrillStore.mock_drill_id != undefined) this.form.value.is_new = true;
    this.form.value.is_exist = false;
    var userCount = MockDrillStore.participants.filter(x => x.is_exist == false && x.name.toLowerCase().trim() == this.form.value.name.toLowerCase().trim() && x.designation.toLowerCase().trim() == this.form.value.designation.toLowerCase().trim()).length;
    if (userCount == 0) {
      MockDrillStore.participants.push(this.form.value);
      this._utilityService.detectChanges(this._cdr);
      this.form.reset();
      if (isClose) this.cancel();
    }
    else
      this._utilityService.showWarningMessage('', "User Already Exist!");
  }
  cancel() {
    this._eventEmitterService.dismissUserMockDrillModalControl();
  }
}
