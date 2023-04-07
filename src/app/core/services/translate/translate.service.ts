import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export class IsorobotTranslateLoader implements TranslateLoader {
	constructor(
		private http: HttpClient,
	) { }

	public getTranslation(lang: string): Observable<any> {
		return this.http.get(`/labels?settings=true`);
	}
}