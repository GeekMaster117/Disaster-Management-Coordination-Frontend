import { Component, OnInit } from "@angular/core";
import { LoginService } from "./admin-login.service";
import { APIResponse } from "../../../response/api.response";
import { Router } from "@angular/router";
import { AuthGuard } from "../../../guard/auth.guard";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
    selector: 'login',
    templateUrl: './admin-login.component.html',
    styleUrl: './admin-login.component.css'
})

export class AdminLoginComponent implements OnInit {
    public constructor(private service: LoginService, private router: Router, private fb: FormBuilder, private guard: AuthGuard) { }
    public loginForm: FormGroup = null!

    public async ngOnInit(): Promise<void> {
        this.loginForm = this.fb.group({
            username: ['', [
                Validators.required
            ]],
            password: ['', [
                Validators.required
            ]]
        })
        if (await this.guard.canActivate())
            this.router.navigate(['admin/dashboard'])
    }

    public isInvalid(input: string) {
        return this.loginForm.get(input)?.invalid && 
        (this.loginForm.get(input)?.touched || this.loginForm.get(input)?.dirty)
    }

    public isInvalidSpecific(input: string, errorType: string) {
        return this.loginForm.get(input)?.hasError(errorType) && 
        (this.loginForm.get(input)?.touched || this.loginForm.get(input)?.dirty)
    }

    public hasErrors(): boolean {
        for (let control in this.loginForm.controls)
            if (this.loginForm.get(control)?.errors != null)
                return true
        return false
    }

    public login(username: HTMLInputElement, password: HTMLInputElement): void {
        if (username.value.length == 0 || password.value.length == 0)
            return
        this.service.postLogin(username.value, password.value)
        .subscribe({
            next: (data: APIResponse) => {
                console.log(data)
                localStorage.setItem('token', data.message.token)
                localStorage.setItem('tokenExpiry', data.message.expiry)
                this.router.navigate(['admin/dashboard'])
            },
            error: (errorData: any) =>  console.log(errorData.error.message),
            complete: () => {
                username.value = ''
                password.value = ''
            }
        })
    }
}