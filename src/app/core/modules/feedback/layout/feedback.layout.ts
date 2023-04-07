import { Component, ChangeDetectionStrategy, OnInit, ChangeDetectorRef } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { FeedbackService } from "src/app/core/services/feedback/feedback.service";
import { HelperServiceService } from "src/app/core/services/general/helper-service/helper-service.service";
import { AppFeedbackKeyService } from "src/app/core/services/masters/general/app-feedback-key/app-feedback-key.service";
import { UtilityService } from "src/app/shared/services/utility.service";
import { AppStore } from "src/app/stores/app.store";
import { AuthStore } from "src/app/stores/auth.store";
import { FeedbackStore } from "src/app/stores/feedback.store";
import { AppFeedbackKeyMasterStore } from "src/app/stores/masters/general/app-feedback-key-store";

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'app-feedback-layout',
    templateUrl: './feedback.layout.html',
    styleUrls: ['./feedback.layout.scss']
})
export class FeedbackLayout implements OnInit {
    AppFeedbackKeyMasterStore = AppFeedbackKeyMasterStore;
    FeedbackStore = FeedbackStore;
    smileyActive: number;
    selectedIndex = [];
    comment: string;
    form: FormGroup;
    submitForm: boolean = false;
    keyId:number;
    dataDismiss:boolean = false;
    AppStore = AppStore;
    thankPopup:boolean = false;
    feedbackPopup:boolean = true;
    buttonDisabled: boolean = true;
    feedbackSmiley:boolean = false;
    feedbackIndividualSmiley:boolean = false;
    constructor(private _utilityService: UtilityService,
        private _feedbackService: FeedbackService,
        private _cdr:ChangeDetectorRef,
        private _helperService:HelperServiceService,
        private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.getFeedbackKey();
        this.getFeedbackSmilies();
        AppStore.disableLoading();
        
    }

    getFeedbackKey() {
        this._feedbackService.getFeedbackKey().subscribe(res => {
        });
    }

    getFeedbackSmilies() {
        this._feedbackService.getFeedbackSmilies().subscribe(res => {
        });
    }

    submit() {
        this.buttonDisabled = true;
        AppStore.enableLoading();
        let saveData = {
            user_id: AuthStore.user.id,
            app_feedback_smily_id: this.smileyActive,
            comment: this.comment,
            app_user_feedback_keys: this.selectedIndex
        }
        this._feedbackService.sendFeedback(saveData).subscribe(response => {
            this.thankPopup = true;
            this.cancel();
            this._utilityService.detectChanges(this._cdr);
            AppStore.disableLoading();
        })
        
    }

    selectSmiley(value) {
        this.feedbackSmiley = true;
        this.smileyActive = value;
        this.enableButton();
    }

    selectIndividualSmiley(smileyid, keyid) {
        this.feedbackIndividualSmiley = true;
        let selectedValue = {
            app_feedback_key_id: keyid,
            app_feedback_smily_id: smileyid,
        }
        for (let i = 0; i < this.selectedIndex?.length; i++) {
            if (keyid == this.selectedIndex[i]?.app_feedback_key_id) {
                this.selectedIndex.splice(i, 1);
            }
        }
        this.selectedIndex.push(selectedValue);
        this.enableButton();
        this._utilityService.detectChanges(this._cdr);
    }

    cancel() {
        this.submitForm = false;
        this.selectedIndex = [];
        this.smileyActive = null;
        this.comment = null;
        AppStore.disableLoading();
    }

    activeSelectedSmiley(keyid?, smileyid?) {
            for (let i = 0; i < this.selectedIndex?.length; i++) {
                if (keyid == this.selectedIndex[i]?.app_feedback_key_id && smileyid == this.selectedIndex[i]?.app_feedback_smily_id) {
                    return true;
                }
            }
    }

    getButtonText(text){
        return this._helperService.translateToUserLanguage(text);
      }
    
      dismissThankPopup(){
        this.feedbackPopup = false;
          this.thankPopup = false;
          this._utilityService.detectChanges(this._cdr);
      }

      enableButton(){
          if(this.feedbackSmiley && this.feedbackIndividualSmiley && this.comment != null)
          this.buttonDisabled = false;
      }
}