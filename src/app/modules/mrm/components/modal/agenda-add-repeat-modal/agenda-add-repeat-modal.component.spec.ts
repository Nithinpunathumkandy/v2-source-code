import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaAddRepeatModalComponent } from './agenda-add-repeat-modal.component';

describe('AgendaAddRepeatModalComponent', () => {
  let component: AgendaAddRepeatModalComponent;
  let fixture: ComponentFixture<AgendaAddRepeatModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaAddRepeatModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaAddRepeatModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
