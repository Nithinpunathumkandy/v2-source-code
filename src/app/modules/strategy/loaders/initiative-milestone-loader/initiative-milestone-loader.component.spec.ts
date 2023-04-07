import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeMilestoneLoaderComponent } from './initiative-milestone-loader.component';

describe('InitiativeMilestoneLoaderComponent', () => {
  let component: InitiativeMilestoneLoaderComponent;
  let fixture: ComponentFixture<InitiativeMilestoneLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativeMilestoneLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeMilestoneLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
