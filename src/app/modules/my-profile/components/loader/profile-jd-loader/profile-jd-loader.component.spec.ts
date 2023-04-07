import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileJdLoaderComponent } from './profile-jd-loader.component';

describe('ProfileJdLoaderComponent', () => {
  let component: ProfileJdLoaderComponent;
  let fixture: ComponentFixture<ProfileJdLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileJdLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileJdLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
