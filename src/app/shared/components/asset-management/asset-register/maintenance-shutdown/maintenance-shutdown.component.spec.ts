import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaintenanceShutdownComponent } from './maintenance-shutdown.component';

describe('MaintenanceShutdownComponent', () => {
  let component: MaintenanceShutdownComponent;
  let fixture: ComponentFixture<MaintenanceShutdownComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaintenanceShutdownComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaintenanceShutdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
