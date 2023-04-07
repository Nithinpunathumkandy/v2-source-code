import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceActionPlansAddComponent } from './compliance-action-plans-add.component';

describe('ComplianceActionPlansAddComponent', () => {
  let component: ComplianceActionPlansAddComponent;
  let fixture: ComponentFixture<ComplianceActionPlansAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceActionPlansAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceActionPlansAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
