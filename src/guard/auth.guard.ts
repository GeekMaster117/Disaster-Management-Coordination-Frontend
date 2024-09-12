import { Injectable } from "@angular/core";
import { CanActivate, Router} from "@angular/router";
import { AuthService } from "./auth.service";
import { APIResponse } from "../response/api.response";

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {
    public constructor(private router: Router, private service: AuthService) {}

    public async isLoggedIn(): Promise<string> {
        return new Promise((resolve, reject) => {
            let tokenExists: boolean = localStorage.getItem('token') != null &&
            localStorage.getItem('tokenExpiry') != null &&
            new Date(localStorage.getItem('tokenExpiry')!) > new Date()

            if (!tokenExists)
            {
                reject('token not found')
                return
            }

            this.service.getValidateToken()
            .subscribe({
                error: (errorData: any) => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('tokenExpiry')
                    alert('UNAUTHORIZED, YOU SHOULD NOT CREATE OR ALTER TOKEN IN ANY WAY!!!')
                    this.router.navigate(['admin/login'])
                    reject(errorData.error.message)
                },
                complete: () => resolve('token valid')
            })
        })
    }

    public async canActivate(): Promise<boolean> {
        let returnBool: boolean = null!
        await this.isLoggedIn()
        .then(() => returnBool = true)
        .catch(() => returnBool = false)
        return returnBool
    }
}