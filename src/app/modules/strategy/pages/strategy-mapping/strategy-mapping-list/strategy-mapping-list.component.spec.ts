import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyMappingListComponent } from './strategy-mapping-list.component';

describe('StrategyMappingListComponent', () => {
  let component: StrategyMappingListComponent;
  let fixture: ComponentFixture<StrategyMappingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyMappingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyMappingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
