import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeManagementDetailsLoaderComponent } from './event-change-management-details-loader.component';

describe('EventChangeManagementDetailsLoaderComponent', () => {
  let component: EventChangeManagementDetailsLoaderComponent;
  let fixture: ComponentFixture<EventChangeManagementDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeManagementDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeManagementDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
