import { z } from 'zod'

export const auctionSchema = z.object({
    item_name: z.string().min(5).max(50),
    description: z.string().min(10),
    category: z.enum(['electronics', 'art', 'fashion', 'vehicles', 'other']),
    auction_type: z.string(),
    starting_price: z.number().nonnegative(),
    buy_now: z.number().nonnegative().optional(),
    start_time: z.coerce.date(),
    end_time: z.coerce.date(),
    status: z.string().optional().refine(value => ['upcoming', 'live', 'ended'].includes(value), {
            message: 'Invalid status value. Allowed values are "upcoming", "live", and "ended".'
    }),
    images: z.array(z.string().url().min(1)).optional(),
    condition: z.enum(['new', 'used', 'refurbished']),
})