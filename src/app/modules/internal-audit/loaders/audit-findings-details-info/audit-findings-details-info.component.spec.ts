import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditFindingsDetailsInfoComponent } from './audit-findings-details-info.component';

describe('AuditFindingsDetailsInfoComponent', () => {
  let component: AuditFindingsDetailsInfoComponent;
  let fixture: ComponentFixture<AuditFindingsDetailsInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditFindingsDetailsInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditFindingsDetailsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
