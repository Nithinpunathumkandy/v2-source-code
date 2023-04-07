import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiDetialsComponent } from './kpi-detials.component';

describe('KpiDetialsComponent', () => {
  let component: KpiDetialsComponent;
  let fixture: ComponentFixture<KpiDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiDetialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
