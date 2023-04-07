import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailsIntroLoaderComponent } from './report-details-intro-loader.component';

describe('ReportDetailsIntroLoaderComponent', () => {
  let component: ReportDetailsIntroLoaderComponent;
  let fixture: ComponentFixture<ReportDetailsIntroLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDetailsIntroLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailsIntroLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
