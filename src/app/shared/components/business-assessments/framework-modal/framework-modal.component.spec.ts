import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FrameworkModalComponent } from './framework-modal.component';

describe('FrameworkModalComponent', () => {
  let component: FrameworkModalComponent;
  let fixture: ComponentFixture<FrameworkModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FrameworkModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FrameworkModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
