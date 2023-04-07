import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvolvedPersonOtherDetailsComponent } from './involved-person-other-details.component';

describe('InvolvedPersonOtherDetailsComponent', () => {
  let component: InvolvedPersonOtherDetailsComponent;
  let fixture: ComponentFixture<InvolvedPersonOtherDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvolvedPersonOtherDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvolvedPersonOtherDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
