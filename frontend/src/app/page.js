import Link from 'next/link'

const page = () => {
  return (
    <section className="flex flex-wrap gap-20 h-fit translate-y-12 p-6 transform justify-center items-center">
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
    </section>
  )
}

export default page