import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MappingObjectiveInfoComponent } from './mapping-objective-info.component';

describe('MappingObjectiveInfoComponent', () => {
  let component: MappingObjectiveInfoComponent;
  let fixture: ComponentFixture<MappingObjectiveInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MappingObjectiveInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MappingObjectiveInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
