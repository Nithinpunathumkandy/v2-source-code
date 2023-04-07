import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileQualificationModalComponent } from './profile-qualification-modal.component';

describe('ProfileQualificationModalComponent', () => {
  let component: ProfileQualificationModalComponent;
  let fixture: ComponentFixture<ProfileQualificationModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileQualificationModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileQualificationModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
