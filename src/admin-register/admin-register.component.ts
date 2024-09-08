import { Component, OnInit } from "@angular/core";
import { APIResponse } from "../response/api.response";
import { RegisterService } from "./admin-register.service";
import { Router } from "@angular/router";
import { AuthGuard } from "../guard/auth.guard";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Validators } from "@angular/forms";
import { atLeastOneUppercaseLetter, atLeastOneLowercaseLetter, atLeastOneNumber, atLeastOneSpecialCharacter } from "../validators/passwordValidator.validator"
import { equal } from "../validators/equal.validator";
import { onlyLetters, onlyLettersAndSpaces } from "../validators/text.validator";

@Component({
    selector: 'app-register',
    templateUrl: './admin-register.component.html',
    styleUrl: './admin-register.component.css'
})

export class AdminRegisterComponent implements OnInit {
    public constructor(private service: RegisterService, private router: Router, private fb: FormBuilder, private guard: AuthGuard) {}
    public registerForm: FormGroup = null!

    public ngOnInit(): void {
        this.registerForm = this.fb.group({
            username: ['', [
                Validators.required,
                onlyLetters
            ]],
            firstname: ['', [
                Validators.required,
                onlyLettersAndSpaces
            ]],
            lastname: ['', [
                Validators.required,
                onlyLettersAndSpaces
            ]],
            password: ['', [
                Validators.required,
                Validators.minLength(8),
                atLeastOneUppercaseLetter,
                atLeastOneLowercaseLetter,
                atLeastOneNumber,
                atLeastOneSpecialCharacter
            ]],
            confirmPassword: ['', [
                Validators.required
            ]]
        },
        {
            validator: equal('confirmPassword', 'password')
        })
        setTimeout(() => {
            if (!this.guard.isLoggedIn())
            {
                alert('Login Expired. Please login again')
                this.router.navigate(['login'])
            }
        }, 10)
    }

    public isInvalid(input: string) {
        return this.registerForm.get(input)?.invalid && 
        (this.registerForm.get(input)?.touched || this.registerForm.get(input)?.dirty)
    }

    public isInvalidSpecific(input: string, errorType: string) {
        return this.registerForm.get(input)?.hasError(errorType) && 
        (this.registerForm.get(input)?.touched || this.registerForm.get(input)?.dirty)
    }

    public hasErrors(): boolean {
        for (let control in this.registerForm.controls)
            if (this.registerForm.get(control)?.errors != null)
                return true
        return false
    }

    public register(username: HTMLInputElement, firstname: HTMLInputElement, lastname: HTMLInputElement, password: HTMLInputElement, confirmPassword: HTMLInputElement): void {
        this.service.postRegister(username.value, firstname.value, lastname.value, password.value, localStorage.getItem('token')!)
        .subscribe({
            next: (data: APIResponse) => {
                alert(`${username.value} is registered`)
            },
            error: (errorData: any) => {
                try {
                    console.log(errorData.error.message)
                }
                catch {
                    console.log(errorData.error)
                }
            },
            complete: () => {
                username.value = ''
                firstname.value = ''
                lastname.value = ''
                password.value = ''
            }
        })
    }
}