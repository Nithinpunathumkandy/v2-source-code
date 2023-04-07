import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoChartDataComponent } from './no-chart-data.component';

describe('NoChartDataComponent', () => {
  let component: NoChartDataComponent;
  let fixture: ComponentFixture<NoChartDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoChartDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NoChartDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
