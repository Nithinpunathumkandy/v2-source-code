import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceFrequencyModalComponent } from './compliance-frequency-modal.component';

describe('ComplianceFrequencyModalComponent', () => {
  let component: ComplianceFrequencyModalComponent;
  let fixture: ComponentFixture<ComplianceFrequencyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceFrequencyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceFrequencyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
