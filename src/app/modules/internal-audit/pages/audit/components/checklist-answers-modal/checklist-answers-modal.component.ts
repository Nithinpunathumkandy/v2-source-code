import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { ChecklistAnswersListService } from 'src/app/core/services/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { ChecklistsAnswersListStore } from 'src/app/stores/internal-audit/audit-findings/checklist-answers-list/checklist-answers-list-store';
declare var $: any;
@Component({
  selector: 'app-checklist-answers-modal',
  templateUrl: './checklist-answers-modal.component.html',
  styleUrls: ['./checklist-answers-modal.component.scss']
})
export class ChecklistAnswersModalComponent implements OnInit, OnDestroy {
  @Input('source') ChecklistViewSource: any;
  @ViewChild('viewChecklists', { static: true }) viewChecklists: ElementRef;
  AppStore = AppStore;
  ChecklistsAnswersListStore = ChecklistsAnswersListStore;
  checklistAnswerEmptyList = "No Checklist Answers To Show";
  checklistObject = {
    component: 'Master',
    values: null,
    type: null,
    from: null
  };
  viewSingleChecklistsModalSubscription: any;
  constructor(private _eventEmitterService: EventEmitterService,
    private _renderer2: Renderer2,
    private _checklistAnswersListService: ChecklistAnswersListService,
    private _cdr: ChangeDetectorRef,
    private _utilityService: UtilityService,) { }

  ngOnInit(): void {
    // checklist modal close
    this.viewSingleChecklistsModalSubscription = this._eventEmitterService.checklistSingleViewModal.subscribe(res => {
      this.closeChecklistModal();
    })
    this.pageChange(1);
  }

  pageChange(newPage: number = null) {
    if (newPage) ChecklistsAnswersListStore.setCurrentPage(newPage);
    let params = '?audit_schedule_ids=' + this.ChecklistViewSource.values.schedule_id;
    this._checklistAnswersListService.getAllItems(params).subscribe(res => {
      this._utilityService.detectChanges(this._cdr);
    })
  }
  // cancel modal
  cancel() {
    // FormErrorStore.setErrors(null);
    this.closeFormModal();



  }

  closeFormModal() {
    this._eventEmitterService.dissmissChecklistAllViewTableModal();
  }

  viewSingleChecklist(id: number) {
    this.checklistObject.type = 'Add';
    this.checklistObject.values = {
      schedule_id: this.ChecklistViewSource.values.schedule_id,
      id: id
    }
    $('.modal-backdrop').add();
    document.body.classList.add('modal-open')
    this._renderer2.setStyle(this.viewChecklists.nativeElement, 'display', 'block');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'z-index', 999999);
    this._renderer2.removeAttribute(this.viewChecklists.nativeElement, 'aria-hidden');

    setTimeout(() => {
      this._renderer2.addClass(this.viewChecklists.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 100);
  }
  closeChecklistModal() {
    this.checklistObject.type = null;
    this.checklistObject.values = null;
    this._renderer2.removeClass(this.viewChecklists.nativeElement, 'show')
    document.body.classList.remove('modal-open')
    this._renderer2.setStyle(this.viewChecklists.nativeElement, 'display', 'none');
    // this._renderer2.setStyle(this.controlDetails.nativeElement, 'fade', 'opacity: 0;');
    this._renderer2.setAttribute(this.viewChecklists.nativeElement, 'aria-hidden', 'true');
    $('.modal-backdrop').remove();

    setTimeout(() => {
      this._renderer2.removeClass(this.viewChecklists.nativeElement, 'show')
      this._utilityService.detectChanges(this._cdr)
    }, 200);

    // this.getAudit();
  }
  ngOnDestroy() {
    this.viewSingleChecklistsModalSubscription.unsubscribe();
  }
}
