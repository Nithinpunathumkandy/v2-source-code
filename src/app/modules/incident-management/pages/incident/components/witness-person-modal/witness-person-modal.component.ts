import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventEmitterService } from 'src/app/core/services/general/event-emitter/event-emitter.service';
import { HelperServiceService } from 'src/app/core/services/general/helper-service/helper-service.service';
import { ImageServiceService } from 'src/app/core/services/general/image-service/image-service.service';
import { UsersService } from 'src/app/core/services/human-capital/user/users.service';
import { UtilityService } from 'src/app/shared/services/utility.service';
import { UsersStore } from 'src/app/stores/human-capital/users/users.store';
import { IncidentInvestigationStore } from 'src/app/stores/incident-management/investigation-store';

@Component({
	selector: 'app-witness-person-modal',
	templateUrl: './witness-person-modal.component.html',
	styleUrls: ['./witness-person-modal.component.scss']
})
export class WitnessPersonModalComponent implements OnInit {
	UsersStore = UsersStore;
	IncidentInvestigationStore = IncidentInvestigationStore



	form: FormGroup;

	constructor(private _eventEmitterService: EventEmitterService, private _helperService: HelperServiceService,
		private _userService: UsersService, private _utilityService: UtilityService, private _formBuilder: FormBuilder,
		private _cdr: ChangeDetectorRef, private _imageService: ImageServiceService,) { }

	ngOnInit(): void {
		this.form = this._formBuilder.group({
			investigation_witness_user_ids: [null],
			remarks: ''
		})
	}

	cancel() {
		this._eventEmitterService.dismissInvolvedWitnessModalControl();
	}

	getPersonInvolved() {
		this._userService.getAllItems().subscribe(res => {
			this._utilityService.detectChanges(this._cdr);
		});
	}

	searchPersonInvolved(e) {
			this._userService.searchUsers('?q=' + e.term).subscribe(res => {
				this._utilityService.detectChanges(this._cdr);
			})
	}

	customSearchFn(term: string, item: any) {
		term = term.toLowerCase();
		// Creating and array of space saperated term and removinf the empty values using filter
		let splitTerm = term.split(' ').filter(t => t);
		let isWordThere = [];
		// Pushing True/False if match is found
		splitTerm.forEach(arr_term => {
			item['searchLabel'] = item['first_name'] + '' + item['last_name'] + '' + item['email'] + '' + item['designation_title'];
			let search = item['searchLabel'].toLowerCase();
			isWordThere.push(search.indexOf(arr_term) != -1);
		});

		const all_words = (this_word) => this_word;
		// Every method will return true if all values are true in isWordThere.
		return isWordThere.every(all_words);
	}

	createImagePreview(type, token) {
		return this._imageService.getThumbnailPreview(type, token)
	}

	// Returns default image
	getDefaultImage(type) {
		return this._imageService.getDefaultImageUrl(type);
	}

	processData() {
		let saveData = {
			investigation_witness_user_ids: this.form.value.investigation_witness_user_ids ? this.form.value.investigation_witness_user_ids : [],
			remarks: this.form.value.remarks ? this.form.value.remarks : '',

		}

		return saveData;
	}


	saveWitnessUserDetails() {
		let isDup = false;
		let success = false;
		if(this.form.value.investigation_witness_user_ids.length > 0) {
		if (IncidentInvestigationStore.involvedWitnessUserDetails.length == 0) {
			this.form.value.investigation_witness_user_ids.map(data => {
				this.IncidentInvestigationStore.setWitnessUserDetails(data)
				this.form.reset();
				this._utilityService.showSuccessMessage('success', 'person_added');

			})
		} else {
			this.form.value.investigation_witness_user_ids.map(data => {
				for (let i = 0; i < IncidentInvestigationStore.involvedWitnessUserDetails.length; i++) {
					if (data.id == IncidentInvestigationStore.involvedWitnessUserDetails[i].id) {
						isDup = true;
						break;
					}
				}
				if (!isDup) {
					this.IncidentInvestigationStore.setWitnessUserDetails(data)
					this.form.reset();
					success = true;
				}

			})
			if (success) {
				this._utilityService.showSuccessMessage('success', 'person_added');
			}
			else {
				this._utilityService.showWarningMessage('', 'selected_users_included_already_added');
			}
		}}
		isDup = false;
		// this._utilityService.showSuccessMessage('Success!', 'Person Added')

		this._utilityService.detectChanges(this._cdr)
		this.form.reset();
	}

	getStringsFormatted(stringArray, characterLength, seperator) {
		return this._helperService.getFormattedName(stringArray, characterLength, seperator);
	}

}
