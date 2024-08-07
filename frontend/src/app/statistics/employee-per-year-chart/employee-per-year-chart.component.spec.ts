import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeePerYearChartComponent } from './employee-per-year-chart.component';

describe('EmployeePerYearChartComponent', () => {
  let component: EmployeePerYearChartComponent;
  let fixture: ComponentFixture<EmployeePerYearChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeePerYearChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeePerYearChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
