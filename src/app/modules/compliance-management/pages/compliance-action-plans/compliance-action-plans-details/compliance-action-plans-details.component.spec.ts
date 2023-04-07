import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceActionPlansDetailsComponent } from './compliance-action-plans-details.component';

describe('ComplianceActionPlansDetailsComponent', () => {
  let component: ComplianceActionPlansDetailsComponent;
  let fixture: ComponentFixture<ComplianceActionPlansDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceActionPlansDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceActionPlansDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
