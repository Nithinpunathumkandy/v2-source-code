import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplianceStatusHistoryComponent } from './compliance-status-history.component';

describe('ComplianceStatusHistoryComponent', () => {
  let component: ComplianceStatusHistoryComponent;
  let fixture: ComponentFixture<ComplianceStatusHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ComplianceStatusHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplianceStatusHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
