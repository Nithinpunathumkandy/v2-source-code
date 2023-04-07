import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddKriModalComponent } from './add-kri-modal.component';

describe('AddKriModalComponent', () => {
  let component: AddKriModalComponent;
  let fixture: ComponentFixture<AddKriModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddKriModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddKriModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
