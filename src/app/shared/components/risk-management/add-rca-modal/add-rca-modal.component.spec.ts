import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRcaModalComponent } from './add-rca-modal.component';

describe('AddRcaModalComponent', () => {
  let component: AddRcaModalComponent;
  let fixture: ComponentFixture<AddRcaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRcaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRcaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
