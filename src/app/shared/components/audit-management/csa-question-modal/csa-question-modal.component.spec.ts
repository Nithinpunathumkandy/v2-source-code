import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CsaQuestionModalComponent } from './csa-question-modal.component';

describe('CsaQuestionModalComponent', () => {
  let component: CsaQuestionModalComponent;
  let fixture: ComponentFixture<CsaQuestionModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CsaQuestionModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CsaQuestionModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
