import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseAuditSummaryComponent } from './choose-audit-summary.component';

describe('ChooseAuditSummaryComponent', () => {
  let component: ChooseAuditSummaryComponent;
  let fixture: ComponentFixture<ChooseAuditSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChooseAuditSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseAuditSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
