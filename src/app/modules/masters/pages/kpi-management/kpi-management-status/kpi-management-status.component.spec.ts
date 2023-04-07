import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiManagementStatusComponent } from './kpi-management-status.component';

describe('KpiManagementStatusComponent', () => {
  let component: KpiManagementStatusComponent;
  let fixture: ComponentFixture<KpiManagementStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiManagementStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiManagementStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
