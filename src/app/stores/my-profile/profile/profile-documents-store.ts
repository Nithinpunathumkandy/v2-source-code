import { action, computed, observable } from 'mobx';
import { IndividualDocument, ProfileDocuments } from 'src/app/core/models/my-profile/profile/profile-documents';

class Store{
    @observable
    private _profileDocuments:ProfileDocuments[] = [];

    @observable
    private _individualDocumentDetails: IndividualDocument;

    @observable
    loaded: boolean = false;

    @observable
    individual_document_loaded: boolean = false;

    @computed
    get individualDocumentDetails(): IndividualDocument{
        return this._individualDocumentDetails;
    }

    @computed
    get profileDocument(): ProfileDocuments[] {

       return this._profileDocuments;
    }

    @action
    setProfileDocuments(response: ProfileDocuments[] ){
        this._profileDocuments = response;
        this.loaded =true;
    }

    @action
    setIndividualDocumentDetails(details){
        this.individual_document_loaded=true;
        this._individualDocumentDetails = details;
        
    }
}

export const ProfileDocumentsStore = new Store();