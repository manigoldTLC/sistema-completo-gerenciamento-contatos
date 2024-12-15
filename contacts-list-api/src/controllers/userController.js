import db from "../database.js";


export const getUsers = (req, res) => {
    db.all('SELECT * FROM users', [], (err, rows) => {
        if (err) return res.status(500).json({ error: 'Erro do servidor interno.' });
        res.json(rows);
    });
};

export const getUserById = (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Contato não encontrado.' });
        res.json(row);
    });
};

export const createUser = (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'Nome, email, e telefone são obrigatórios.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Formato de email inválido.' });
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone)) {
        return res.status(400).json({ error: 'Formato de telefone inválido. Deve conter de 10 a 15 dígitos.' });
    }

    db.run('INSERT INTO users (name, email, phone) VALUES (?, ?, ?)', [name, email, phone], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({
            statusCode: 201,
            message: 'Contato criado com sucesso.',
            user: { name, email, phone },
        });
    });
};

export const updateUser = (req, res) => {
    const { id } = req.params;
    const { name, email, phone } = req.body;

    if (!name && !email && !phone) {
        return res.status(400).json({ error: "Pelo menos um campo (nome, e-mail ou telefone) deve ser fornecido para atualização." });
    }

    let query = 'UPDATE users SET ';
    const params = [];

    if (name) {
        query += 'name = ?, ';
        params.push(name);
    }
    if (email) {
        query += 'email = ?, ';
        params.push(email);
    }
    if (phone) {
        query += 'phone = ?, ';
        params.push(phone);
    }

    query = query.slice(0, -2);
    query += ' WHERE id = ?';
    params.push(id);

    db.run(query, params, function (err) {
        if (err) return res.status(400).json({ error: err.message });

        res.json({
            statusCode: 200,
            message: 'Contato atualizado com sucesso.',
            user: {
                id,
                name: name || 'Unchanged',
                email: email || 'Unchanged',
                phone: phone || 'Unchanged',
            },
        });
    });
};

export const deleteUser = (req, res) => {
    const { id } = req.params;

    db.get('SELECT id FROM users WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!row) return res.status(404).json({ error: 'Contato não encontrado.' });

        db.run('DELETE FROM users WHERE id = ?', [id], (err) => {
            if (err) return res.status(400).json({ error: err.message });
            res.json({ statusCode: 200, message: 'Contato deletado com sucesso.' });
        });
    });
};