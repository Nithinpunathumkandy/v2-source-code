import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileInfoLoaderComponent } from './profile-info-loader.component';

describe('ProfileInfoLoaderComponent', () => {
  let component: ProfileInfoLoaderComponent;
  let fixture: ComponentFixture<ProfileInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
