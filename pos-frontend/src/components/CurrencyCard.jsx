import React from 'react';
import { DollarSign } from 'lucide-react';

const CurrencyCard = ({ currency = 'INR' }) => {
    const symbolMap = {
        INR: '₹',
        USD: '$',
        EUR: '€',
        GBP: '£',
    };
    const symbol = symbolMap[currency] || currency;

    return (
        <div className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-3">
            <DollarSign size={24} className="text-blue-600" />
            <div>
                <h3 className="text-lg font-semibold text-gray-800">Currency</h3>
                <p className="text-sm text-gray-600">{currency} ({symbol})</p>
            </div>
        </div>
    );
};

export default CurrencyCard;
