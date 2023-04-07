import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpmProcessMappingComponent } from './bpm-process-mapping.component';

describe('BpmProcessMappingComponent', () => {
  let component: BpmProcessMappingComponent;
  let fixture: ComponentFixture<BpmProcessMappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BpmProcessMappingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BpmProcessMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
