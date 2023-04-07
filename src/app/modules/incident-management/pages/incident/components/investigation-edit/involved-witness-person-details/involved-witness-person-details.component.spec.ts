import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvolvedWitnessPersonDetailsComponent } from './involved-witness-person-details.component';

describe('InvolvedWitnessPersonDetailsComponent', () => {
  let component: InvolvedWitnessPersonDetailsComponent;
  let fixture: ComponentFixture<InvolvedWitnessPersonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvolvedWitnessPersonDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvolvedWitnessPersonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
