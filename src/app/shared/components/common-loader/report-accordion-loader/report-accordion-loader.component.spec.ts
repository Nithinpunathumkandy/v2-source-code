import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAccordionLoaderComponent } from './report-accordion-loader.component';

describe('ReportAccordionLoaderComponent', () => {
  let component: ReportAccordionLoaderComponent;
  let fixture: ComponentFixture<ReportAccordionLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAccordionLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAccordionLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
