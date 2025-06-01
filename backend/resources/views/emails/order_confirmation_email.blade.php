<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
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
            background-color: #4f46e5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 8px 8px 0 0;
        }
        .content {
            background-color: #f9fafb;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        .order-details {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .item {
            border-bottom: 1px solid #e5e7eb;
            padding: 15px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .item:last-child {
            border-bottom: none;
        }
        .item-details {
            flex-grow: 1;
        }
        .item-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        .item-info {
            color: #6b7280;
            font-size: 14px;
        }
        .item-total {
            font-weight: bold;
            color: #4f46e5;
        }
        .total-section {
            background-color: #f3f4f6;
            padding: 20px;
            border-radius: 8px;
            margin-top: 20px;
        }
        .total-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .total-row.final {
            font-weight: bold;
            font-size: 18px;
            color: #4f46e5;
            border-top: 2px solid #e5e7eb;
            padding-top: 10px;
            margin-top: 10px;
        }
        .shipping-info {
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .section-title {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 15px;
            color: #374151;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            color: #6b7280;
            font-size: 14px;
        }
        .success-icon {
            background-color: #10b981;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 20px;
            font-size: 24px;
        }
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            .item {
                flex-direction: column;
                align-items: flex-start;
            }
            .item-total {
                margin-top: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="success-icon">✓</div>
        <h1>Order Confirmed!</h1>
        <p>Thank you for your order, {{ $order->customer_first_name }}!</p>
    </div>

    <div class="content">
        <p>We've received your order and it's being processed. Here are your order details:</p>

        <div class="order-details">
            <div class="section-title">Order Information</div>
            <p><strong>Order Number:</strong> {{ $order->order_number }}</p>
            <p><strong>Order Date:</strong> {{ $order->created_at->format('F j, Y \a\t g:i A') }}</p>
            <p><strong>Status:</strong> {{ ucfirst($order->status) }}</p>
        </div>

        <div class="order-details">
            <div class="section-title">Order Items</div>
            @foreach($order->items as $item)
            <div class="item">
                <div class="item-details">
                    <div class="item-name">{{ $item->product_name }}</div>
                    <div class="item-info">
                        Quantity: {{ $item->quantity }} × ${{ number_format($item->product_price, 2) }}
                    </div>
                </div>
                <div class="item-total">${{ number_format($item->total, 2) }}</div>
            </div>
            @endforeach

            <div class="total-section">
                <div class="total-row">
                    <span>Subtotal:</span>
                    <span>${{ number_format($order->subtotal, 2) }}</span>
                </div>
                <div class="total-row">
                    <span>Shipping:</span>
                    <span>${{ number_format($order->shipping_cost, 2) }}</span>
                </div>
                <div class="total-row final">
                    <span>Total:</span>
                    <span>${{ number_format($order->total, 2) }}</span>
                </div>
            </div>
        </div>

        <div class="shipping-info">
            <div class="section-title">Shipping Address</div>
            <p><strong>{{ $order->customer_first_name }} {{ $order->customer_last_name }}</strong></p>
            <p>{{ $order->shipping_address }}</p>
            <p>{{ $order->shipping_city }}, {{ $order->shipping_state }} {{ $order->shipping_zip_code }}</p>
            <p>{{ $order->shipping_country }}</p>
            <p><strong>Phone:</strong> {{ $order->customer_phone }}</p>
        </div>

        @if($order->notes)
        <div class="shipping-info">
            <div class="section-title">Order Notes</div>
            <p>{{ $order->notes }}</p>
        </div>
        @endif

        <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #92400e; margin-top: 0;">What's Next?</h3>
            <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                <li>We'll send you an email when your order ships</li>
                <li>You can track your order status using your order number</li>
                <li>Estimated delivery: 5-7 business days</li>
            </ul>
        </div>

        <div class="footer">
            <p>If you have any questions about your order, please contact us at support@yourstore.com</p>
            <p>Thank you for shopping with us!</p>
            <p style="margin-top: 20px; font-size: 12px;">
                This email was sent to {{ $order->customer_email }}
            </p>
        </div>
    </div>
</body>
</html>