import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCountTypeComponent } from './kpi-count-type.component';

describe('KpiCountTypeComponent', () => {
  let component: KpiCountTypeComponent;
  let fixture: ComponentFixture<KpiCountTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiCountTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiCountTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
