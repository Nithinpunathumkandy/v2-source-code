import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetMaintenanceService } from 'src/app/core/services/asset-management/asset-register/asset-maintenance/asset-maintenance.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-maintenance-shutdown',
  templateUrl: './maintenance-shutdown.component.html',
  styleUrls: ['./maintenance-shutdown.component.scss']
})
export class MaintenanceShutdownComponent implements OnInit {
  @Input ('source') shutdownSource:any;
  shutdownForm: FormGroup;
  formErrors = null;
  AppStore = AppStore;
  pipe = new DatePipe('en-US');

  constructor(private _formBuilder: FormBuilder,
    private _eventEmitterService: EventEmitterService,
    private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef,
    private _assetMaintenanceService: AssetMaintenanceService,
    private _helperService:HelperServiceService) { }

  ngOnInit(): void {

    this.shutdownForm = this._formBuilder.group({
      id: [''],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      description: [''],
      start_date: [null],
      end_date: [null],
      downtime_from: [null],
      downtime_to: [null],

    })
  }

  getSaveData() {

    let saveData={
      id:this.shutdownForm.value.id?this.shutdownForm.value.id:null,
      title:this.shutdownForm.value.title?this.shutdownForm.value.title:'',
      description:this.shutdownForm.value.description?this.shutdownForm.value.description:'',
      start_date:this.shutdownForm.value.start_date?this._helperService.processDate(this.shutdownForm.value.start_date,'join'):null,
      end_date:this.shutdownForm.value.end_date?this._helperService.processDate(this.shutdownForm.value.end_date,'join'):null,
      downtime_from:this.shutdownForm.value.downtime_from?this.passSaveFormatDate(this.shutdownForm.value.downtime_from):null,
      downtime_to:this.shutdownForm.value.downtime_to?this.passSaveFormatDate(this.shutdownForm.value.downtime_to):null,
     
    }
    return saveData;

  }

  save(close: boolean = false) {
    this.getSaveData();
    AppStore.enableLoading();
    this._assetMaintenanceService.saveScheduledData(this.getSaveData());
    AppStore.disableLoading();
    this._utilityService.detectChanges(this._cdr)
    if (close) this.closeFormModal();

  }

  passSaveFormatDate(date)
  {
   const fromdate = this.pipe.transform(date, 'HH:mm:ss');
   return fromdate;
  }



  closeFormModal() {
    this.shutdownForm.reset();
    this._eventEmitterService.dismissMaintenanceScheduleFormModal(this.shutdownSource.index);

  }

  getDescriptionLength() {
		var regex = /(<([^>]+)>)/ig;
		var result = this.shutdownForm.value.description.replace(regex, "");
		return result.length;
	}

	descriptionValueChange(event) {
		this._utilityService.detectChanges(this._cdr);
	}


  clear(type) {
		if (type == 'start_date') {
			this.shutdownForm.patchValue({
				start_date: null
			})
		}
    if (type == 'end_date') {
			this.shutdownForm.patchValue({
				end_date: null
			})
		}
  }

}
