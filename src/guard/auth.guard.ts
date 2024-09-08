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

    public isLoggedIn(): boolean {
        let tokenExists: boolean = localStorage.getItem('token') != null &&
        localStorage.getItem('tokenExpiry') != null &&
        new Date(localStorage.getItem('tokenExpiry')!) > new Date()

        if (!tokenExists)
            return false

        this.service.getValidateToken(localStorage.getItem('token')!)
        .subscribe({
            next: (data: APIResponse) => AuthGuard.logInStatus = true,
            error: (errorData: any) => {
                alert('UNAUTHORIZED, YOU SHOULD NOT CREATE OR ALTER TOKEN IN ANY WAY!!!')
                this.router.navigate(['admin/login'])
            }
        })

        return true
    }

    public canActivate(): boolean {
        return this.isLoggedIn()
    }
}