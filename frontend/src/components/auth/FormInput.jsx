const FormInput = ({ type, name, value, onChange, placeholder, error, isLoading, className,showPasswordToggle, showPassword, onTogglePassword }) => {
    const baseClasses = "w-full px-4 py-2 border rounded-lg transition-colors duration-200 outline-none";
    const getInputClassName = () => {
        if (error) {
            return `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`;
        }
        if (value && !error) {
            return `${baseClasses} border-green-500 focus:border-green-500 focus:ring-green-500`;
        }
        return `${baseClasses} border-gray-300 focus:border-blue-500 focus:ring-blue-500`;
    };

    return (
        <div className="space-y-1">
            <div className="relative">
                <input
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className={`${getInputClassName()} ${className}`}
                    disabled={isLoading}
                    required
                />
                {showPasswordToggle === true && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                        <i className={`ri-${showPassword ? 'eye-line' : 'eye-off-line'}`} />
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>
    );
};

export default FormInput;