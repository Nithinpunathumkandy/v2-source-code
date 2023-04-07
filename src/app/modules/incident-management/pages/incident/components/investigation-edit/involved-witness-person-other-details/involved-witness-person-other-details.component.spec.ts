import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvolvedWitnessPersonOtherDetailsComponent } from './involved-witness-person-other-details.component';

describe('InvolvedWitnessPersonOtherDetailsComponent', () => {
  let component: InvolvedWitnessPersonOtherDetailsComponent;
  let fixture: ComponentFixture<InvolvedWitnessPersonOtherDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvolvedWitnessPersonOtherDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvolvedWitnessPersonOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
