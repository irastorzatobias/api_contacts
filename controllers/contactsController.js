const { Contact } = require('../models');

async function findContactByIdAndUser(contactId, userId) {
    const contact = await Contact.findOne({
        where: {
            id: contactId,
            userId: userId,
        }
    });
    return contact;
}

async function getContacts(req, res) {
    try {
        const contacts = await Contact.findAll({
            where: {
                userId: req.user.id,
            }
        });
        return res.json(contacts);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'An error occurred while retrieving contacts' });
    }
}

async function getContactById(req, res) {
    const { id } = req.params;
    try {
        const contact = await findContactByIdAndUser(id, req.user.id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        return res.json(contact);
    } catch (e) {
        return res.status(500).json({ error: 'An error occurred while retrieving the contact' });
    }
}

async function createContact(req, res) {
    const { name, phone, mail } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ error: 'Missing required fields: name or phone' });
    }

    try {
        const existingContact = await Contact.findOne({
            where: {
                name: name,
                phone: phone,
                userId: req.user.id,
            },
        });

        if (existingContact) {
            return res.status(409).json({ error: 'Contact already exists' });
        }

        const contact = await Contact.create({
            userId: req.user.id,
            name: name,
            phone: phone,
            mail: mail,
        });

        return res.status(201).json(contact);
    } catch (e) {
        console.error(e);
        return res.status(500).json({ error: 'An error occurred while creating the contact' });
    }
}

async function updateContact(req, res) {
    const { name, phone, mail } = req.body;

    try {
        const contact = await findContactByIdAndUser(req.params.id, req.user.id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await Contact.update(
            { name: name, phone: phone, mail: mail },
            {
                where: {
                    id: req.params.id,
                },
            }
        );
        return res.status(200).send(`Contact ${req.params.id} updated`);
    } catch (e) {
        console.error(e);
        return res.status(500).send('An error occurred while updating the contact');
    }
}

async function deleteContact(req, res) {
    try {
        const contact = await findContactByIdAndUser(req.params.id, req.user.id);

        if (!contact) {
            return res.status(404).json({ error: 'Contact not found' });
        }

        await Contact.destroy({
            where: {
                userId: req.user.id,
                id: req.params.id,
            },
        });

        return res.status(200).send(`Contact ${contact.name} deleted`);
    } catch (e) {
        console.error(e);
        return res.status(500).send('An error occurred while deleting the contact');
    }
}

module.exports = {
    getContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
};
