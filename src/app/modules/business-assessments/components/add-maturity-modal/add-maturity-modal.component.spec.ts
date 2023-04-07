import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMaturityModalComponent } from './add-maturity-modal.component';

describe('AddMaturityModalComponent', () => {
  let component: AddMaturityModalComponent;
  let fixture: ComponentFixture<AddMaturityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMaturityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMaturityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
