import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KpiCategoryModalComponent } from './kpi-category-modal.component';

describe('KpiCategoryModalComponent', () => {
  let component: KpiCategoryModalComponent;
  let fixture: ComponentFixture<KpiCategoryModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KpiCategoryModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KpiCategoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
