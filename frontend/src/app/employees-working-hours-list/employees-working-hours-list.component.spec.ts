import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesWorkingHoursListComponent } from './employees-working-hours-list.component';

describe('EmployeesWorkingHoursListComponent', () => {
  let component: EmployeesWorkingHoursListComponent;
  let fixture: ComponentFixture<EmployeesWorkingHoursListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeesWorkingHoursListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeesWorkingHoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
