/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {setGlobalOptions} = require("firebase-functions");
const {onDocumentWritten} = require("firebase-functions/v2/firestore");
const logger = require("firebase-functions/logger");
const admin = require("firebase-admin");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Initialize Firebase Admin SDK
admin.initializeApp();

// Validation function triggered when a new log document is created
exports.validateLogEntry = onDocumentWritten("logs/{docId}", async (event) => {
  const snapshot = event.data;
  if (!snapshot) {
    logger.log("No data associated with the event");
    return;
  }

  const newLog = snapshot.data();
  const logId = event.params.docId;

  logger.log(`New log entry created: ${logId}`, newLog);

  let validationScore = 0.0;
  let notes = "Validation pending.";
  let externalVerificationRequired = false;
  const validators = [];

  // Validator 1: Check if model_response contains error keywords
  if (newLog.model_response) {
    const errorKeywords = ["error", "fail", "cannot", "unable", "sorry"];
    const hasErrorKeywords = errorKeywords.some(keyword => 
      newLog.model_response.toLowerCase().includes(keyword)
    );
    if (hasErrorKeywords) {
      validationScore = Math.max(validationScore, 0.1);
      notes = "Model response contains error keywords.";
      externalVerificationRequired = true;
      validators.push({
        name: "error_keywords",
        pass: false,
        score: 0.1,
        details: "Contains error-related keywords"
      });
    } else {
      validators.push({
        name: "error_keywords",
        pass: true,
        score: 0.8,
        details: "No error keywords detected"
      });
    }
  }

  // Validator 2: Check response length (too short responses might be incomplete)
  if (newLog.model_response) {
    if (newLog.model_response.length < 10) {
      validationScore = Math.max(validationScore, 0.3);
      notes = "Model response is too short.";
      validators.push({
        name: "response_length",
        pass: false,
        score: 0.3,
        details: `Response length: ${newLog.model_response.length} chars (min: 10)`
      });
    } else {
      validators.push({
        name: "response_length",
        pass: true,
        score: 0.9,
        details: `Response length: ${newLog.model_response.length} chars`
      });
    }
  }

  // Validator 3: Check if user_query contains sensitive keywords
  if (newLog.user_query) {
    const sensitiveKeywords = ["password", "credit card", "ssn", "personal"];
    const hasSensitiveKeywords = sensitiveKeywords.some(keyword => 
      newLog.user_query.toLowerCase().includes(keyword)
    );
    if (hasSensitiveKeywords) {
      validationScore = Math.min(validationScore, 0.5);
      notes += " User query contains sensitive keywords.";
      externalVerificationRequired = true;
      validators.push({
        name: "sensitive_keywords",
        pass: true,
        score: 0.5,
        details: "Contains sensitive keywords"
      });
    } else {
      validators.push({
        name: "sensitive_keywords",
        pass: true,
        score: 0.9,
        details: "No sensitive keywords detected"
      });
    }
  }

  // Calculate final validation score (average of all validators)
  if (validators.length > 0) {
    const totalScore = validators.reduce((sum, validator) => sum + validator.score, 0);
    validationScore = totalScore / validators.length;
  }

  // Update the document with validation results
  try {
    await admin.firestore().collection("logs").doc(logId).update({
      validation_score: validationScore,
      notes: notes,
      external_verification_required: externalVerificationRequired,
      validators: validators,
      validated_at: admin.firestore.FieldValue.serverTimestamp(),
      status: "validated"
    });

    logger.log(`Log entry ${logId} updated with validation results. Score: ${validationScore}`);
  } catch (error) {
    logger.error(`Error updating log entry ${logId}:`, error);
  }

  return null;
});
