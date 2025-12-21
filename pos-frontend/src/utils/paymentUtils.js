// Cash Payment Utility
export const processCashPayment = async (paymentData) => {
    const response = await fetch('http://localhost:5000/api/payment/cash', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ orderData: paymentData }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to process cash payment');
    }

    return data.data;
};
