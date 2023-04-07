import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingOcDivComponent } from './strategy-mapping-oc-div.component';

describe('StrategyMappingOcDivComponent', () => {
  let component: StrategyMappingOcDivComponent;
  let fixture: ComponentFixture<StrategyMappingOcDivComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingOcDivComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingOcDivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
