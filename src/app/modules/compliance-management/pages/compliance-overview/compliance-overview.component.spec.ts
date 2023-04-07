import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceOverviewComponent } from './compliance-overview.component';

describe('ComplianceOverviewComponent', () => {
  let component: ComplianceOverviewComponent;
  let fixture: ComponentFixture<ComplianceOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
