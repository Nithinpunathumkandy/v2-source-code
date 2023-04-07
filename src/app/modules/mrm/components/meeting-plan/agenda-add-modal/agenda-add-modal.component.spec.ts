import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaAddModalComponent } from './agenda-add-modal.component';

describe('AgendaAddModalComponent', () => {
  let component: AgendaAddModalComponent;
  let fixture: ComponentFixture<AgendaAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgendaAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
