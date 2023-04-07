import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportDetailsLoaderComponent } from './report-details-loader.component';

describe('ReportDetailsLoaderComponent', () => {
  let component: ReportDetailsLoaderComponent;
  let fixture: ComponentFixture<ReportDetailsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportDetailsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportDetailsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
