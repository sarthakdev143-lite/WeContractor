export const StatusMessage = ({ status, errors, onClose }) => (
    <div className={`p-4 mb-6 rounded-lg ${status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
        <div className="flex items-center justify-between">
            <p className="font-semibold">
                {status === 'success'
                    ? 'Your plot has been successfully listed!'
                    : 'There was an error. Please check following queries and try again.'}
            </p>
            <button onClick={onClose} className="text-gray-600 hover:text-gray-800">
                <i className="ri-close-line" />
            </button>
        </div>
        {status === 'error' && errors && (
            <ul className="list-disc list-inside mt-2">
                {Object.entries(errors).map(([field, error]) => (
                    <li key={field}>{error}</li>
                ))}
            </ul>
        )}
    </div>
);