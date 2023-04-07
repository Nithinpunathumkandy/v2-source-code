import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationRequestStatusesComponent } from './information-request-statuses.component';

describe('InformationRequestStatusesComponent', () => {
  let component: InformationRequestStatusesComponent;
  let fixture: ComponentFixture<InformationRequestStatusesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationRequestStatusesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationRequestStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
