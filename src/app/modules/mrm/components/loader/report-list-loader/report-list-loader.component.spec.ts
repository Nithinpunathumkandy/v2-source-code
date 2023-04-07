import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportListLoaderComponent } from './report-list-loader.component';

describe('ReportListLoaderComponent', () => {
  let component: ReportListLoaderComponent;
  let fixture: ComponentFixture<ReportListLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportListLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportListLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
