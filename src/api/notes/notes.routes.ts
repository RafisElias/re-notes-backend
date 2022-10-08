import { Router } from 'express';
import * as NotesControllers from './notes.controllers';
import { checkIfHasDuplicate } from './notes.middleware';
import { Note } from './notes.model';
import validateRequest from '../../middleware/validateRequest.middleware';
import { ParamsWithId } from '../../interfaces/ParamsWithId';

const router = Router();

router
  .route('/')
  .get(NotesControllers.findAllNotesHandler)
  .post(
    [validateRequest({ body: Note }), checkIfHasDuplicate()],
    NotesControllers.createNoteHandler
  );

router
  .route('/:id')
  .get(
    validateRequest({ params: ParamsWithId }),
    NotesControllers.findNoteByIdHandler
  )
  .delete(
    validateRequest({ params: ParamsWithId }),
    NotesControllers.deleteNoteHandler
  )
  .patch(
    [
      validateRequest({ params: ParamsWithId, body: Note }),
      checkIfHasDuplicate()
    ],
    NotesControllers.updateNoteHandler
  );

export default router;
