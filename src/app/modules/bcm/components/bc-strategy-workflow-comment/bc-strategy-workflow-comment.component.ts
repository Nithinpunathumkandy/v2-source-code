import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BcmStrategiesService } from 'src/app/core/services/bcm/bcm-strategies/bcm-strategies.service';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { BcmStrategyStore } from 'src/app/stores/bcm/strategy/bcm-strategy-store';

@Component({
  selector: 'app-bc-strategy-workflow-comment',
  templateUrl: './bc-strategy-workflow-comment.component.html',
  styleUrls: ['./bc-strategy-workflow-comment.component.scss']
})
export class BcStrategyWorkflowCommentComponent implements OnInit {

  AppStore = AppStore;
  BcmStrategyStore = BcmStrategyStore;
  title: string;
  comments: string
  formErrors: any;
  levelArray=[];
  level:number;
  solution_id: number;

  constructor(private _helperService: HelperServiceService,
    private _eventEmitterService:EventEmitterService,
    private _utilityService:UtilityService,
    private _cdr:ChangeDetectorRef,
    private _bcmStrategiesService: BcmStrategiesService) { }

  ngOnInit(): void {
    this.setTitle()
    this.setLevel()
  }

  setTitle() {

    this.title = BcmStrategyStore.type;
  }

  setLevel(){
    this.levelArray=[];
    this.levelArray.push(0);
      for(let i of BcmStrategyStore?.BcmDetails?.workflow_items){
        if(i.level<BcmStrategyStore.BcmDetails?.next_review_user_level)
        this.levelArray.push(i.level);
      }
  }

  getButtonText(text) {
   
    return this._helperService.translateToUserLanguage(text);
  }


  save(close: boolean = false) {

    let save;
    AppStore.enableLoading();

    let comment = {
      comment: this.comments
    }

    switch (BcmStrategyStore.type) {

     

      case 'revert':
        let data = {
          comment: this.comments,
          revert_to_level:this.level
        }
        save = this._bcmStrategiesService.strategyRevert(BcmStrategyStore.selectedId,data);
        break;

      default:
        break;
    }

    save.subscribe(
      (res: any) => {
        this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
        setTimeout(() => {
          this._utilityService.detectChanges(this._cdr);
        }, 500);
        if (close) this.closeFormModal();
      },
      (err: HttpErrorResponse) => {
        // AppStore.disableLoading();
        //   this._utilityService.showErrorMessage(
        //     "Error!",
        //     "Something went wrong. Please try again."
        //   );
        // this._utilityService.detectChanges(this._cdr);
        AppStore.disableLoading();
        if (err.status == 422) {
          this.formErrors = err.error;
          // this.processFormErrors()
        } else {
          this._utilityService.showErrorMessage(
            "Error!",
            "Something went wrong. Please try again."
          );
          this._utilityService.detectChanges(this._cdr);
        }
      }
    );

  }

  cancel() {
    this.closeFormModal();
  }

  closeFormModal() {
    AppStore.disableLoading();
    this.level=null;
    this.comments = null;
    this._eventEmitterService.dismissStrategyCommentModal()
  }

  ngOnDestroy() {
    this.level=null;
    this.formErrors = null;
    this.comments = null;
  }

}
