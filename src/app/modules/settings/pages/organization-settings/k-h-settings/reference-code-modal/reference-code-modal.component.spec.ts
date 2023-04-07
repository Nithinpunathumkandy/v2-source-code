import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceCodeModalComponent } from './reference-code-modal.component';

describe('ReferenceCodeModalComponent', () => {
  let component: ReferenceCodeModalComponent;
  let fixture: ComponentFixture<ReferenceCodeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReferenceCodeModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceCodeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
