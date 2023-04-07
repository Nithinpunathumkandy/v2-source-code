import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingOcLoaderComponent } from './strategy-mapping-oc-loader.component';

describe('StrategyMappingOcLoaderComponent', () => {
  let component: StrategyMappingOcLoaderComponent;
  let fixture: ComponentFixture<StrategyMappingOcLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingOcLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingOcLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
