const otpStore = new Map();

function setOtp(phone, otp) {
  otpStore.set(phone, { otp, createdAt: Date.now() });
}

function getOtp(phone) {
  return otpStore.get(phone);
}

function deleteOtp(phone) {
  otpStore.delete(phone);
}

module.exports = { setOtp, getOtp, deleteOtp };
