import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { MessagesService } from './messages.service';

@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private heroesURL = 'api/heroes'; // 웹 API 형식의 URL로 사용

  constructor(
    private http: HttpClient,
    private messageService: MessagesService,
  ) {}

  /** GET: 서버에서 히어로 목록 가져오기 */
  getHeroes(): Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesURL).pipe(
      tap(_ => this.log('fetched heroes')),
      catchError(this.handleError<Hero[]>('getHeroes', [])),
    );
  }

  /** GET: id에 해당하는 히어로 데이터 가져오기. 존재하지 않으면 404를 반환합니다. */
  getHero(id: number): Observable<Hero> {
    const url = `${this.heroesURL}/${id}`;
    return this.http
      .get<Hero>(url)
      .pipe(
        tap(
          _ => this.log(`fetched hero id = ${id}`),
          catchError(this.handleError<Hero>(`getHero id=${id}`)),
        ),
      );
  }

  private log(message: string) {
    this.messageService.add(`HeroService: ${message}`);
  }

  /**
   * HTTP 요청이 실패한 경우를 처리합니다.
   * 애플리케이션 로직 흐름은 그대로 유지됩니다.
   * @param operation - 실패한 동작의 이름
   * @param result - 기본적으로 반환할 객체
   */
  private handleError<T>(operator = 'operator', result?: T) {
    return (error: any): Observable<T> => {
      //TODO: 리모트 서버로 에러 메시지 보내기
      console.error(error); // 지금은 콘솔에 로그를 출력합니다;
      //TODO: 사용자가 이해할 수 있는 형태로 변환하기
      this.log(`${operator} failed: ${error.message}`);
      //애플리케이션 로직이 끊기지 않도록 기본값으로 받은 객체를 반환;
      return of(result as T);
    };
  }
}
