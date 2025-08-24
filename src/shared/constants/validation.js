// Validation constants and configuration

export const VALIDATION_WEIGHTS = {
  error_keywords: 0.2,
  response_length: 0.1,
  sensitive_keywords: 0.1,
  professional_claims: 0.15,
  personal_relationship_validation: 0.2,
  personal_characteristic_validation: 0.15,
  factual_accuracy: 0.45,
};

export const ERROR_KEYWORDS = [
  "error", "fail", "cannot", "unable", "sorry", "don't know", 
  "not sure", "unclear", "ambiguous", "confused"
];

export const SENSITIVE_KEYWORDS = [
  "password", "credit card", "ssn", "personal", "private", 
  "secret", "confidential", "bank account", "social security"
];

export const PROFESSIONAL_KEYWORDS = [
  "teacher", "professor", "doctor", "engineer", "lawyer", 
  "manager", "director", "ceo", "president", "minister", 
  "university", "college", "school", "hospital", "company", 
  "corporation", "executive", "officer", "chief"
];

export const AFFIRMATIVE_KEYWORDS = [
  "yes", "right", "correct", "true", "sahi", "theek", 
  "haan", "bilkul", "exactly", "precisely"
];

export const NEGATIVE_KEYWORDS = [
  "no", "wrong", "incorrect", "false", "galat", "nahi", 
  "nope", "not", "never", "incorrectly"
];

export const SCORE_THRESHOLDS = {
  EXCELLENT: 0.85,
  GOOD: 0.7,
  FAIR: 0.5,
  POOR: 0.3,
  CRITICAL: 0.1
};

export const ENTITY_TYPES = {
  PERSON: "Person",
  PERSONAL_RELATIONSHIP: "Personal Relationship",
  PERSONAL_CHARACTERISTIC: "Personal Characteristic",
  CAPITAL: "Capital",
  COUNTRY: "Country",
  CITY: "City",
  LANDMARK: "Landmark",
  HISTORICAL_EVENT: "Historical Event",
  SCIENTIFIC_CONCEPT: "Scientific Concept",
  GENERAL: "General"
};

export const SEVERITY_LEVELS = {
  INFO: "info",
  WARN: "warn",
  CRITICAL: "critical"
};

export const VALIDATION_STATUS = {
  PENDING: "pending",
  VALIDATED: "validated",
  APPROVED: "approved",
  REJECTED: "rejected"
};

export const SOURCES = {
  MANUAL: "manual",
  CHATGPT_MODE: "chatgpt_mode",
  API: "api",
  BATCH: "batch"
};
