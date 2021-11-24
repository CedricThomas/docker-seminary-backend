const express = require('express');
const Joi = require('joi');
const { addNote, getNotes, getNote, updateNote, deleteNote } = require('./storage');
const { isValidUUIDV4 } = require('is-valid-uuid-v4');

const notesRouter = express.Router();

notesRouter.get('/', async (req, res) => {
    return res.json({ notes: await getNotes(req.username) });
});

notesRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    if (!isValidUUIDV4(id)) {
        return res.status(400).json({ error: {message: 'Invalid query'} });
    }
    const note = await getNote(req.username, id);
    if (!note) {
        return res.status(404).json({ error: {message: 'Ressource not found'} });
    }
    return res.json({ note: note });
});

notesRouter.post('/', async (req, res) => {
    const note = req.body;
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.array().items(Joi.string()).required(),
    });
    const validation = schema.validate(note);
    if (validation.error) {
        return res.status(400).json({ error: {message: 'Invalid query'} });
    }
    return res.status(201).json({ note_id: await addNote(req.username, note) });
});

notesRouter.put('/:id', async (req, res) => {
    const note = req.body;
    const id = req.params.id;
    if (!isValidUUIDV4(id)) {
        return res.status(400).json({ error: {message: 'Invalid query'} });
    }
    const schema = Joi.object({
        title: Joi.string().required(),
        content: Joi.array().items(Joi.string()).required(),
    });
    const validation = schema.validate(note);
    if (validation.error) {
        return res.status(400).json({ error: {message: 'Invalid query'} });
    }
    const newId = await updateNote(req.username, id, note);
    if (!newId) {
        return res.status(404).json({ error: { message: 'Ressource not found' } });
    } else {
        return res.status(200).json({ note_id: newId });
    }
});

notesRouter.delete('/:id', async (req, res) => {
    const id = req.params.id;
    if (!isValidUUIDV4(id)) {
        return res.status(400).json({ error: {message: 'Invalid query'} });
    }
    const result = await deleteNote(req.username, id);
    if (!result) {
        return res.status(404).json({ error: { message: 'Ressource not found' } });
    } else {
        return res.status(200).json({});
    }
});

module.exports = notesRouter;