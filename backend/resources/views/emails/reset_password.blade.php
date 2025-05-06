    <html>
<body>
    <h1>Reset Your Pulse Fitness Password</h1>
    <p>Hello {{ $user->name }},</p>
    <p>We received a request to reset your password. Click the link below to set a new password:</p>
    <p><a href="{{ $resetUrl }}">Reset Password</a></p>
    <p>If you did not request a password reset, please ignore this email.</p>
    <br>
    <p>Best regards,<br>Pulse Fitness Team</p>
</body>
</html>
