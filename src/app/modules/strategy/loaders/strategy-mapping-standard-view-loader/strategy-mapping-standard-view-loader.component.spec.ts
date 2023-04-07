import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingStandardViewLoaderComponent } from './strategy-mapping-standard-view-loader.component';

describe('StrategyMappingStandardViewLoaderComponent', () => {
  let component: StrategyMappingStandardViewLoaderComponent;
  let fixture: ComponentFixture<StrategyMappingStandardViewLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingStandardViewLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingStandardViewLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
