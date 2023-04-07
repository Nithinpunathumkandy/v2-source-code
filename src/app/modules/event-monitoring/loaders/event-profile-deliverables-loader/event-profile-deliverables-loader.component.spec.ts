import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProfileDeliverablesLoaderComponent } from './event-profile-deliverables-loader.component';

describe('EventProfileDeliverablesLoaderComponent', () => {
  let component: EventProfileDeliverablesLoaderComponent;
  let fixture: ComponentFixture<EventProfileDeliverablesLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventProfileDeliverablesLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventProfileDeliverablesLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
