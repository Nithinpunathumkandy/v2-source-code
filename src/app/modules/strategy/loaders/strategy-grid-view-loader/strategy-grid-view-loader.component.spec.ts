import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrategyGridViewLoaderComponent } from './strategy-grid-view-loader.component';

describe('StrategyGridViewLoaderComponent', () => {
  let component: StrategyGridViewLoaderComponent;
  let fixture: ComponentFixture<StrategyGridViewLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StrategyGridViewLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StrategyGridViewLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
