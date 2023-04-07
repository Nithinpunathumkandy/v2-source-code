import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalAuditOverviewComponent } from './external-audit-overview.component';

describe('ExternalAuditOverviewComponent', () => {
  let component: ExternalAuditOverviewComponent;
  let fixture: ComponentFixture<ExternalAuditOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalAuditOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalAuditOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
