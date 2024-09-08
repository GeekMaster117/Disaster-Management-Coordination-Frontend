import { AbstractControl, ValidationErrors } from "@angular/forms";

export function atLeastOneUppercaseLetter(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value
    const hasUppercase: boolean = /[A-Z]/.test(value)
    return hasUppercase ? null : {
        uppercase: true
    }
}

export function atLeastOneLowercaseLetter(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value
    const hasLowercase: boolean = /[a-z]/.test(value)
    return hasLowercase ? null : {
        lowercase: true
    }
}

export function atLeastOneNumber(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value
    const hasNumber: boolean = /[0-9]/.test(value)
    return hasNumber ? null : {
        number: true
    }
}

export function atLeastOneSpecialCharacter(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value
    const hasSpecial: boolean = /[`=;',.//~!@#$%^&*()_+{}:<>?]/.test(value)
    return hasSpecial ? null : {
        special: true
    }
}