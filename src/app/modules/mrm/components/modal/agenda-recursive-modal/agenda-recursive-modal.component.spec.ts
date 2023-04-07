import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaRecursiveModalComponent } from './agenda-recursive-modal.component';

describe('AgendaRecursiveModalComponent', () => {
  let component: AgendaRecursiveModalComponent;
  let fixture: ComponentFixture<AgendaRecursiveModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaRecursiveModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaRecursiveModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
