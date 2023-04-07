import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProcessReportLoaderComponent } from './process-report-loader.component';

describe('ProcessReportLoaderComponent', () => {
  let component: ProcessReportLoaderComponent;
  let fixture: ComponentFixture<ProcessReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProcessReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProcessReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
