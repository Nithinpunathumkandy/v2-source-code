import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvolvedPersonDetailsComponent } from './involved-person-details.component';

describe('InvolvedPersonDetailsComponent', () => {
  let component: InvolvedPersonDetailsComponent;
  let fixture: ComponentFixture<InvolvedPersonDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvolvedPersonDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvolvedPersonDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
