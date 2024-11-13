import { formatIndianCurrency } from "@/components/sell/utils";
import { useMemo } from "react";

export const TitleField = ({ field, value, onChange, error }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className={field.icon}></i>
                </span>
                <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={onChange}
                    value={value || ""}
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export const DescriptionField = ({ field, value, onChange, error }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className={field.icon}></i>
                </span>
                <textarea
                    id={field.name}
                    name={field.name}
                    rows={4}
                    className="w-full min-h-32 pl-10 pr-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    style={{ scrollbarWidth: "thin" }}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={onChange}
                    value={value || ""}
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export const LengthField = ({ field, value, onChange, error }) => {
    return (
        <div className="space-y-2 flex-grow">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className={field.icon}></i>
                </span>
                <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={onChange}
                    value={value || ""}
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export const BreadthField = ({ field, value, onChange, error }) => {
    return (
        <div className="space-y-2 flex-grow">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className={field.icon}></i>
                </span>
                <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={onChange}
                    value={value || ""}
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};


export const AreaField = ({ length, breadth }) => {
    return (
        <div className="space-y-2 flex-grow">
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                Total Plot Area <i>(readonly)</i>
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className="ri-pencil-ruler-2-line"></i>
                </span>
                <input
                    type="text"
                    id="area"
                    name="area"
                    value={length * breadth + " sq ft." || ""}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white
                    border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Area"
                    readOnly
                />
            </div>
        </div>
    );
}

export const LocationField = ({ field, value, onChange, error }) => {
    return (
        <div className="space-y-2">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className={field.icon}></i>
                </span>
                <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={onChange}
                    value={value || ""}
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export const PriceField = ({ field, value, onChange, error }) => {
    return (
        <div className="space-y-2 flex-grow">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className={field.icon}></i>
                </span>
                <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={onChange}
                    value={value || ""}
                    required
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export const PricePerSqftField = ({ length, breadth, price, discount }) => {
    const pricePerSqft = useMemo(() => {
        const numLength = parseFloat(length);
        const numBreadth = parseFloat(breadth);
        const numPrice = parseFloat(parseInt(price.replace(/[^0-9]/g, ''), 10));
        const numDiscount = discount == null ? 0 : discount;

        if (!isNaN(numLength) && !isNaN(numBreadth) && !isNaN(numPrice) && numLength > 0 && numBreadth > 0) {
            const calculatedPricePerSqftBD = numPrice / (numLength * numBreadth);
            const calculatedPricePerSqftAD = calculatedPricePerSqftBD - (calculatedPricePerSqftBD * numDiscount / 100);
            // console.log("Price Per Square Foot: ", calculatedPricePerSqftBD);
            return calculatedPricePerSqftAD.toFixed(3);
        } else {
            return "N/A";
        }
    }, [length, breadth, price, discount]);

    return (
        <div className="space-y-2 flex-grow">
            <label htmlFor="area" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                Price Per Sq ft. <i>(readonly)</i>
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className="ri-pencil-ruler-2-line"></i>
                </span>
                <input
                    type="text"
                    value={pricePerSqft !== "N/A" ? `₹${formatIndianCurrency(pricePerSqft)}` : "₹N/A"}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white
            border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    readOnly
                />
            </div>
        </div>
    );
};

export const DiscountField = ({ field, value, onChange, error }) => {
    return (
        <div className="space-y-2 flex-grow">
            <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                {field.label}
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className={field.icon}></i>
                </span>
                <input
                    type={field.type}
                    id={field.name}
                    name={field.name}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                    onChange={onChange}
                    value={value || ""}
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export const PriceAfterDiscountField = ({ price, discount }) => {
    const priceAfterDiscount = useMemo(() => {
        const numPrice = parseFloat(parseInt(price.replace(/[^0-9]/g, ''), 10));
        // const numDiscount = parseFloat(parseInt(discount.replace(/[^0-9]/g, ''), 10));
        const numDiscount = parseFloat(discount.replace(/[^0-9.]/g, ''));

        if (!isNaN(numPrice) && !isNaN(numDiscount) && numPrice > 0 && numDiscount > 0) {
            const calculatedPriceAfterDiscount = numPrice - (numPrice * (numDiscount / 100));
            console.log("Price After Discount: ", calculatedPriceAfterDiscount);
            return calculatedPriceAfterDiscount.toFixed(2);
        } else {
            return "N/A";
        }
    }, [price, discount]);

    return (
        <div className="space-y-2 grow">
            <label htmlFor="price-after-discount" className="block text-sm font-medium text-gray-700 whitespace-nowrap">
                Price After Discount <i>(readonly)</i>
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className="ri-money-dollar-circle-line"></i>
                </span>
                <input
                    type="text"
                    id="price-after-discount"
                    name="price-after-discount"
                    value={priceAfterDiscount !== "N/A" ? `₹${formatIndianCurrency(priceAfterDiscount)}` : "₹N/A"}
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white
                    border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Price after discount"
                    readOnly
                />
            </div>
        </div>
    );
};