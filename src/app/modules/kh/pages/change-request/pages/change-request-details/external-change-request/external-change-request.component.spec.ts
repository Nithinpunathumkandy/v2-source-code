import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalChangeRequestComponent } from './external-change-request.component';

describe('ExternalChangeRequestComponent', () => {
  let component: ExternalChangeRequestComponent;
  let fixture: ComponentFixture<ExternalChangeRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalChangeRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalChangeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
