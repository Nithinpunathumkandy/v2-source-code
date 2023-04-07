import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileReportLoaderComponent } from './profile-report-loader.component';

describe('ProfileReportLoaderComponent', () => {
  let component: ProfileReportLoaderComponent;
  let fixture: ComponentFixture<ProfileReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
