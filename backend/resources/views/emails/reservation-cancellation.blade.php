<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Reservation Cancellation</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            border: 1px solid #ddd;
            border-top: none;
            border-radius: 0 0 5px 5px;
        }
        .footer {
            margin-top: 20px;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
        .info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin: 15px 0;
        }
        .button {
            display: inline-block;
            background-color: #4F46E5;
            color: white;
            padding: 10px 20px;
            text-decoration: none;
            border-radius: 5px;
            margin-top: 15px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Pulse Fitness</h1>
        <p>Reservation Cancellation Confirmation</p>
    </div>
    
    <div class="content">
        <p>Dear {{ $reservation->user->name }},</p>
        
        <p>Your reservation for the following training session has been cancelled:</p>
        
        <div class="info">
            <p><strong>Training:</strong> {{ $reservation->trainingSession->title }}</p>
            <p><strong>Date:</strong> {{ $reservation->trainingSession->start_time->format('l, F j, Y') }}</p>
            <p><strong>Time:</strong> {{ $reservation->trainingSession->start_time->format('g:i A') }} - {{ $reservation->trainingSession->end_time->format('g:i A') }}</p>
            <p><strong>Location:</strong> {{ $reservation->trainingSession->location }}</p>
        </div>
        
        @if($reservation->cancellation_reason)
            <p><strong>Cancellation reason:</strong> {{ $reservation->cancellation_reason }}</p>
        @endif
        
        <p>If this was a mistake or if you'd like to make a new reservation, you can do so through your account on our website.</p>
        
        
        <p>If you have any questions, please don't hesitate to contact us.</p>
        
        <p>Best regards,<br>The Pulse Fitness Team</p>
    </div>
    
    <div class="footer">
        <p>&copy; {{ date('Y') }} Pulse Fitness. All rights reserved.</p>
        <p>This email was sent to {{ $reservation->user->email }}</p>
    </div>
</body>
</html>
