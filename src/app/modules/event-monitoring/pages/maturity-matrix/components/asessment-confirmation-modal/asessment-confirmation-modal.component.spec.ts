import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsessmentConfirmationModalComponent } from './asessment-confirmation-modal.component';

describe('AsessmentConfirmationModalComponent', () => {
  let component: AsessmentConfirmationModalComponent;
  let fixture: ComponentFixture<AsessmentConfirmationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AsessmentConfirmationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AsessmentConfirmationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
