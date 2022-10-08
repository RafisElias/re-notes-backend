import type { Request, Response } from 'express';

import {
  createNote,
  findAllNotes,
  findNoteById,
  findAndUpdateNote,
  findAndDeleteNote
} from './notes.services';
import type { TNoteProps, TNoteWithIdProps } from './notes.model';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

/**
@desc Create a new note
@route POST api/v1/notes
@access Private
* */
export async function createNoteHandler(
  req: Request<{}, TNoteWithIdProps, TNoteProps>,
  res: Response<TNoteWithIdProps>
) {
  const result = await createNote(req.body);
  if (!result) {
    res.statusCode = 400;
    throw new Error('We had problem when try create the note');
  }
  res.statusCode = 201;
  res.send(result);
}

/**
@desc Get all notes
@route GET api/v1/notes
@access Private
* */
export async function findAllNotesHandler(
  _req: Request<{}, TNoteWithIdProps[], {}>,
  res: Response<TNoteWithIdProps[]>
) {
  const result = await findAllNotes({ lean: false });
  res.statusCode = 200;
  res.json(result);
}

/**
@desc Get note by id
@route GET api/v1/notes/:id
@access Private
* */
export async function findNoteByIdHandler(
  req: Request<ParamsWithId, TNoteWithIdProps, {}>,
  res: Response<TNoteWithIdProps>
) {
  const noteId = req.params.id;
  const result = await findNoteById(noteId, { lean: false });

  if (!result) {
    res.statusCode = 404;
    throw new Error(`Note with id "${noteId}" not found`);
  }

  res.statusCode = 200;
  res.json(result);
}

/**
@desc Update note
@route PATCH api/v1/notes/:id
@access Private
* */
export async function updateNoteHandler(
  req: Request<ParamsWithId, TNoteWithIdProps, TNoteProps>,
  res: Response<TNoteWithIdProps>
) {
  const noteId = req.params.id;
  const result = await findAndUpdateNote(noteId, req.body, {
    lean: false,
    new: true
  });

  if (!result) {
    res.statusCode = 404;
    throw new Error(`Note with id "${noteId}" not found`);
  }

  res.statusCode = 200;
  res.json(result);
}

/**
@desc Delete note
@route DELETE api/v1/notes/:id
@access Private
* */

export async function deleteNoteHandler(
  req: Request<ParamsWithId, {}, {}>,
  res: Response<{}>
) {
  const noteId = req.params.id;
  const result = await findAndDeleteNote(noteId, { new: true, lean: false });

  if (!result) {
    res.statusCode = 404;
    throw new Error(`Note with id "${noteId}" not found`);
  }

  res.sendStatus(204);
}
