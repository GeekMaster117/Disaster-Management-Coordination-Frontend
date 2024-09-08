import { Injectable } from "@angular/core";
import { CanActivate, Router} from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    public constructor(private router: Router) {}

    public canActivate(): boolean {
        if (AuthGuard.isLoggedIn())
            return true
        return false
    }

    public static isLoggedIn(): boolean {
        return localStorage.getItem('token') != null &&
            localStorage.getItem('tokenExpiry') != null &&
            new Date(localStorage.getItem('tokenExpiry')!) > new Date()
    }
}