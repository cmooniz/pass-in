import fastify from "fastify"
import {serializerCompiler, validatorCompiler, ZodTypeProvider} from "fastify-type-provider-zod"
import { createEvent } from "./routes/create-event"

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)


// Métodos HTTP - GET, POST, PUT, DELETE, PATCH, OPTIONS e HEAD
// corpo da requisição (request body) post ou put
// parametros de busca (search params ou query) get
// parametros de rota (route params) get, post, put, delete, patch - identificação de recursos
// cabeçalhos (headers) contexto da requisição

app.register(createEvent)

app.listen({port: 3333}).then(() => {
	console.log("Server is running")
})
