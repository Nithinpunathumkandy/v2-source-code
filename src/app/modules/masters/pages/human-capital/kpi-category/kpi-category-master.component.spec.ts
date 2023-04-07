import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCategoryMasterComponent } from './kpi-category-master.component';

describe('KpiCategoryMasterComponent', () => {
  let component: KpiCategoryMasterComponent;
  let fixture: ComponentFixture<KpiCategoryMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiCategoryMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiCategoryMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
