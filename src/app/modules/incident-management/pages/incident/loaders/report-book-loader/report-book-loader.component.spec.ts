import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBookLoaderComponent } from './report-book-loader.component';

describe('ReportBookLoaderComponent', () => {
  let component: ReportBookLoaderComponent;
  let fixture: ComponentFixture<ReportBookLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportBookLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBookLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
