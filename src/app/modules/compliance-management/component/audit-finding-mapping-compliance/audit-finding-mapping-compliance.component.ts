import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { AuditFindingsService } from 'src/app/core/services/internal-audit/audit-findings/audit-findings.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { AuditFindingsStore } from 'src/app/stores/internal-audit/audit-findings/audit-findings-store';
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";

@Component({
  selector: 'app-audit-finding-mapping-compliance',
  templateUrl: './audit-finding-mapping-compliance.component.html',
  styleUrls: ['./audit-finding-mapping-compliance.component.scss']
})
export class AuditFindingMappingComplianceComponent implements OnInit {

  @Input('removeselected') removeselected:boolean = false;
  @Input('findingModalTitle') findingModalTitle: any;
  @Input('title') title:boolean=false;

  AppStore = AppStore;
  AuditFindingsStore=AuditFindingsStore;
  
  selectedFinding=[];
  selectAll = false;
  searchText=null;
  formErrors: any;

  constructor(
    private _renderer2: Renderer2,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,
    private _eventEmitterService: EventEmitterService,
    private _auditFindingsService: AuditFindingsService,
    private _helperService: HelperServiceService
  ) { }

  ngOnInit(): void {

    this.selectedFinding = JSON.parse(JSON.stringify(AuditFindingsStore._selectedFindingItemAll));
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    this.selectAll = false;
    if (newPage) AuditFindingsStore.setCurrentPage(newPage);
    this._auditFindingsService.getItems().subscribe((res) => {
      setTimeout(() => {
        document.getElementById('selectall')['checked'] = false;
        this._utilityService.detectChanges(this._cdr)
      }, 100);
    });
  }

  save(close: boolean = false) {
    AuditFindingsStore.saveSelected=true;
    this._auditFindingsService.selectRequiredFinding(this.selectedFinding);
    let title = this.findingModalTitle?.component ? this.findingModalTitle?.component : 'item'
    if (this.selectedFinding.length > 0) this._utilityService.showSuccessMessage('finding_selected', 'Selected findings are mapped with the ' +this._helperService.translateToUserLanguage(title)+ ' successfully!');
    if (close) this.cancel();
  }

 
  cancel() {
    if (AuditFindingsStore.saveSelected) {
      this._eventEmitterService.dismissMrmFindingControlAddModal();
    } else {
      AuditFindingsStore.saveSelected = false;
      this._eventEmitterService.dismissMrmFindingControlAddModal();
    }
    this.searchText = null;
    // this.searchInFindingList(this.searchText);
  }

  searchInFindingList(e){
    if(e){
      this.searchText = e.target.value;
    }else{
      this.searchText=e;
    }
    AuditFindingsStore.setCurrentPage(1);
    
    if (this.searchText) {
      this._auditFindingsService.getItems(false, `&q=${this.searchText}`).subscribe(res => {
        this._utilityService.detectChanges(this._cdr);
      }); 
    } else{
      this.pageChange();
    }
  }

  selectAllFindings(event) {

    if (event.target.checked) {
      for (let i of  AuditFindingsStore.allItems) {
        var pos = this.selectedFinding.findIndex(e => e.id == i.id);
        if (pos == -1) {
          this.selectedFinding.push(i);
        }
      }
    } else {
      for (let i of AuditFindingsStore.allItems) {
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
    this._auditFindingsService.sortFindingslList(type, null);
    this.pageChange();
  }

}

