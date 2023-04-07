import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickUploadComponent } from './quick-upload.component';

describe('QuickUploadComponent', () => {
  let component: QuickUploadComponent;
  let fixture: ComponentFixture<QuickUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
