import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTypeComponent } from './kpi-type.component';

describe('KpiTypeComponent', () => {
  let component: KpiTypeComponent;
  let fixture: ComponentFixture<KpiTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
