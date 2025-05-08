import { z } from 'zod'

export const auctionSchema = z.object({
    item_name: z.string().min(5).max(50),
    description: z.string().min(10),
    category: z.enum(['electronics', 'art', 'fashion', 'vehicles', 'other']),
    starting_price: z.number().nonnegative(),
    buy_now: z.number().nonnegative().optional(),
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
    status: z.enum(['ongoing', 'ended']).optional(),
    images: z.array(z.string().url().min(1)).optional(),
    condition: z.enum(['new', 'used', 'refurbished']),
})