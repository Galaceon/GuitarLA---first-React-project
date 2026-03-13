
import { useState, useEffect } from "react"
import { db } from '../data/db'

export const useCart = () => {

    const initialCart = () => {
        const localStorageCart = localStorage.getItem('cart')

        if (!localStorageCart) return []

        const parsed = JSON.parse(localStorageCart)

        return Array.isArray(parsed)
            ? parsed.filter(item => item && item.quantity)
            : []
    }
    
    const [data] = useState(db)
    const [cart, setCart] = useState(initialCart)

    const MAX_ITEMS = 5
    const MIN_ITEMS = 1

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addToCart(item) {
        const itemExists = cart.findIndex(guitar => guitar.id === item.id)

        if(itemExists >= 0) {
            if(cart[itemExists].quantity >= MAX_ITEMS) return

            const updatedCart = [...cart];
            updatedCart[itemExists].quantity++
            setCart(updatedCart);
        } else {
            item.quantity = 1
            setCart([...cart, item])
        }
    }

    function removeFromCart(id) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
    }

    function increaseQuantity(id) {
        const updatedCart = cart.map( item => {
            if(item.id === id && item.quantity < MAX_ITEMS) { // Al ser el item buscado se actualiza para updatedCart
                return {
                    ...item,
                    quantity: item.quantity + 1
                }
            }
            return item // Los items que no entran en el array se devuelven tal cual a updatedCart
        })
        setCart(updatedCart)
    }

    function decreaseQuantity(id) {
        const updatedCart = cart.map( item => {
            if(item.id === id && item.quantity > MIN_ITEMS) {
                return {
                    ...item,
                    quantity: item.quantity - 1
                }
            }
            return item
        })
        setCart(updatedCart)
    }

    function clearCart() {
        setCart([])
    }


    return {
        data,
        cart,
        addToCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart
    }
}
