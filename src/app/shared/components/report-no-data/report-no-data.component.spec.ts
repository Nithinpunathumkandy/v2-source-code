import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportNoDataComponent } from './report-no-data.component';

describe('ReportNoDataComponent', () => {
  let component: ReportNoDataComponent;
  let fixture: ComponentFixture<ReportNoDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportNoDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportNoDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
