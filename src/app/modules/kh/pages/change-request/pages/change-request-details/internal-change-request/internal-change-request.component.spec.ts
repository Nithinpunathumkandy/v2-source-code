import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalChangeRequestComponent } from './internal-change-request.component';

describe('InternalChangeRequestComponent', () => {
  let component: InternalChangeRequestComponent;
  let fixture: ComponentFixture<InternalChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InternalChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
