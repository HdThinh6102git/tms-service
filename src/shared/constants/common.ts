export enum RESULT_STATUS {
  FAILED = 0,
  SUCCEED = 1,
}
export const IS_VERIFIED = true;
export const REQUEST_ID_TOKEN_HEADER = 'x-request-id';
export const FORWARDED_FOR_TOKEN_HEADER = 'x-forwarded-for';
export const VERIFICATION_TIME = 1; //minutes
export const MESSAGES = {
  REVIEWER_CAN_NOT_BE_THE_SAME_AS_REGISTRANT:
    'reviewer_can_not_be_the_same_as_registrant',
  ASSIGNMENT_NOT_EXIST: 'assignment_not_exist',
  STUDENT_PROJECT_NOT_EXIST: 'student_project_not_exist',
  THIS_TOPIC_FULLY_REGISTERED: 'this_topic_fully_registered',
  ACCESSIBLE_ONLY_TO_STUDENTS: 'accessible_only_to_students',
  TOPIC_REGISTRATION_NOT_FOUND: 'topic_registration_not_found',
  DUPLICATE_STUDENT_EMAIL: 'duplicate_student_email',
  STUDENT_NOT_EXIST: 'student_not_exist',
  USER_REGISTERED_THIS_TOPIC: 'user_registered_this_topic',
  CLASS_IS_NOT_ALLOWED: 'class_is_not_allowed',
  CLASS_IS_REQUIRED: 'class_is_required',
  CLASS_NOT_EXIST: 'class_not_exist',
  CLASS_NAME_EXIST: 'class_name_exist',
  CLASS_NOT_FOUND_IN_TRASH_BIN: 'class_not_found_in_trash_bin',
  CLASS_NOT_FOUND: 'class_not_found',
  MAJOR_NAME_EXIST: 'major_name_exist',
  MAJOR_NOT_FOUND_IN_TRASH_BIN: 'major_not_found_in_trash_bin',
  MAJOR_NOT_FOUND: 'major_not_found',
  TOPIC_NOT_FOUND_IN_TRASH_BIN: `topic_not_found_in_trash_bin`,
  TOPIC_NOT_FOUND: 'topic_not_found',
  TOPIC_REGISTRATION_PHASE_NOT_FOUND_IN_TRASH_BIN: `topic_registration_phase_not_found_in_trash_bin`,
  TOPIC_REGISTRATION_PHASE_NOT_FOUND: `topic_registration_phase_not_found`,
  USER_NOT_FOUND_IN_TRASH_BIN: 'user_not_found_in_trash_bin',
  START_AND_FINISH_YEAR_ARE_NOT_ALLOWED:
    'start_and_finish_year_are_not_allowed',
  START_AND_FINISH_YEAR_ARE_REQUIRED: 'start_and_finish_year_are_required',
  ANNOUNCEMENT_NOT_FOUND_IN_TRASH_BIN: 'announcement_not_found_in_trash_bin',
  CAN_NOT_DELETE_OTHER_USER_ANNOUNCEMENT:
    'can_not_delete_other_user_announcement',
  ANNOUNCEMENT_NOT_FOUND: `announcement_not_found`,
  VERIFICATION_CODE_NOT_EXPIRED: 'verification_code_not_expired',
  SEND_MAIL_SUCCESSFULLY: 'send_mail_successfully',
  VERIFICATION_INCORRECT: 'verification_incorrect',
  VERIFICATION_EXPIRED: 'verification_expired',
  USER_VERIFIED: 'user_verified',
  GET_SUCCEED: 'get_succeed',
  CREATED_SUCCEED: 'created_succeed',
  UPLOADED_SUCCEED: 'uploaded_succeed',
  UPDATE_SUCCEED: 'update_succeed',
  DELETED_SUCCEED: 'deleted_succeed',
  EMAIL_NOT_FOUND: `email_not_found`,
  ADMIN_NOT_FOUND: `admin_not_found`,
  TEACHER_NOT_FOUND: `teacher_not_found`,
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
