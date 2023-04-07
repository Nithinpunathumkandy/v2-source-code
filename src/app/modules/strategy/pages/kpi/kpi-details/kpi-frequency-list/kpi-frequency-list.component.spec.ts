import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiFrequencyListComponent } from './kpi-frequency-list.component';

describe('KpiFrequencyListComponent', () => {
  let component: KpiFrequencyListComponent;
  let fixture: ComponentFixture<KpiFrequencyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiFrequencyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiFrequencyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
