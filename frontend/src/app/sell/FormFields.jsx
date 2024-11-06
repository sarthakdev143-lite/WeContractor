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

export const BreadthField = ({ field, value, onChange, error }) => {
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

// area field
export const AreaField = ({ length, breadth }) => {
    return (
        <div className="space-y-2">
            <label htmlFor="area" className="block text-sm font-medium text-gray-700">
                Area
            </label>
            <div className="relative">
                <span className="absolute inset-y-0 left-0 flex pl-3 pt-[0.55rem] pointer-events-none text-gray-400">
                    <i className="fas fa-ruler-combined"></i>
                </span>
                <input
                    type="text"
                    id="area"
                    name="area"
                    className="w-full pl-10 pr-3 py-2 text-gray-700 bg-white
                    border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Enter area"
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

export const DiscountField = ({ field, value, onChange, error }) => {
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
                />
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
};

export { TitleField, DescriptionField, LengthField, BreadthField, LocationField, PriceField, DiscountField };