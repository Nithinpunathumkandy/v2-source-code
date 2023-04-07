import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditOverviewComponent } from './audit-overview.component';

describe('AuditOverviewComponent', () => {
  let component: AuditOverviewComponent;
  let fixture: ComponentFixture<AuditOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
