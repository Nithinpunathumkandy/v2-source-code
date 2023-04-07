import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCaStatusModalComponent } from './update-ca-status-modal.component';

describe('UpdateCaStatusModalComponent', () => {
  let component: UpdateCaStatusModalComponent;
  let fixture: ComponentFixture<UpdateCaStatusModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCaStatusModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCaStatusModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
