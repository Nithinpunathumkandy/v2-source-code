import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditBcStrategyComponent } from './edit-bc-strategy.component';

describe('EditBcStrategyComponent', () => {
  let component: EditBcStrategyComponent;
  let fixture: ComponentFixture<EditBcStrategyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditBcStrategyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditBcStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
