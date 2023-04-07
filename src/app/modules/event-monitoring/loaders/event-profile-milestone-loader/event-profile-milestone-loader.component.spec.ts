import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProfileMilestoneLoaderComponent } from './event-profile-milestone-loader.component';

describe('EventProfileMilestoneLoaderComponent', () => {
  let component: EventProfileMilestoneLoaderComponent;
  let fixture: ComponentFixture<EventProfileMilestoneLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventProfileMilestoneLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventProfileMilestoneLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
