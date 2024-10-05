import Link from 'next/link'

const page = () => {
  return (
    <main className="flex flex-wrap gap-20 h-fit m-auto transform justify-center items-center">
      <Link href="/buy"
        className="text-3xl font-semibold py-10 px-20 bg-green-500 hover:bg-green-600 rounded-lg shadow-lg transition-all duration-300"
      >
        Buy
      </Link>
      <Link href="/sell"
        className="text-3xl font-semibold py-10 px-20 bg-blue-500 hover:bg-blue-600 rounded-lg shadow-lg transition-all duration-300"
      >
        Sell
      </Link>
    </main>
  )
}

export default page