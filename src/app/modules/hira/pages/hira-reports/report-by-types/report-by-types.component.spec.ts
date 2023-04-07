import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportByTypesComponent } from './report-by-types.component';

describe('ReportByTypesComponent', () => {
  let component: ReportByTypesComponent;
  let fixture: ComponentFixture<ReportByTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportByTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportByTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
