import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsmsReportLoaderComponent } from './isms-report-loader.component';

describe('IsmsReportLoaderComponent', () => {
  let component: IsmsReportLoaderComponent;
  let fixture: ComponentFixture<IsmsReportLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IsmsReportLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IsmsReportLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
