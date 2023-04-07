import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeManagementDetailsEventStatusLoaderComponent } from './event-change-management-details-event-status-loader.component';

describe('EventChangeManagementDetailsEventStatusLoaderComponent', () => {
  let component: EventChangeManagementDetailsEventStatusLoaderComponent;
  let fixture: ComponentFixture<EventChangeManagementDetailsEventStatusLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeManagementDetailsEventStatusLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeManagementDetailsEventStatusLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
