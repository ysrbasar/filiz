'use client'

import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useCartStore } from '@/store/cartStore'
import { Button } from '@/components/ui/button'
import { buttonVariants } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils/cn'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice, totalItems } = useCartStore()

  if (!isOpen) return null

  const total = totalPrice()
  const count = totalItems()

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={closeCart} aria-hidden="true" />

      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-primary-100">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-primary-500" />
            <h2 className="font-semibold text-lg">Sepetim</h2>
            {count > 0 && (
              <span className="bg-primary-100 text-primary-600 text-xs font-bold px-2 py-0.5 rounded-full">{count}</span>
            )}
          </div>
          <button onClick={closeCart} aria-label="Sepeti kapat" className="p-2 rounded-lg hover:bg-primary-50 transition-colors touch-target flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4 py-12">
              <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center">
                <ShoppingCart className="w-7 h-7 text-primary-300" />
              </div>
              <div>
                <p className="font-medium text-text-primary mb-1">Sepetiniz boş</p>
                <p className="text-sm text-text-secondary">Tohumlar veya ürünler ekleyerek başlayın</p>
              </div>
              <Link href="/tohum" onClick={closeCart} className={cn(buttonVariants(), 'bg-primary-400 hover:bg-primary-500')}>
                Tohumlara Göz At
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 rounded-xl bg-primary-50/50 border border-primary-100">
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-primary-100">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-text-primary truncate">{item.name}</p>
                  <p className="text-primary-500 font-semibold text-sm mt-0.5">{(item.price * item.quantity).toFixed(2)} ₺</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} aria-label="Azalt" className="w-7 h-7 rounded-lg bg-white border border-primary-200 flex items-center justify-center hover:border-primary-400 transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} aria-label="Artır" className="w-7 h-7 rounded-lg bg-white border border-primary-200 flex items-center justify-center hover:border-primary-400 transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                    <button onClick={() => removeItem(item.id)} aria-label="Kaldır" className="ml-auto p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="px-5 py-4 border-t border-primary-100 space-y-3">
            <div className="flex items-center justify-between text-sm text-text-secondary">
              <span>Kargo</span>
              <span className="text-primary-600 font-medium">{total >= 500 ? 'Ücretsiz 🎉' : '29,90 ₺'}</span>
            </div>
            <Separator className="bg-primary-100" />
            <div className="flex items-center justify-between font-semibold text-lg">
              <span>Toplam</span>
              <span className="text-primary-600">{(total + (total >= 500 ? 0 : 29.90)).toFixed(2)} ₺</span>
            </div>
            {total < 500 && (
              <p className="text-xs text-text-secondary text-center">{(500 - total).toFixed(2)} ₺ daha ekle, kargo ücretsiz!</p>
            )}
            <Link href="/odeme" onClick={closeCart} className={cn(buttonVariants(), 'w-full bg-primary-400 hover:bg-primary-500 h-12 text-base font-semibold rounded-xl justify-center')}>
              Siparişi Tamamla
            </Link>
            <Link href="/sepet" onClick={closeCart} className={cn(buttonVariants({ variant: 'outline' }), 'w-full justify-center')}>
              Sepeti Görüntüle
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
