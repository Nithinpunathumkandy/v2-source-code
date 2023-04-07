import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityModalDetailsComponent } from './maturity-modal-details.component';

describe('MaturityModalDetailsComponent', () => {
  let component: MaturityModalDetailsComponent;
  let fixture: ComponentFixture<MaturityModalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityModalDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityModalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
