import { environment } from "src/environments/environment";

export class MyUploadAdapter {
    loader: any;
    xhr: any;
    _http: any;
    constructor( loader, http ) {
        // The file loader instance to use during the upload.
        this.loader = loader;
        this._http = http;
    }

    // Starts the upload process.
    upload() {
        return this.loader.file
            .then( file => new Promise( ( resolve, reject ) => {
                this._initRequest();
                this._initListeners( resolve, reject, file );
                this._sendRequest( file );
            } ) );
    }

    // Aborts the upload process.
    abort() {
        if ( this.xhr ) {
            this.xhr.abort();
        }
    }

    // Initializes the XMLHttpRequest object using the URL passed to the constructor.
    _initRequest() {
        const xhr = this.xhr = new XMLHttpRequest();

        // Note that your request may look different. It is up to you and your editor
        // integration to choose the right communication channel. This example uses
        // a POST request with JSON as a data structure but your configuration
        // could be different.
        let headers = {
            'Accept': 'application/json'
        };

        const token: string = window.localStorage.jwtToken;
        const tokenType: string = window.localStorage.jwtTokenType;
        if (token && tokenType) headers['Authorization'] = `${tokenType} ${token}`;
        xhr.open( 'POST', environment.apiBasePath+'/settings/temp/file?type=logo', true );
        xhr.setRequestHeader('Authorization', headers['Authorization']);
        xhr.responseType = 'json';
    }

    // Initializes XMLHttpRequest listeners.
    _initListeners( resolve, reject, file ) {
        const xhr = this.xhr;
        const loader = this.loader;
        const genericErrorText = `Couldn't upload file: ${ file.name }.`;

        xhr.addEventListener( 'error', () => reject( genericErrorText ) );
        xhr.addEventListener( 'abort', () => reject() );
        xhr.addEventListener( 'load', () => {
            const response = xhr.response;

            // This example assumes the XHR server's "response" object will come with
            // an "error" which has its own "message" that can be passed to reject()
            // in the upload promise.
            //
            // Your integration may handle upload errors in a different way so make sure
            // it is done properly. The reject() function must be called when the upload fails.
            if ( !response || response.error ) {
                return reject( response && response.error ? response.error.message : genericErrorText );
            }

            // If the upload is successful, resolve the upload promise with an object containing
            // at least the "default" URL, pointing to the image on the server.
            // This URL will be used to display the image in the content. Learn more in the
            // UploadAdapter#upload documentation.
            let imageUrl = null;
            this.getPreviewUrl(response.thumbnail_url).subscribe(prew=>{ //Generate preview url using thumbnail url returns blob
                this.createImageFromBlob(prew,resolve);
            })
        } );

        // Upload progress when it is supported. The file loader has the #uploadTotal and #uploaded
        // properties which are used e.g. to display the upload progress bar in the editor
        // user interface.
        if ( xhr.upload ) {
            xhr.upload.addEventListener( 'progress', evt => {
                if ( evt.lengthComputable ) {
                    loader.uploadTotal = evt.total;
                    loader.uploaded = evt.loaded;
                }
            } );
        }
    }

    // Prepares the data and sends the request.
    _sendRequest( file ) {
        // Prepare the form data.
        const data = new FormData();

        data.append( 'file', file );

        // Important note: This is the right place to implement security mechanisms
        // like authentication and CSRF protection. For instance, you can use
        // XMLHttpRequest.setRequestHeader() to set the request headers containing
        // the CSRF token generated earlier by your application.

        // Send the request.
        this.xhr.send( data );
    }

    createImageFromBlob(image: Blob,resolve){
        let reader = new FileReader();
        reader.addEventListener("load", () => {
        var logo_url = reader.result;
        resolve({
           default: logo_url 
        })
        // return logo_url;
        }, false);
    
        if (image) {
            reader.readAsDataURL(image);
        }
    }

    //Get temporary file preview
    getPreviewUrl(preview){
        return this._http.get('/settings/temp/file/'+preview,{ responseType: 'blob' });
    }
}