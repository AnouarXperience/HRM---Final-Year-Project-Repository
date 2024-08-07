import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';


export interface Holiday {
  id: number;
  description: string;
  date: string;
}


@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  constructor(private http:HttpClient) { }


   getAllHolidays(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(`${environment.baseurl}/holidays/all`);;
  }

  addHoliday(holiday: Omit<Holiday, 'id'>): Observable<Holiday> {
    return this.http.post<Holiday>(`${environment.baseurl}/holidays/add`, holiday);
  }

}











