import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { FindingsService } from 'src/app/core/services/non-conformity/findings/findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { FindingsStore } from 'src/app/stores/non-conformity/findings/findings-store';

@Component({
  selector: 'app-non-conformity-mapping',
  templateUrl: './non-conformity-mapping.component.html',
  styleUrls: ['./non-conformity-mapping.component.scss']
})
export class NonConformityMappingComponent implements OnInit {
  @Input('title') title:boolean=false;
  @Input('strategicModalTitle')strategicModalTitle: any;
  @Input('removeselected') removeselected:boolean = false;

  AppStore = AppStore;
  FindingsStore = FindingsStore;
  
  selectedFinding=[];
  selectAll = false;
  searchText=null;
  formErrors: any;

  constructor(
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _findingsService: FindingsService,
    private _eventEmitterService: EventEmitterService,
  ) { }

  ngOnInit(): void {
    this.selectedFinding = JSON.parse(JSON.stringify(FindingsStore._selectedNonConformityItemAll));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    this.selectAll = false;
    if (newPage) FindingsStore.setCurrentPage(newPage);
    this._findingsService.getItems().subscribe(() => setTimeout(() => this._utilityService.detectChanges(this._cdr), 100));
  }

  save(close: boolean = false) {
    FindingsStore.saveSelected=true;
    this._findingsService.selectRequiredFinding(this.selectedFinding);
    if (this.selectedFinding.length > 0) this._utilityService.showSuccessMessage('non_conformity_selected', 'the_selected_non_conformity_has_been_added_to_your_list');
    if (close) this.cancel();
  }

  cancel() {
    if (FindingsStore.saveSelected) {
      this._eventEmitterService.dismissMrmNonConformityAddModal();
    } else {
      FindingsStore.saveSelected = false;
      this._eventEmitterService.dismissMrmNonConformityAddModal();
    }
    this.searchText = null;
    this.searchInFindingList(this.searchText);
  }

  searchInFindingList(e){
    if(e){
      this.searchText = e.target.value;
    }else{
      this.searchText=e;
    }
    FindingsStore.setCurrentPage(1);
    
    if (this.searchText) {
      this._findingsService.getItems(false, `&q=${this.searchText}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      }); 
    } else{
      this.pageChange();
    }
  }

  selectAllFindings(event) {

    if (event.target.checked) {
      for (let i of  FindingsStore.allItems) {
        var pos = this.selectedFinding.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedFinding.push(i);
        }
      }
    } else {
      for (let i of FindingsStore.allItems) {
        var pos = this.selectedFinding.findIndex(e => e.id == i.id);
        if (pos != -1) {
          this.selectedFinding.splice(pos, 1);
        }
      }
    }

  }

  findingSelected(issues) {

    var pos = this.selectedFinding.findIndex(e => e.id == issues.id);
    if (pos != -1) {
      this.selectedFinding.splice(pos, 1);
    }
    else {
      this.selectedFinding.push(issues);
    }

  }

  findingPresent(risk) {
    const index = this.selectedFinding.findIndex(e => e.id == risk.id);
    if (index > -1)
      return true;
    else
      return false;
  }

  sortTitle(type: string) {
    this._findingsService.sortFindingsList(type, null);
    this.pageChange();
  }

}
