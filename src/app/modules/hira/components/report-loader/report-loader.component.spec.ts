import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLoaderComponent } from './report-loader.component';

describe('ReportLoaderComponent', () => {
  let component: ReportLoaderComponent;
  let fixture: ComponentFixture<ReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
