import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonConfirmitiesListComponent } from './non-confirmities-list.component';

describe('NonConfirmitiesListComponent', () => {
  let component: NonConfirmitiesListComponent;
  let fixture: ComponentFixture<NonConfirmitiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NonConfirmitiesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NonConfirmitiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
