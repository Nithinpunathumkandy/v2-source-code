import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventTeamComponent } from './event-team.component';

describe('EventTeamComponent', () => {
  let component: EventTeamComponent;
  let fixture: ComponentFixture<EventTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventTeamComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
