import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeMoreModalComponent } from './initiative-more-modal.component';

describe('InitiativeMoreModalComponent', () => {
  let component: InitiativeMoreModalComponent;
  let fixture: ComponentFixture<InitiativeMoreModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativeMoreModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeMoreModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
