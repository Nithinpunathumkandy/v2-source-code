import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingFocusAreaInfoComponent } from './strategy-mapping-focus-area-info.component';

describe('StrategyMappingFocusAreaInfoComponent', () => {
  let component: StrategyMappingFocusAreaInfoComponent;
  let fixture: ComponentFixture<StrategyMappingFocusAreaInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingFocusAreaInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingFocusAreaInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
