import { AbstractControl, ValidationErrors } from "@angular/forms";

export function onlyLetters(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value
    const hasOnlyLetters: boolean = /^[a-zA-Z]+$/.test(value)
    return hasOnlyLetters ? null : {
        onlyletters: true
    }
}

export function NoSpaces(control: AbstractControl): ValidationErrors | null {
    const value: string = control.value
    const hasOnlyLettersAndSpaces: boolean = /^\S*$/.test(value)
    return hasOnlyLettersAndSpaces ? null : {
        nospaces: true
    }
}