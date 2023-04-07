import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDeliverablesModalComponent } from './add-deliverables-modal.component';

describe('AddDeliverablesModalComponent', () => {
  let component: AddDeliverablesModalComponent;
  let fixture: ComponentFixture<AddDeliverablesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddDeliverablesModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDeliverablesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
