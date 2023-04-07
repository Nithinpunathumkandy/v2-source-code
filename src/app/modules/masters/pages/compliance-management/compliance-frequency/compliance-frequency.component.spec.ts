import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceFrequencyComponent } from './compliance-frequency.component';

describe('ComplianceFrequencyComponent', () => {
  let component: ComplianceFrequencyComponent;
  let fixture: ComponentFixture<ComplianceFrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceFrequencyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
