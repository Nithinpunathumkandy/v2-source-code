import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalCountListComponent } from './external-count-list.component';

describe('ExternalCountListComponent', () => {
  let component: ExternalCountListComponent;
  let fixture: ComponentFixture<ExternalCountListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExternalCountListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalCountListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
