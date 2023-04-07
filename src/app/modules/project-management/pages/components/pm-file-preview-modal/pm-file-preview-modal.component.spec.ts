import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmFilePreviewModalComponent } from './pm-file-preview-modal.component';

describe('PmFilePreviewModalComponent', () => {
  let component: PmFilePreviewModalComponent;
  let fixture: ComponentFixture<PmFilePreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmFilePreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmFilePreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
