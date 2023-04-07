import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileLeftLoaderComponent } from './profile-left-loader.component';

describe('ProfileLeftLoaderComponent', () => {
  let component: ProfileLeftLoaderComponent;
  let fixture: ComponentFixture<ProfileLeftLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileLeftLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileLeftLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
