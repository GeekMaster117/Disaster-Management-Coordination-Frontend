import { Injectable } from "@angular/core";
import { CanActivate, Router} from "@angular/router";
import { AuthService } from "./auth.service";
import { APIResponse } from "../response/api.response";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    private static logInStatus: boolean = false
    public constructor(private router: Router, private service: AuthService) {}

    private authorize(): void {
        let tokenExists: boolean = localStorage.getItem('token') != null &&
        localStorage.getItem('tokenExpiry') != null &&
        new Date(localStorage.getItem('tokenExpiry')!) > new Date()

        if (!tokenExists)
        {
            AuthGuard.logInStatus = false
            return
        }

        this.service.getValidateToken(localStorage.getItem('token')!)
        .subscribe({
            next: (data: APIResponse) => AuthGuard.logInStatus = true,
            error: (errorData: any) => {
                AuthGuard.logInStatus = false
                alert('UNAUTHORIZED, YOU SHOULD NOT CREATE OR ALTER TOKEN IN ANY WAY!!!')
                this.router.navigate(['admin/login'])
            }
        })
    }

    public canActivate(): boolean {
        this.authorize()
        return AuthGuard.isLoggedIn()
    }

    public static isLoggedIn(): boolean {
        return AuthGuard.logInStatus
    }
}