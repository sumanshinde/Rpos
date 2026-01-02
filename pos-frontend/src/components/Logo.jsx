import React from 'react';
import { ChefHat } from 'lucide-react';

const Logo = ({ className = "" }) => {
    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/20">
                <ChefHat className="text-white" size={24} strokeWidth={2.5} />
            </div>
            {/* Optional text if we want to expand sidebar later */}
            {/* <span className="font-bold text-xl tracking-tight text-white">Resto<span className="text-blue-500">POS</span></span> */}
        </div>
    );
};

export default Logo;
