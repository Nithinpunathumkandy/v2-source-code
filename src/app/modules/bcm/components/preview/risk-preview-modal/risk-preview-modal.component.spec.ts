import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RiskPreviewModalComponent } from './risk-preview-modal.component';

describe('RiskPreviewModalComponent', () => {
  let component: RiskPreviewModalComponent;
  let fixture: ComponentFixture<RiskPreviewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RiskPreviewModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RiskPreviewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
