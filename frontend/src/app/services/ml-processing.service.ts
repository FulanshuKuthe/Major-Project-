import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MlProcessingService {
  private apiUrl = "http://localhost:4000/api/ml";

  constructor(private http: HttpClient) {}

  processHealthData(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/process`, data);
  }

  getAnalysisResults(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/results/${userId}`);
  }
}
