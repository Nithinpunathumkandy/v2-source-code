import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BiaScaleNewComponent } from './bia-scale-new.component';

describe('BiaScaleNewComponent', () => {
  let component: BiaScaleNewComponent;
  let fixture: ComponentFixture<BiaScaleNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BiaScaleNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BiaScaleNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
