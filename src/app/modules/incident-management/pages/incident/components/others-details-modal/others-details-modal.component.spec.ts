import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OthersDetailsModalComponent } from './others-details-modal.component';

describe('OthersDetailsModalComponent', () => {
  let component: OthersDetailsModalComponent;
  let fixture: ComponentFixture<OthersDetailsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OthersDetailsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OthersDetailsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
