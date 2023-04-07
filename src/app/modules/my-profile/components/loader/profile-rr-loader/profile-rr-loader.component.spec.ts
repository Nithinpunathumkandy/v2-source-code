import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileRrLoaderComponent } from './profile-rr-loader.component';

describe('ProfileRrLoaderComponent', () => {
  let component: ProfileRrLoaderComponent;
  let fixture: ComponentFixture<ProfileRrLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileRrLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileRrLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
