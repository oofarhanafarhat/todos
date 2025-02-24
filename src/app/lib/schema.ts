import { InferSelectModel,InferInsertModel } from "drizzle-orm"
import{serial,pgTable,varchar} from "drizzle-orm/pg-core"



export const todoTable = pgTable("games" ,{
    id: serial("id").primaryKey(),
    game : varchar("game" ,{length:300}).notNull()
})

export type Todo = InferSelectModel<typeof todoTable>
export type  newTodo = InferInsertModel<typeof todoTable>