import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceStatusModalComponent } from './compliance-status-modal.component';

describe('ComplianceStatusModalComponent', () => {
  let component: ComplianceStatusModalComponent;
  let fixture: ComponentFixture<ComplianceStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
