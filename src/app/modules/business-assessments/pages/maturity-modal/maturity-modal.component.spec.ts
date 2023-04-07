import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityModalComponent } from './maturity-modal.component';

describe('MaturityModalComponent', () => {
  let component: MaturityModalComponent;
  let fixture: ComponentFixture<MaturityModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
