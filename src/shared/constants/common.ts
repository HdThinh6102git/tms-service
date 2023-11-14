export enum RESULT_STATUS {
  FAILED = 0,
  SUCCEED = 1,
}
export const IS_VERIFIED = true;
export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';
export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';
export const VERIFICATION_TIME = 1; //minutes
export const MESSAGES = {
  VERIFICATION_CODE_NOT_EXPIRED: 'verification_code_not_expired',
  SEND_MAIL_SUCCESSFULLY: 'send_mail_successfully',
  VERIFICATION_INCORRECT: 'verification_incorrect',
  VERIFICATION_EXPIRED: 'verification_expired',
  USER_VERIFIED: 'user_verified',
  GET_SUCCEED: 'get_succeed',
  CREATED_SUCCEED: 'created_succeed',
  UPLOADED_SUCCEED: 'uploaded_succeed',
  UPDATE_SUCCEED: 'update_succeed',
  EMAIL_NOT_FOUND: `email_not_found`,
  NOT_FOUND_USER: 'not_found_user',
  WRONG_EMAIL_FORMAT: 'wrong_email_format',
  WRONG_PHONE_NUMBER_FORMAT: 'wrong_phone_number_format',
  PHONE_NUMBER_EXISTS: 'phone_number_exists',
  EMAIL_EXISTS: 'email_exists',
  USER_NAME_EXISTS: 'user_name_exists',
  PROVINCE_NOT_EXISTS: 'province_not_exists',
  DISTRICT_NOT_EXISTS: 'district_not_exists',
  WARD_NOT_EXISTS: 'ward_not_exists',
  IMPORT_SUCCESSFUL: 'import_successfully',
  IMPORT_FAILED: 'import_failed',
  UNAUTHORIZED: 'unauthorized',
  INCORRECT_PASSWORD: 'incorrect_password',
  UNCONFIRMED_ACCOUNT: 'unconfirmed_account',
  ACTION_NOT_PERFORMED: 'action_not_performed',
  ROLE_NOT_FOUND: 'role_not_found',
};
export const MAIL_TEMPLATE = {
  VERIFY_EMAIL_TEMPLATE: 'verify-email',
  SIGNUP_SUCCESSFULLY_EMAIL_TEMPLATE: 'signup-successfully-email',
  FORGOT_PASSWORD_TEMPLATE: 'forgot-password-email',
  UPDATE_EMAIL_TEMPLATE: 'update-email',
  VERIFY_FORGOT_EMAIL_TEMPLATE: 'verify-forgot-email',
};
