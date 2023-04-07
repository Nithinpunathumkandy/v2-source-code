import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationRequestAddModalComponent } from './information-request-add-modal.component';

describe('InformationRequestAddModalComponent', () => {
  let component: InformationRequestAddModalComponent;
  let fixture: ComponentFixture<InformationRequestAddModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformationRequestAddModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationRequestAddModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
