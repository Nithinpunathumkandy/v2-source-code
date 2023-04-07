import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAprComponent } from './add-apr.component';

describe('AddAprComponent', () => {
  let component: AddAprComponent;
  let fixture: ComponentFixture<AddAprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddAprComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
