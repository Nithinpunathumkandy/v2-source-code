import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MomAddRepeatModalComponent } from './mom-add-repeat-modal.component';

describe('MomAddRepeatModalComponent', () => {
  let component: MomAddRepeatModalComponent;
  let fixture: ComponentFixture<MomAddRepeatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MomAddRepeatModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MomAddRepeatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
