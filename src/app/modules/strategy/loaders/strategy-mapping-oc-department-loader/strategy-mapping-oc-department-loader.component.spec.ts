import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingOcDepartmentLoaderComponent } from './strategy-mapping-oc-department-loader.component';

describe('StrategyMappingOcDepartmentLoaderComponent', () => {
  let component: StrategyMappingOcDepartmentLoaderComponent;
  let fixture: ComponentFixture<StrategyMappingOcDepartmentLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingOcDepartmentLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingOcDepartmentLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
