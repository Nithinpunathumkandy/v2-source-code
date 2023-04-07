import { TestBed } from '@angular/core/testing';

import { FileUploadPopupService } from './file-upload-popup.service';

describe('FileUploadPopupService', () => {
  let service: FileUploadPopupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FileUploadPopupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
