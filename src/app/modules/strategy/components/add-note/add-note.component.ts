import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtilityService } from "src/app/shared/services/utility.service";
import { EventEmitterService } from "src/app/core/services/general/event-emitter/event-emitter.service";
import { SwotService } from 'src/app/core/services/organization/context/swot-service/swot.service';
import { SwotStore } from "src/app/stores/organization/context/swot.store";
import { PestleService } from 'src/app/core/services/organization/context/pestle-service/pestle.service';
import { PestleStore } from "src/app/stores/organization/context/pestle.store";
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';
import { HttpErrorResponse } from '@angular/common/http';
import { AppStore } from 'src/app/stores/app.store';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';


@Component({
  selector: 'app-add-note',
  templateUrl: './add-note.component.html',
  styleUrls: ['./add-note.component.scss']
})
export class AddNoteComponent implements OnInit {

  @Input('source') noteSource: any;
  SwotStore = SwotStore;
  PestleStore = PestleStore;
  AppStore = AppStore
  notes: any = null;

  selectedOrganizationIssues: any = [];

  apiLoaded: boolean = false;
  strategyForm: FormGroup;
  formErrors: any;
  constructor(private _eventEmitterService: EventEmitterService, private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _swotService: SwotService, private _pestleService: PestleService,
    private _service: StrategyService, private _formBuilder: FormBuilder, private _helperService: HelperServiceService,) { }

  ngOnInit(): void {
    this.strategyForm = this._formBuilder.group({
      title: [null, [Validators.required]]
    })
    this.getSwotCategories();
    this.getPestleCategories()


  }

  setDataForEdit() {
    if (this.noteSource.value) {
      this.strategyForm.patchValue({
        title: this.noteSource.value.title,
      })
      this.noteSource.value.organization_issue_ids.map(item => {
        this.selectedOrganizationIssues.push(item)
        this.checkSelectedStatus(item.id, item.issue_categories);
      })
      this._utilityService.detectChanges(this._cdr);

    }
  }

  tabChange(type) {
    // if(type == "swot"){
    //   this.getSwotCategories()
    // }else{
    //   this.getPestleCategories()
    // }

  }

  getSwotCategories() {
    SwotStore.setInitialData();
    this._swotService.getSwotCategories().subscribe(res => {
      res.forEach(element => {
        this._swotService.getItems(element.title, element.id, 5).subscribe(response => {
          this._utilityService.detectChanges(this._cdr);
        })
      });
      this.apiLoaded = true
      this._utilityService.detectChanges(this._cdr);
    });
  }
  getPestleCategories() {
    PestleStore.setInitialData();
    this._pestleService.getPestleCategories().subscribe(res => {
      res.forEach(element => {
        this._pestleService.getItems(element.title, element.id, 15).subscribe(response => {

          this._utilityService.detectChanges(this._cdr);
        })
      });
      if (this.noteSource.type == 'edit') {
        this.setDataForEdit()
      }
      this._utilityService.detectChanges(this._cdr);
    })
  }

  
  pestleItemPageChange(title,id,newPage: number = null) {
        this._pestleService.getItems(title, id, 15, newPage).subscribe(response => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  swotTabChange(element) {
    this._swotService.getItems(element.title, element.id, 5).subscribe(response => {
      this._utilityService.detectChanges(this._cdr);
    })

  }


  checkSelectedStatus(id: number, category?) {
    var pos = null;
    pos = this.selectedOrganizationIssues.findIndex(e => e.id == id && e.issue_categories == category);
    if (pos != -1) return true;
    else return false;

  }

  selectDocument(doc,categoryId?) {
    doc['categoryId'] = categoryId
    var pos = this.selectedOrganizationIssues.findIndex(e => e.id == doc.id && e.issue_categories == doc.issue_categories?.toLowerCase());
    if (pos != -1)
      this.selectedOrganizationIssues.splice(pos, 1);
    else
      this.selectedOrganizationIssues.push(doc);
    this._utilityService.detectChanges(this._cdr);    
  }

  cancel() {
    this.resetForm();
    AppStore.disableLoading();
    this._eventEmitterService.dismissNotesModal();
  }

  processData() {
    let organization_issues = [];
    for (let i of this.selectedOrganizationIssues) {
      let issues = {
        organization_issue_id: i.id,
        issue_category_id : i.categoryId
      }
      organization_issues.push(issues)
    }
    let saveData = {
      strategy_profile_id: StrategyStore.strategyProfileId,
      title: this.strategyForm.value.title ? this.strategyForm.value.title : '',
      organization_issue_ids: organization_issues
    }
    return saveData
  }

  save(close: boolean = false) {

    let save
    AppStore.enableLoading();

    if (this.noteSource.type == "edit") {
      save = this._service.updateNotes(this.processData(), this.noteSource.id)

    } else {
      save = this._service.addNotes(this.processData())

    }
    save.subscribe(res => {
      this.resetForm();
      AppStore.disableLoading();
      setTimeout(() => {
        this._utilityService.detectChanges(this._cdr);
      }, 500);
      if (close) this.cancel();
      this.selectedOrganizationIssues = [];
    }, (err: HttpErrorResponse) => {
      if (err.status == 422) {
        this.formErrors = err.error.errors;
      }
      else if (err.status == 500 || err.status == 403) {
        this.cancel();
      }
      AppStore.disableLoading();
      this._utilityService.detectChanges(this._cdr);

    })
    // }
  }

  getButtonText(text) {
    return this._helperService.translateToUserLanguage(text);
  }

  resetForm() {
    this.notes = null;
    this.selectedOrganizationIssues = [];
    this.strategyForm.reset();
  }

}
