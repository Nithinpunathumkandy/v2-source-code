import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvolvedPersonModalComponent } from './involved-person-modal.component';

describe('InvolvedPersonModalComponent', () => {
  let component: InvolvedPersonModalComponent;
  let fixture: ComponentFixture<InvolvedPersonModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvolvedPersonModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvolvedPersonModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
