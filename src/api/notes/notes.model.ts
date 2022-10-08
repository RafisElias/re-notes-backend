/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
import mongoose, { Schema, model, Types } from 'mongoose';
import { z } from 'zod';

const AutoIncrement = require('mongoose-sequence')(mongoose);

const NoteForSchema = z.object({
  user: z.instanceof(Types.ObjectId),
  title: z
    .string({ required_error: 'O titulo é obrigatório' })
    .min(1, 'O campo deve conter no mínimo um dígito.'),
  text: z
    .string({ required_error: 'O contudo é obrigatório' })
    .min(1, 'O campo deve conter no mínimo um dígito.'),
  completed: z.boolean().default(false)
});

export const Note = z.object({
  user: z.string(),
  title: z
    .string({ required_error: 'O titulo é obrigatório' })
    .min(1, 'O campo deve conter no mínimo um dígito.'),
  text: z
    .string({ required_error: 'O contudo é obrigatório' })
    .min(1, 'O campo deve conter no mínimo um dígito.'),
  completed: z.boolean().default(false)
});

const noteId = z.object({
  id: z.string().min(1),
  createdAt: z.date(),
  updatedAt: z.date(),
  ticket: z.number()
});

export const NoteWithId = NoteForSchema.merge(noteId);

export type TNoteProps = z.infer<typeof Note>;
export type TNoteWithIdProps = z.infer<typeof NoteWithId>;

const noteSchema = new Schema<z.infer<typeof NoteForSchema>>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'users'
    },
    title: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

noteSchema.plugin(AutoIncrement, {
  inc_field: 'ticket',
  id: 'ticketNums',
  start_seq: 500
});

noteSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform(_, ret) {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export const NotesModel = model<TNoteWithIdProps>('notes', noteSchema);
