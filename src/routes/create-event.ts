import {ZodTypeProvider} from "fastify-type-provider-zod"
import {z} from "zod"
import {generateSlug} from "../utils/generate-slug"
import {prisma} from "../lib/prisma"
import {FastifyInstance} from "fastify"

export async function createEvent(app: FastifyInstance) {
	app.withTypeProvider<ZodTypeProvider>().post(
		"/events",
		{
			schema: {
				body: z.object({
					title: z.string().min(4),
					details: z.string().nullable(),
					maximumAttendees: z.number()
				}),
				response: {
					201: z.object({
						eventId: z.string().uuid()
					})
				}
			}
		},
		async (request, response) => {
			const {title, details, maximumAttendees} = request.body

			const slug = generateSlug(title)

			const existingEvent = await prisma.event.findUnique({
				where: {
					slug
				}
			})
			if (existingEvent !== null) {
				// se for diferente de nulo, já existe um evento com esse slug
				throw new Error("Event with same title already exists")
			}

			const event = await prisma.event.create({
				data: {
					title,
					details,
					maximumAttendees,
					slug
				}
			})

			// return {eventId: event.id}
			return response.status(201).send({eventId: event.id})
		}
	)
}
