import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { IncidentInfoWorkflowService } from 'src/app/core/services/incident-management/incident-info-workflow/incident-info-workflow.service';
import { IncidentInvestigationWorkflowService } from 'src/app/core/services/incident-management/incident-investogation-workflow/incident-investigation-workflow.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { AppStore } from 'src/app/stores/app.store';
import { IncidentInfoWorkflowStore } from 'src/app/stores/incident-management/incident-workflow/incident-info-workflow.store';
import { IncidentStore } from 'src/app/stores/incident-management/incident/incident-store';

@Component({
	selector: 'app-incident-info-workflow-comment',
	templateUrl: './incident-info-workflow-comment.component.html',
	styleUrls: ['./incident-info-workflow-comment.component.scss']
})
export class IncidentInfoWorkflowCommentComponent implements OnInit {

	AppStore = AppStore;
	IncidentStore = IncidentStore
	IncidentInfoWorkflowStore = IncidentInfoWorkflowStore;
	title: string;
	comments: string
	formErrors: any;
	levelArray = [];
	level: number;
	form: FormGroup;
	titleDes: string;
	comment_placeholder = 'enter_comment_here';

	constructor(private _helperService: HelperServiceService,
		private _eventEmitterService: EventEmitterService,
		private _utilityService: UtilityService,
		private _cdr: ChangeDetectorRef,
		private _formBuilder: FormBuilder,
		private _incidentInfoWorkflowService: IncidentInfoWorkflowService) { }

	ngOnInit(): void {
		// this.form = this._formBuilder.group({
		//   description: ['', [Validators.required]]
		// });
		this.setTitle()
		this.setLevel()
	}

	setTitle() {

		this.title = IncidentInfoWorkflowStore.type;
	}

	titleDescription() {
		switch (IncidentInfoWorkflowStore.type) {

			case "revert":
				this.titleDes = 'revert_desc';
			  break;
			case "approve":
				this.titleDes = 'approve_desc';
			  break;
			default:
			  break;
		  }

		  return this.titleDes;
	}

	commentPlaceholder() {
		if(IncidentInfoWorkflowStore.type == 'revert') {
			return this.comment_placeholder = 'enter_revert_comment';
		}
		else if(IncidentInfoWorkflowStore.type) {
			return this.comment_placeholder = 'enter_approve_comment';
		}
		else {
			return this.comment_placeholder;
		}
	}

	setLevel() {
		this.levelArray = [];
		this.levelArray.push(0);
		for (let i of IncidentStore.individualIncidentItem?.workflow_items) {
			if (i.level < IncidentStore.individualIncidentItem?.next_review_user_level)
				this.levelArray.push(i.level);
		}
	}

	getButtonText(text) {

		// * Checking for Last Level and Setting Button Text as Publish 
		// * If not Last Level Setting Button Text as the Selected Type (Approve | Reject | Revert)

		// if (documentWorkFlowStore.nextReviewUserLevel == documentWorkFlowStore.finalReviewUserLevel && text =='approve')
		//   return this._helperService.translateToUserLanguage('publish');
		// else
		return this._helperService.translateToUserLanguage(text);


	}

	save(close: boolean = false) {

		let save;
		AppStore.enableLoading();

		let comment = {
			comment: this.comments
		}

		switch (IncidentInfoWorkflowStore.type) {


			case 'approve':
				let comment = {
					comment: this.comments
				}
				save = this._incidentInfoWorkflowService.approveIncidentInvestigation(IncidentStore.selectedId, comment);
				break;
			case 'submit':
				let submitComment = {
					comment: this.comments
				}
				save = this._incidentInfoWorkflowService.approveIncidentInvestigation(IncidentStore.selectedId, submitComment);
				break;

			case 'revert':
				let data = {
					comment: this.comments,
					revert_to_level: this.level
				}
				save = this._incidentInfoWorkflowService.revertIncidentInvestigation(IncidentStore.selectedId, data);
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
		this.level = null;
		this.comments = null;
		this._eventEmitterService.dismissIncidentInfoWorkflowCommentModal()
	}

	ngOnDestroy() {
		this.level = null;
		this.formErrors = null;
		this.comments = null;
	}

}
