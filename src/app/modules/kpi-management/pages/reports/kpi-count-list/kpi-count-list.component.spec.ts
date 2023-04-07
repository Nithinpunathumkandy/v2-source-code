import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCountListComponent } from './kpi-count-list.component';

describe('KpiCountListComponent', () => {
  let component: KpiCountListComponent;
  let fixture: ComponentFixture<KpiCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ KpiCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
