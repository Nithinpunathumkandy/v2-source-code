import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventChangeManagementDetailsEventScopeLoaderComponent } from './event-change-management-details-event-scope-loader.component';

describe('EventChangeManagementDetailsEventScopeLoaderComponent', () => {
  let component: EventChangeManagementDetailsEventScopeLoaderComponent;
  let fixture: ComponentFixture<EventChangeManagementDetailsEventScopeLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventChangeManagementDetailsEventScopeLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventChangeManagementDetailsEventScopeLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
