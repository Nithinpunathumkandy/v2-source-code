import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { MockDrillTypesService } from 'src/app/core/services/masters/mock-drill/mock-drill-types/mock-drill-types.service';
import { MockDrillProgramService } from 'src/app/core/services/mock-drill/mock-drill-program/mock-drill-program.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { MockDrillTypesMasterStore } from 'src/app/stores/masters/mock-drill/mock-drill-types-store';
import { MockDrillProgramStore } from 'src/app/stores/mock-drill/mock-drill-program/mock-drill-program-store';
declare var $: any;
@Component({
  selector: 'app-mock-drill-preplan',
  templateUrl: './mock-drill-preplan.component.html',
  styleUrls: ['./mock-drill-preplan.component.scss']
})
export class MockDrillPreplanComponent implements OnInit {
  @Input('source') MockDrillPreplanSource: any;
  form: any;
  formErrors: any;
  AppStore = AppStore;
  MockDrillTypesMasterStore = MockDrillTypesMasterStore;
  constructor(private _formBuilder: FormBuilder, private _helperService: HelperServiceService, private _utilityService: UtilityService, private _mockDrillProgramService: MockDrillProgramService, private _cdr: ChangeDetectorRef
    , private _mockDrillTypeService: MockDrillTypesService,) { }

  ngOnInit(): void {
    this.getMOckDrillType();
    setTimeout(() => {
      if (this.MockDrillPreplanSource.id) {
        this.form.patchValue({
          start_date: this._helperService.processDate(this.MockDrillPreplanSource.start_date, 'split'),
          end_date: this._helperService.processDate(this.MockDrillPreplanSource.end_date, 'split')
        });
      }
    }, 600);
  }
  ngOnChanges() {
    if (this.MockDrillPreplanSource.id)
      this.form = this._formBuilder.group({
        start_date: [null, [Validators.required]],
        end_date: [null, [Validators.required]],
      });
    else
      this.form = this._formBuilder.group({
        mock_drill_type: [null, [Validators.required]],
        start_date: [null, [Validators.required]],
        end_date: [null, [Validators.required]],
      });
    if (this.MockDrillPreplanSource.id) {
      this.form.patchValue({
        start_date: this._helperService.processDate(this.MockDrillPreplanSource.start_date, 'split'),
        end_date: this._helperService.processDate(this.MockDrillPreplanSource.end_date, 'split')
      });
    }

  }
  // Get Mock Drill Type
  getMOckDrillType() {
    this._mockDrillTypeService.getItems(false, '', true).subscribe(res => { this._utilityService.detectChanges(this._cdr); })
  }
  resetForm() {
    this.form.reset();
    this.formErrors = null;
  }
  // Search Mock Drill Type
  searchMOckDrillType(e) {
    this._mockDrillTypeService.getItems(false, '?q=' + e.term, true).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  save(isClose) {
    if (this.form.value) {
      this.formErrors = null;
      let save;
      AppStore.enableLoading();
      if (this.MockDrillPreplanSource.id) {
        save = this._mockDrillProgramService.updatePreplanItem(this.MockDrillPreplanSource.id,
          {
            start_date: this._helperService.passSaveFormatDate(new Date(this.form.value.start_date.year, this.form.value.start_date.month, this.form.value.start_date.day)).substring(0, 10),
            end_date: this._helperService.passSaveFormatDate(new Date(this.form.value.end_date.year, this.form.value.end_date.month, this.form.value.end_date.day)).substring(0, 10)
          });
      } else {
        save = this._mockDrillProgramService.savePreplanItem(
          {
            mock_drill_program_id: this.MockDrillPreplanSource.mock_drill_program_id,
            mock_drill_type_id: this.form.value.mock_drill_type.id,
            start_date: this._helperService.passSaveFormatDate(new Date(this.form.value.start_date.year, this.form.value.start_date.month, this.form.value.start_date.day)).substring(0, 10),
            end_date: this._helperService.passSaveFormatDate(new Date(this.form.value.end_date.year, this.form.value.end_date.month, this.form.value.end_date.day)).substring(0, 10)
          }
        );
      }
      save.subscribe(
        (res: any) => {
          AppStore.disableLoading();
          this._utilityService.detectChanges(this._cdr);
          if (isClose || !this.MockDrillPreplanSource.id) {
            this.resetForm();
            if (isClose) { $("#close").click() }
          }
          // else if (this.MockDrillPreplanSource.mock_drill_type_id == null || this.MockDrillPreplanSource.mock_drill_type_id == undefined || this.MockDrillPreplanSource.mock_drill_type_id == 0) {
          //   this.resetForm();
          // }D
          MockDrillProgramStore.loaded = true;
          this._mockDrillProgramService.getItem(MockDrillProgramStore.mock_drill_program_id).subscribe(res => {
            setTimeout(() => {
              MockDrillProgramStore.loaded = false;
              this._utilityService.detectChanges(this._cdr);
            }, 300);
          });
        },
        (err: HttpErrorResponse) => {
          AppStore.disableLoading();
          if (err.status == 422) {
            this.formErrors = err.error.errors;
          } else {
            this._utilityService.showErrorMessage('error', 'something_went_wrong_try_again');
          }
          this._utilityService.detectChanges(this._cdr);
        }
      );
    }
  }
  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

}
