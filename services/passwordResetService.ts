// Function to verify the OTP code sent to the user's email
export const verifyOTP = async (email: string, otp: string) => {
  try {
    const response = await fetch(`http://10.108.1.0:3000/email/verify_otp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      return { success: true };
    } else {
      return { success: false, error: data.error || '無効なコードです' };
    }
  } catch (error) {
    console.error('verifyOTP error:', error);
    return { success: false, error: 'エラーが発生しました' };
  }
};

// Function to request a password reset
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  if (!email) {
    return {
      success: false,
      message: 'メールアドレスを入力してください。',
    };
  }

  try {
    const response = await fetch(`http://10.108.1.0:3000/email/request_reset_password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();

    if (response.ok) {
      return {
        success: true,
        message: `OTPコードを${email}に送信しました。`,
      };
    } else {
      return {
        success: false,
        message: data.message || '送信に失敗しました。',
      };
    }
  } catch (err) {
    console.error('送信に失敗しました', err);
    return {
      success: false,
      message: '送信に失敗しました。再度お試しください。',
    };
  }
}