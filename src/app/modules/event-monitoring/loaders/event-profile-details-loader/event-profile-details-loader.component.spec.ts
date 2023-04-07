import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventProfileDetailsLoaderComponent } from './event-profile-details-loader.component';

describe('EventProfileDetailsLoaderComponent', () => {
  let component: EventProfileDetailsLoaderComponent;
  let fixture: ComponentFixture<EventProfileDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EventProfileDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EventProfileDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
