import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTeamLoaderComponent } from './event-team-loader.component';

describe('EventTeamLoaderComponent', () => {
  let component: EventTeamLoaderComponent;
  let fixture: ComponentFixture<EventTeamLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTeamLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTeamLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
