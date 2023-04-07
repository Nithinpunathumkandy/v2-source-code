import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingOcViewComponent } from './strategy-mapping-oc-view.component';

describe('StrategyMappingOcViewComponent', () => {
  let component: StrategyMappingOcViewComponent;
  let fixture: ComponentFixture<StrategyMappingOcViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingOcViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingOcViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
