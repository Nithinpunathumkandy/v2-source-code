import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { StrategyService } from 'src/app/core/services/strategy-management/strategy/strategy.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { StrategyStore } from 'src/app/stores/strategy-management/strategy.store';

@Component({
  selector: 'app-strategy-profile-focus-area-note',
  templateUrl: './strategy-profile-focus-area-note.component.html',
  styleUrls: ['./strategy-profile-focus-area-note.component.scss']
})
export class StrategyProfileFocusAreaNoteComponent implements OnInit {

  @Input('source') notesSource: any;

  StrategyStore = StrategyStore;
  swot_availability:Boolean = false;
  pestel_availabale:Boolean = false;

  constructor(private _service : StrategyService,private _utilityService: UtilityService,
    private _cdr: ChangeDetectorRef, private _eventEmitterService:EventEmitterService) { }

  ngOnInit(): void {
    this.getNodedetails();
  }

  getNodedetails(){
    this.swot_availability = false
    this.pestel_availabale = false
    StrategyStore.setNoteId(this.notesSource.id)
    this._service.getInduvalNote(this.notesSource.id).subscribe(res=>{
      if (res && res.category.length != 0) {
        StrategyStore.noteDetails.category.forEach(element => {
          if (element.is_swot && element.is_swot == 1) {
            this.swot_availability = true;
          }
          if (element.is_pestel && element.is_pestel == 1) {
            this.pestel_availabale = true
          }
        });
        this._utilityService.detectChanges(this._cdr);
      }
    })
    
    this._utilityService.detectChanges(this._cdr);
  }

  cancel(){
    this._eventEmitterService.dismissNotesModal();
  }
}
