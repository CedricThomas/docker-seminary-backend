const { Sequelize, Model, Op } = require('sequelize');
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

class Note extends Model { }
Note.init({
    id: {
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
    },
    username: {
        type: Sequelize.STRING,
    },
    title: {
        type: Sequelize.STRING,
    },
    content: {
        type: Sequelize.JSON,
    }
}, { sequelize, modelName: 'note' });

sequelize.sync();
  
const addNote = async (username, noteDTO) => {
    const note = await Note.create({ username, title: noteDTO.title, content: noteDTO.content });
    return note.id;
};

const getNote = async (username, id) => {
    const notes = await Note.findAll({
        where: {
            [Op.and]: [
                { id },
                { username }
            ]
        }
    });
    if (notes.length === 0) {
        return null;
    }
    return {
        id,
        title: notes[0].title,
        content: notes[0].content,
    };
};

const getNotes = async (username) => {
    const notes = await Note.findAll({
        where: {
            username
        }
    });
    return notes.map((note) => ({
        id: note.id,
        title: note.title,
        content: note.content,
    }));

};

const updateNote = async (username, id, noteDTO) => {
    const note = await getNote(username, id);
    if (note === null) {
        return null;
    }
    await Note.update(noteDTO, {
        where: {
            id,
            username
        }
    });
    return id;
};

const deleteNote = async (username, id) => {
    const note = await getNote(username, id);
    if (note === null) {
        return false;
    }
    await Note.destroy({
        where: {
            id,
            username
        }
    });
    return true;
};

module.exports = {
    addNote,
    getNote,
    getNotes,
    updateNote,
    deleteNote
};