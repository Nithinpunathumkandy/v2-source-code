import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeMilestonesComponent } from './initiative-milestones.component';

describe('InitiativeMilestonesComponent', () => {
  let component: InitiativeMilestonesComponent;
  let fixture: ComponentFixture<InitiativeMilestonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativeMilestonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeMilestonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
