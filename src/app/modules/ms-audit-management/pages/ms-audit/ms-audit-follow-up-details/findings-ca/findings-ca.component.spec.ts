import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FindingsCaComponent } from './findings-ca.component';

describe('FindingsCaComponent', () => {
  let component: FindingsCaComponent;
  let fixture: ComponentFixture<FindingsCaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FindingsCaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FindingsCaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
