import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCaHistoryModalComponent } from './update-ca-history-modal.component';

describe('UpdateCaHistoryModalComponent', () => {
  let component: UpdateCaHistoryModalComponent;
  let fixture: ComponentFixture<UpdateCaHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCaHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCaHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
