import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyReportBookComponent } from './strategy-report-book.component';

describe('StrategyReportBookComponent', () => {
  let component: StrategyReportBookComponent;
  let fixture: ComponentFixture<StrategyReportBookComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyReportBookComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyReportBookComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
