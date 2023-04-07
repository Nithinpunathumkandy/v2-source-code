import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAprComponent } from './edit-apr.component';

describe('EditAprComponent', () => {
  let component: EditAprComponent;
  let fixture: ComponentFixture<EditAprComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditAprComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditAprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
