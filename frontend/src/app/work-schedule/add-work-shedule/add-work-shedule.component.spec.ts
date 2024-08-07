import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWorkSheduleComponent } from './add-work-shedule.component';

describe('AddWorkSheduleComponent', () => {
  let component: AddWorkSheduleComponent;
  let fixture: ComponentFixture<AddWorkSheduleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWorkSheduleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddWorkSheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
