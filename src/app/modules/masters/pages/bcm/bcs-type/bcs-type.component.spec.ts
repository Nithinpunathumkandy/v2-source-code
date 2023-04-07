import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcsTypeComponent } from './bcs-type.component';

describe('BcsTypeComponent', () => {
  let component: BcsTypeComponent;
  let fixture: ComponentFixture<BcsTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcsTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcsTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
