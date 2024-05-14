import { Validation } from "../models";

export const validation = {
  validateUsername,
  validateEmail,
  validatePasswordSignUp,
  validatePasswordSignIn,
};

function validateUsername(username: string) {
  if (username.length == 0) {
    return {
      valid: false,
      message: "Username is required",
    } as Validation;
  }
  if (/^[a-zA-Z0-9_.]+$/.test(username) == false) {
    return {
      valid: false,
      message: "Username can contain only letters, numbers, . and _",
    } as Validation;
  }
  return {
    valid: true,
  } as Validation;
}

function validateEmail(email: string) {
  if (email.length == 0) {
    return {
      valid: false,
      message: "Email is required",
    } as Validation;
  }
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) == false) {
    return {
      valid: false,
      message: "Invalid email",
    } as Validation;
  }
  return {
    valid: true,
  } as Validation;
}

function validatePasswordSignUp(password: string) {
  if (password.length == 0) {
    return {
      valid: false,
      message: "Password is required",
    } as Validation;
  }
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password is too short",
    } as Validation;
  }
  return {
    valid: true,
  } as Validation;
}

function validatePasswordSignIn(password: string) {
  if (password.length == 0) {
    return {
      valid: false,
      message: "Password is required",
    } as Validation;
  }
  return {
    valid: true,
  } as Validation;
}
