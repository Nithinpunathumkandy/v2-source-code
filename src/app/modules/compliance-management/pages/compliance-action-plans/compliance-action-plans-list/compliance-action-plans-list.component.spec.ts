import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceActionPlansListComponent } from './compliance-action-plans-list.component';

describe('ComplianceActionPlansListComponent', () => {
  let component: ComplianceActionPlansListComponent;
  let fixture: ComponentFixture<ComplianceActionPlansListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceActionPlansListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceActionPlansListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
