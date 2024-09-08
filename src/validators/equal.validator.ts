import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms"

export function equal(control1: string, control2: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const value1: any = control.get(control1)?.value
        const value2: any = control.get(control2)?.value
        const isEqual: boolean = value1 === value2
        let returnValue: ValidationErrors | null
        if (isEqual)
            returnValue = null
        else
            returnValue = {
                equal: true
            }
        control.get(control1)?.setErrors(returnValue)
        return returnValue
    }
}