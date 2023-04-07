import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommonDetailsReportLoaderComponent } from './common-details-report-loader.component';

describe('CommonDetailsReportLoaderComponent', () => {
  let component: CommonDetailsReportLoaderComponent;
  let fixture: ComponentFixture<CommonDetailsReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommonDetailsReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDetailsReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
