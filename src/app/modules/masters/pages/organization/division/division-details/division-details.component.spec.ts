import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DivisionDetailsComponent } from './division-details.component';

describe('DivisionDetailsComponent', () => {
  let component: DivisionDetailsComponent;
  let fixture: ComponentFixture<DivisionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DivisionDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DivisionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
