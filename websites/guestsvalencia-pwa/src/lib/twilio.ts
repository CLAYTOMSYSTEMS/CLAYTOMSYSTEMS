export function getTwilioClient() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const phoneNumber = process.env.TWILIO_PHONE_NUMBER;

  if (!accountSid || !authToken || !phoneNumber) {
    console.warn('Twilio not configured - missing environment variables');
    return null;
  }

  return {
    accountSid,
    authToken,
    phoneNumber,
    // Simple wrapper for future Twilio SDK integration
    sendMessage: async (to: string, body: string) => {
      // Placeholder for Twilio API call
      console.log(`Would send SMS to ${to}: ${body}`);
      return { sid: 'placeholder' };
    }
  };
}