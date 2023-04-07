import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecursiveMeetingAgendaComponent } from './recursive-meeting-agenda.component';

describe('RecursiveMeetingAgendaComponent', () => {
  let component: RecursiveMeetingAgendaComponent;
  let fixture: ComponentFixture<RecursiveMeetingAgendaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecursiveMeetingAgendaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecursiveMeetingAgendaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
