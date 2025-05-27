import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema()
export class Reminders extends Document {
    @Prop({required: true})
    chatId: number;

    @Prop({required: true})
    time: Date;

    @Prop({required: true})
    message: string;

    @Prop({default: false})
    sent: boolean;
}

export const RemindersSchema = SchemaFactory.createForClass(Reminders);