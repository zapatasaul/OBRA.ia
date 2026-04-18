const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const databasePath = path.join(__dirname, "../../obra.sqlite");

const openDatabase = () => new sqlite3.Database(databasePath);

const runAsync = (db, sql, params = []) =>
    new Promise((resolve, reject) => {
        db.run(sql, params, function (error) {
            if (error) {
                reject(error);
                return;
            }

            resolve(this);
        });
    });

const allAsync = (db, sql, params = []) =>
    new Promise((resolve, reject) => {
        db.all(sql, params, (error, rows) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(rows);
        });
    });

const ensureColumn = async (db, columnName, columnDefinition) => {
    const columns = await allAsync(db, "PRAGMA table_info(user)");
    const columnExists = columns.some((column) => column.name === columnName);

    if (!columnExists) {
        await runAsync(db, `ALTER TABLE user ADD COLUMN ${columnDefinition}`);
    }
};

const initializeDatabase = async () => {
    const db = openDatabase();

    try {
        await runAsync(
            db,
            `CREATE TABLE IF NOT EXISTS user (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				proyectName TEXT NOT NULL,
				date TEXT,
				proyectDescription TEXT,
				location TEXT,
				conditions TEXT,
				materials TEXT,
				apiResult TEXT
			)`,
        );

        await ensureColumn(db, "conditions", "conditions TEXT");
        await ensureColumn(db, "materials", "materials TEXT");
    } finally {
        db.close();
    }
};

const saveAnalysisRequest = async ({
    proyectName,
    location,
    conditions,
    materials,
    proyectDescription = null,
}) => {
    const db = openDatabase();

    try {
        await initializeDatabase();

        const result = await runAsync(
            db,
            `INSERT INTO user (
                proyectName,
                date,
                proyectDescription,
                location,
                conditions,
                materials,
                apiResult
            ) VALUES (?, datetime('now'), ?, ?, ?, ?, ?)`,
            [
                proyectName,
                proyectDescription,
                location,
                conditions,
                materials,
                null,
            ],
        );

        return {
            id: result.lastID,
            proyectName,
            location,
            conditions,
            materials,
            proyectDescription,
        };
    } finally {
        db.close();
    }
};

const updateAnalysisResult = async (id, apiResult) => {
    const db = openDatabase();

    try {
        await initializeDatabase();

        await runAsync(
            db,
            "UPDATE user SET apiResult = ? WHERE id = ?",
            [apiResult, id],
        );
    } finally {
        db.close();
    }
};

const getBaseDatabase = async (req, res) => {
    const db = openDatabase();

    try {
        await initializeDatabase();
        const rows = await allAsync(
            db,
            "SELECT id, proyectName, date, proyectDescription, location, conditions, materials, apiResult FROM user ORDER BY id DESC",
        );

        res.json({
            message: "Base de datos lista.",
            database: "obra.sqlite",
            table: "user",
            count: rows.length,
            data: rows,
        });
    } catch (error) {
        console.error("Error al consultar la base de datos:", error);
        res.status(500).json({
            error: "No se pudo acceder a la base de datos.",
        });
    } finally {
        db.close();
    }
};

module.exports = {
    getBaseDatabase,
    initializeDatabase,
    saveAnalysisRequest,
    updateAnalysisResult,
};
