import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceActionPlansComponent } from './compliance-action-plans.component';

describe('ComplianceActionPlansComponent', () => {
  let component: ComplianceActionPlansComponent;
  let fixture: ComponentFixture<ComplianceActionPlansComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceActionPlansComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceActionPlansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
