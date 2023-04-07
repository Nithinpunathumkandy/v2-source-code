import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EaDashboardPendingCaComponent } from './ea-dashboard-pending-ca.component';

describe('EaDashboardPendingCaComponent', () => {
  let component: EaDashboardPendingCaComponent;
  let fixture: ComponentFixture<EaDashboardPendingCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EaDashboardPendingCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EaDashboardPendingCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
