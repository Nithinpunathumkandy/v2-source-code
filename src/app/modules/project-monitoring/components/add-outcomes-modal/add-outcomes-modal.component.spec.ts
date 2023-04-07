import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOutcomesModalComponent } from './add-outcomes-modal.component';

describe('AddOutcomesModalComponent', () => {
  let component: AddOutcomesModalComponent;
  let fixture: ComponentFixture<AddOutcomesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOutcomesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddOutcomesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
