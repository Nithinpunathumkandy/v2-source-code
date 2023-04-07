import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileKpiLoaderComponent } from './profile-kpi-loader.component';

describe('ProfileKpiLoaderComponent', () => {
  let component: ProfileKpiLoaderComponent;
  let fixture: ComponentFixture<ProfileKpiLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileKpiLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileKpiLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
