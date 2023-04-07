import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiScoreDetialsLoaderComponent } from './kpi-score-detials-loader.component';

describe('KpiScoreDetialsLoaderComponent', () => {
  let component: KpiScoreDetialsLoaderComponent;
  let fixture: ComponentFixture<KpiScoreDetialsLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiScoreDetialsLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiScoreDetialsLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
