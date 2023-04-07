import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaturityModalListComponent } from './maturity-modal-list.component';

describe('MaturityModalListComponent', () => {
  let component: MaturityModalListComponent;
  let fixture: ComponentFixture<MaturityModalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaturityModalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MaturityModalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
