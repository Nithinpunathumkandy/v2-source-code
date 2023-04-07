import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileListLoaderComponent } from './profile-list-loader.component';

describe('ProfileListLoaderComponent', () => {
  let component: ProfileListLoaderComponent;
  let fixture: ComponentFixture<ProfileListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
