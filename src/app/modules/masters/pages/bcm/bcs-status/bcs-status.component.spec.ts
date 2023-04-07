import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BcsStatusComponent } from './bcs-status.component';

describe('BcsStatusComponent', () => {
  let component: BcsStatusComponent;
  let fixture: ComponentFixture<BcsStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BcsStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BcsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
