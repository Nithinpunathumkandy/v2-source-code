import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddControlsModalComponent } from './add-controls-modal.component';

describe('AddControlsModalComponent', () => {
  let component: AddControlsModalComponent;
  let fixture: ComponentFixture<AddControlsModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddControlsModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddControlsModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
