import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsRiskPreviewModalComponent } from './isms-risk-preview-modal.component';

describe('IsmsRiskPreviewModalComponent', () => {
  let component: IsmsRiskPreviewModalComponent;
  let fixture: ComponentFixture<IsmsRiskPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsRiskPreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsRiskPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
