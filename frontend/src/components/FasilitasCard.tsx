import Link from 'next/link'
import Image from 'next/image'

export default function FasilitasCard({ title, image, href }: { title: string; image: string; href: string }) {
    return (
        <Link href={href} className="group relative block overflow-hidden rounded-lg aspect-video">
            <Image
                src={image}
                alt={title}
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40"></div>
            <h4 className="absolute bottom-4 left-4 text-white font-bold text-lg">
                {title}
            </h4>
        </Link>
    )
}
