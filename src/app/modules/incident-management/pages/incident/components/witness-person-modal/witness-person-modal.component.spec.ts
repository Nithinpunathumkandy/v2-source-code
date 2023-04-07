import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WitnessPersonModalComponent } from './witness-person-modal.component';

describe('WitnessPersonModalComponent', () => {
  let component: WitnessPersonModalComponent;
  let fixture: ComponentFixture<WitnessPersonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WitnessPersonModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WitnessPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
