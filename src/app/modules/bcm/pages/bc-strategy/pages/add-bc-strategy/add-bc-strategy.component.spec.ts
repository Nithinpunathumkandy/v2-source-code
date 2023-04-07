import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBcStrategyComponent } from './add-bc-strategy.component';

describe('AddBcStrategyComponent', () => {
  let component: AddBcStrategyComponent;
  let fixture: ComponentFixture<AddBcStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddBcStrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBcStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
