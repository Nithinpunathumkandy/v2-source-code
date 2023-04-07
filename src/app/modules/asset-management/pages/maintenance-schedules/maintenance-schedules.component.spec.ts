import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceSchedulesComponent } from './maintenance-schedules.component';

describe('MaintenanceSchedulesComponent', () => {
  let component: MaintenanceSchedulesComponent;
  let fixture: ComponentFixture<MaintenanceSchedulesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceSchedulesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceSchedulesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
