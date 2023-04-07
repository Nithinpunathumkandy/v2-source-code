import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnGoingProfileDetailsComponent } from './on-going-profile-details.component';

describe('OnGoingProfileDetailsComponent', () => {
  let component: OnGoingProfileDetailsComponent;
  let fixture: ComponentFixture<OnGoingProfileDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnGoingProfileDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OnGoingProfileDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
