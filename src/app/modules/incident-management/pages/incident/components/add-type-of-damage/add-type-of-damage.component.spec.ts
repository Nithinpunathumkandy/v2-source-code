import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTypeOfDamageComponent } from './add-type-of-damage.component';

describe('AddTypeOfDamageComponent', () => {
  let component: AddTypeOfDamageComponent;
  let fixture: ComponentFixture<AddTypeOfDamageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddTypeOfDamageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTypeOfDamageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
