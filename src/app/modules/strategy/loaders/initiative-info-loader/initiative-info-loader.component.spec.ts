import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeInfoLoaderComponent } from './initiative-info-loader.component';

describe('InitiativeInfoLoaderComponent', () => {
  let component: InitiativeInfoLoaderComponent;
  let fixture: ComponentFixture<InitiativeInfoLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativeInfoLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeInfoLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
