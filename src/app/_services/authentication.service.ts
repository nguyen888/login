﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../_models';
import { CookieService } from 'ngx-cookie-service';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    
    

    constructor(private http: HttpClient, private cookieService: CookieService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string, remember_me: boolean) {
        return this.http.post<any>(`${environment.apiUrl}/login`, { email, password, remember_me })
            .pipe(map(user => { 
                
                this.cookieService.set('email',email);
                this.cookieService.set('password',password);
                this.cookieService.set('remember_me', "false");
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                localStorage.setItem('currentUser', JSON.stringify(user));
                this.currentUserSubject.next(user);
                return user;
            }));

    }
    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);

    }

    send_mail(email: string,) {
        return this.http.post<any>(`${environment.apiUrl}/send_mail`, { email, })
            .pipe(map(data => {
              
                return data;
            }));
    }

    change_password(token: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/update` + '/' + token, { token, password })
            .pipe(map(data => {
                return data;
            }));
    }
}