import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex items-center justify-center">
            <div className="text-center px-6 max-w-2xl">
                <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                <h2 className="text-3xl font-semibold text-gray-800 mb-6">
                    Page Not Found
                </h2>
                <div className="space-y-4 mb-8">
                    <p className="text-gray-600">
                        This might have happened for one of the following reasons:
                    </p>
                    <ul className="text-left space-y-3 mx-auto max-w-md">
                        <li className="flex items-center">
                            <span className="inline-block w-6 h-6 bg-red-100 rounded-full flex-shrink-0 mr-3">
                                <span className="block w-full h-full text-red-500 text-center">1</span>
                            </span>
                            <span className="text-gray-600">
                                The page <span className="font-medium">doesn&apos;t exist</span> or might have been deleted
                            </span>
                        </li>
                        <li className="flex items-center">
                            <span className="inline-block w-6 h-6 bg-yellow-100 rounded-full flex-shrink-0 mr-3">
                                <span className="block w-full h-full text-yellow-500 text-center">2</span>
                            </span>
                            <span className="text-gray-600">
                                The page has been <span className="font-medium">moved</span> to a different location
                            </span>
                        </li>
                        <li className="flex items-center">
                            <span className="inline-block w-6 h-6 bg-blue-100 rounded-full flex-shrink-0 mr-3">
                                <span className="block w-full h-full text-blue-500 text-center">3</span>
                            </span>
                            <span className="text-gray-600">
                                The page is <span className="font-medium">under development</span> and not yet available
                            </span>
                        </li>
                    </ul>
                </div>
                <Link
                    href="/"
                    className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                >
                    Go Back Home
                </Link>
            </div>
        </div>
    );
}