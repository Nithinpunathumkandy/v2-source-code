import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EntranceModalComponent } from './entrance-modal.component';

describe('EntranceModalComponent', () => {
  let component: EntranceModalComponent;
  let fixture: ComponentFixture<EntranceModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EntranceModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EntranceModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
