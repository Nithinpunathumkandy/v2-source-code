import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiTypesStategyModalComponent } from './kpi-types-stategy-modal.component';

describe('KpiTypesStategyModalComponent', () => {
  let component: KpiTypesStategyModalComponent;
  let fixture: ComponentFixture<KpiTypesStategyModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiTypesStategyModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiTypesStategyModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
