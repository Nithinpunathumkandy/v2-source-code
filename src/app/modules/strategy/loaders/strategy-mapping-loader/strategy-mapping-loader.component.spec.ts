import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingLoaderComponent } from './strategy-mapping-loader.component';

describe('StrategyMappingLoaderComponent', () => {
  let component: StrategyMappingLoaderComponent;
  let fixture: ComponentFixture<StrategyMappingLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
