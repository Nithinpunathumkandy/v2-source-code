import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponentLoaderComponent } from './profile-component-loader.component';

describe('ProfileComponentLoaderComponent', () => {
  let component: ProfileComponentLoaderComponent;
  let fixture: ComponentFixture<ProfileComponentLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponentLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
