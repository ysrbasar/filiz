'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'

interface Product {
  id: string
  slug: string
  name: string
  description: string
  price: number
  stock: number
  images: string[]
  category: string
  featured: boolean
}

interface Props {
  product: Product
  index?: number
}

export function ProductCard({ product, index = 0 }: Props) {
  const addItem = useCartStore((s) => s.addItem)

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
      className="group bg-white rounded-3xl overflow-hidden shadow-filiz hover:shadow-filiz-hover transition-all border border-primary-100"
    >
      <Link href={`/magaza/${product.slug}`} className="block">
        <div className="relative h-48 bg-earth-100 overflow-hidden">
          {product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-16 h-16 text-earth-200" />
            </div>
          )}
          {product.featured && (
            <div className="absolute top-3 left-3">
              <span className="bg-accent-gold text-white text-xs font-bold px-2.5 py-1 rounded-full">
                Öne Çıkan
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link href={`/magaza/${product.slug}`}>
          <h3 className="font-display font-bold text-text-primary text-base mb-1 group-hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-xs text-text-secondary line-clamp-2 mb-3">{product.description}</p>
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-bold text-primary-600">{product.price.toFixed(2)} ₺</span>
          </div>
          <Button
            size="sm"
            className="bg-primary-400 hover:bg-primary-500 rounded-xl"
            disabled={product.stock === 0}
            onClick={() => addItem({
              id: product.id,
              type: 'product',
              slug: product.slug,
              name: product.name,
              price: product.price,
              image: product.images[0] ?? '',
            })}
          >
            <ShoppingCart className="w-4 h-4 mr-1.5" />
            Ekle
          </Button>
        </div>
      </div>
    </motion.article>
  )
}
