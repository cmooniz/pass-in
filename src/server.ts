import fastify from "fastify"
import {z} from "zod"
import {PrismaClient} from "@prisma/client"
import {generateSlug} from "./utils/generate-slug"

const app = fastify()

const prisma = new PrismaClient({
	log: ["query"]
})

// Métodos HTTP - GET, POST, PUT, DELETE, PATCH, OPTIONS e HEAD
// corpo da requisição (request body) post ou put
// parametros de busca (search params ou query) get
// parametros de rota (route params) get, post, put, delete, patch - identificação de recursos
// cabeçalhos (headers) contexto da requisição

app.post("/events", async (request, response) => {
	const createEventSchema = z.object({
		title: z.string().min(4),
		details: z.string().nullable(),
		maximumAttendees: z.number()
	})

	const {title, details, maximumAttendees} = createEventSchema.parse(request.body)

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
})

app.listen({port: 3333}).then(() => {
	console.log("Server is running")
})
