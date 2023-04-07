import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanDetailMappingLoaderComponent } from './plan-detail-mapping-loader.component';

describe('PlanDetailMappingLoaderComponent', () => {
  let component: PlanDetailMappingLoaderComponent;
  let fixture: ComponentFixture<PlanDetailMappingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanDetailMappingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanDetailMappingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
