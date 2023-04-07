import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConfirmitiesDetialsComponent } from './non-confirmities-detials.component';

describe('NonConfirmitiesDetialsComponent', () => {
  let component: NonConfirmitiesDetialsComponent;
  let fixture: ComponentFixture<NonConfirmitiesDetialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConfirmitiesDetialsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConfirmitiesDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
