import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileExperienceModalComponent } from './profile-experience-modal.component';

describe('ProfileExperienceModalComponent', () => {
  let component: ProfileExperienceModalComponent;
  let fixture: ComponentFixture<ProfileExperienceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileExperienceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileExperienceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
