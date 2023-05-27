import {AbstractControl} from "@angular/forms";

export function validarPassword(control: AbstractControl) {
  const pass1 = control.root.get('password')?.value;
  const pass2 = control.value;
  if (pass1 !== pass2) {
    return { passwordNoCoincide: true };
  }
  return null;
}
