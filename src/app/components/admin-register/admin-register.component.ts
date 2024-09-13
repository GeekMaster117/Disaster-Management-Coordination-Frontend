import { Component, OnInit } from "@angular/core";
import { APIResponse } from "../../../response/api.response";
import { RegisterService } from "./admin-register.service";
import { Router } from "@angular/router";
import { AuthGuard } from "../../../guard/auth.guard";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Validators } from "@angular/forms";
import { atLeastOneUppercaseLetter, atLeastOneLowercaseLetter, atLeastOneNumber, atLeastOneSpecialCharacter } from "../../../validators/passwordValidator.validator"
import { equal } from "../../../validators/equal.validator";
import { NoSpaces, onlyLetters } from "../../../validators/text.validator";

@Component({
    selector: 'app-register',
    templateUrl: './admin-register.component.html',
    styleUrl: './admin-register.component.css'
})

export class AdminRegisterComponent implements OnInit {
    public constructor(private service: RegisterService, private router: Router, private fb: FormBuilder, private guard: AuthGuard) {}
    public registerForm: FormGroup = null!

    public ngOnInit(): void {
        this.checkValidation()
        this.registerForm = this.fb.group({
            username: ['', [
                Validators.required,
                NoSpaces
            ]],
            firstname: ['', [
                Validators.required,
                onlyLetters
            ]],
            lastname: ['', [
                Validators.required,
                onlyLetters
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
    }

    private async checkValidation(): Promise<void> {
        while(true) {
            if (!await this.guard.canActivate())
                break
            await new Promise((resolve) => setTimeout(resolve, 1000))
        }
        alert('Your Login has expired')
        this.router.navigate(['admin/login'])
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
        this.service.postRegister(username.value, firstname.value, lastname.value, password.value)
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