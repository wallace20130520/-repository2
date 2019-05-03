import {Injectable} from '@angular/core';
import { User } from '../models/user.model';
@Injectable()
export class Session {

  private static lastVisitedUrl: string;

  static create(user: User, token: string) {
    this.put('user', user);
    this.put('token', token);
  }
  static hasSession() {
    if (localStorage.getItem('user') && localStorage.getItem('token')) {
      return true;
    }
    return false;
  }

  static getLastVisitedUrl() {
    if (this.lastVisitedUrl) {
      return this.lastVisitedUrl;
    }
    return '';
  }

  static setLastVisitedUrl(url) {
    this.lastVisitedUrl = url;
  }


  static getToken(): string {
    return localStorage.getItem('token');
  }

  static setToken(token) {
    localStorage.setItem('token', token);
  }

  static removeToken() {
    localStorage.removeItem('token');
  }

  static put(key, value) {
    if (key === 'token') {
      localStorage.setItem(key, value);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  static getKey(key): any {
    return localStorage.getItem(key) ? localStorage.getItem(key).replace(/"/g, '') : null;
  }

  static deleteKey(key) {
    return localStorage.removeItem(key);
  }

  static get(key) {
    return JSON.parse(localStorage.getItem(key));
  }

  static getJSON(key): any {
    return JSON.parse(localStorage.getItem(key));
  }

  static destroy() {
    localStorage.clear();
    sessionStorage.clear();
  }

}
