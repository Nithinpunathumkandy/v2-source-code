import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProfileTeamLoaderComponent } from './event-profile-team-loader.component';

describe('EventProfileTeamLoaderComponent', () => {
  let component: EventProfileTeamLoaderComponent;
  let fixture: ComponentFixture<EventProfileTeamLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventProfileTeamLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventProfileTeamLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
