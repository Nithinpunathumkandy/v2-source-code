import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FocusAreaModalComponent } from './focus-area-modal.component';

describe('FocusAreaModalComponent', () => {
  let component: FocusAreaModalComponent;
  let fixture: ComponentFixture<FocusAreaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FocusAreaModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FocusAreaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
