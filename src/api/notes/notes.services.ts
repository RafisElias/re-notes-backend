import { QueryOptions } from 'mongoose';

import { NotesModel, type TNoteProps } from './notes.model';

const populateOptions = {
  path: 'user',
  select: 'username id'
};

export async function createNote(body: TNoteProps) {
  const response = await NotesModel.create(body);
  return response.populate(populateOptions);
}

export function findAllNotes(options: QueryOptions = { lean: true }) {
  return NotesModel.find({}, {}, options).populate(populateOptions).exec();
}

export function findNoteById(
  noteId: string,
  options: QueryOptions = { lean: true }
) {
  return NotesModel.findById(noteId, {}, options).populate(populateOptions);
}

export async function findAndUpdateNote(
  noteId: string,
  body: TNoteProps,
  options: QueryOptions = { lean: true }
) {
  return NotesModel.findByIdAndUpdate(noteId, body, options).populate(
    populateOptions
  );
}

export function findAndDeleteNote(
  noteId: string,
  options: QueryOptions = { lean: true, new: true }
) {
  return NotesModel.findByIdAndDelete(noteId, options);
}

export function hasDuplicateNote(noteTitle: string) {
  return NotesModel.findOne({ title: noteTitle })
    .collation({ locale: 'pt', strength: 2 })
    .lean()
    .exec();
}
