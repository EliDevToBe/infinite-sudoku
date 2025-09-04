import { computed, ref } from "vue";
import { hasProfanity, verifyEmail, verifyPseudo } from "@/utils";

const errorFields = ["pseudo", "email", "password", "confirmPassword"] as const;

type ErrorField = (typeof errorFields)[number];
type ErrorType =
  | "invalid"
  | "profanity"
  | "length"
  | "uppercase"
  | "required"
  | "special"
  | "number"
  | "mismatch";

type FormError = {
  field: ErrorField;
  type: ErrorType;
  message: string;
};

export const useForm = () => {
  const errors = ref<FormError[]>([]);

  const fieldsError = ref({
    email: false,
    password: false,
    pseudo: false,
    confirmPassword: false,
  });

  const hasAnyError = computed(() => {
    return Object.values(fieldsError.value).some((error) => error);
  });

  const sortedErrors = computed(() => {
    return errors.value
      .sort((a, b) => {
        const fieldSorting =
          errorFields.indexOf(a.field) - errorFields.indexOf(b.field);
        if (fieldSorting) return fieldSorting;

        // Sort by message length: longest first
        return b.message.length - a.message.length;
      })
      .slice(0, 2);
  });

  const clearErrorText = (field: ErrorField, type: ErrorType) => {
    errors.value = errors.value.filter(
      (error) => error.field !== field || error.type !== type,
    );
  };

  const resetErrors = () => {
    errors.value = [];
    fieldsError.value = {
      email: false,
      password: false,
      pseudo: false,
      confirmPassword: false,
    };
  };

  const validatePassword = (
    password: string,
    options?: {
      required?: boolean;
      length?: boolean;
      uppercase?: boolean;
      special?: boolean;
      number?: boolean;
    },
  ): boolean => {
    fieldsError.value.password = false;

    const config = options
      ? {
          required: false,
          length: false,
          uppercase: false,
          special: false,
          number: false,
          ...options,
        }
      : {
          required: true,
          length: true,
          uppercase: true,
          special: true,
          number: true,
        };

    if (config.required) {
      clearErrorText("password", "required");
      if (!password) {
        fieldsError.value.password = true;
        errors.value.push({
          field: "password",
          type: "required",
          message: "Password is required",
        });
        return false;
      }
    }

    if (config.length) {
      clearErrorText("password", "length");
      if (password.length < 8 || password.length > 32) {
        fieldsError.value.password = true;
        errors.value.push({
          field: "password",
          type: "length",
          message: "Password must be 8-32 chars long",
        });
      }
    }

    if (config.uppercase) {
      clearErrorText("password", "uppercase");
      if (!/[A-Z]/.test(password)) {
        fieldsError.value.password = true;
        errors.value.push({
          field: "password",
          type: "uppercase",
          message: "Password requires at least 1 uppercase",
        });
      }
    }

    if (config.special) {
      clearErrorText("password", "special");
      // Test if the password contains at least 1 non-alphanumeric character
      if (!/[^A-Za-z0-9\s]/.test(password)) {
        fieldsError.value.password = true;
        errors.value.push({
          field: "password",
          type: "special",
          message: "Password must have 1 special character",
        });
      }
    }

    if (config.number) {
      clearErrorText("password", "number");
      if (!/[0-9]/.test(password)) {
        fieldsError.value.password = true;
        errors.value.push({
          field: "password",
          type: "number",
          message: "Password requires at least 1 number",
        });
      }
    }

    if (fieldsError.value.password) return false;

    return true;
  };

  const confirmPasswords = (password: string, confirmPassword: string) => {
    fieldsError.value.confirmPassword = false;

    clearErrorText("confirmPassword", "mismatch");
    if (password !== confirmPassword) {
      fieldsError.value.confirmPassword = true;
      errors.value.push({
        field: "confirmPassword",
        type: "mismatch",
        message: "Passwords do not match",
      });
    }
  };

  const validateEmail = (
    email: string,
    options?: { required?: boolean; invalid?: boolean },
  ) => {
    fieldsError.value.email = false;

    const config = options
      ? {
          required: false,
          invalid: false,
          ...options,
        }
      : {
          required: true,
          invalid: true,
        };

    if (config.required) {
      clearErrorText("email", "required");
      if (!email) {
        fieldsError.value.email = true;
        errors.value.push({
          field: "email",
          type: "required",
          message: "Email is required",
        });
        return;
      }
    }

    if (config.invalid) {
      clearErrorText("email", "invalid");
      if (!verifyEmail(email)) {
        fieldsError.value.email = true;
        errors.value.push({
          field: "email",
          type: "invalid",
          message: "Invalid email format",
        });
      }
    }
  };

  const validatePseudo = (
    pseudo: string,
    options: {
      required?: boolean;
      invalid?: boolean;
      profanity?: boolean;
      length?: boolean;
    } = { required: true, invalid: true, profanity: true, length: true },
  ) => {
    fieldsError.value.pseudo = false;

    if (options.required) {
      clearErrorText("pseudo", "required");
      if (!pseudo) {
        fieldsError.value.pseudo = true;
        errors.value.push({
          field: "pseudo",
          type: "required",
          message: "Pseudo is required",
        });
        return;
      }
    }

    if (options.invalid) {
      clearErrorText("pseudo", "invalid");
      if (!verifyPseudo(pseudo)) {
        fieldsError.value.pseudo = true;
        errors.value.push({
          field: "pseudo",
          type: "invalid",
          message: "Invalid pseudo",
        });
      }
    }

    if (options.profanity) {
      clearErrorText("pseudo", "profanity");
      if (hasProfanity(pseudo)) {
        fieldsError.value.pseudo = true;
        errors.value.push({
          field: "pseudo",
          type: "profanity",
          message: "Pseudo contains profanity",
        });
      }
    }

    if (options.length) {
      clearErrorText("pseudo", "length");
      if (pseudo.length < 3 || pseudo.length > 16) {
        fieldsError.value.pseudo = true;
        errors.value.push({
          field: "pseudo",
          type: "length",
          message: "Pseudo must be 3-16 chars long",
        });
      }
    }
  };

  return {
    errors,
    fieldsError,
    hasAnyError,
    sortedErrors,
    resetErrors,
    validatePassword,
    confirmPasswords,
    validateEmail,
    validatePseudo,
  };
};
