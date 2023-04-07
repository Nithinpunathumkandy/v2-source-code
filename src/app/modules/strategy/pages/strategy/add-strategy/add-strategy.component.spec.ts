import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStrategyComponent } from './add-strategy.component';

describe('AddStrategyComponent', () => {
  let component: AddStrategyComponent;
  let fixture: ComponentFixture<AddStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddStrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
